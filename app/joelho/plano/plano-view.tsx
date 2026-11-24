"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Comentario = {
  id: string;
  secao: string;
  autor: string;
  texto: string;
  resolvido: boolean;
  createdAt: string;
};

type Alvo = { secao: string; titulo: string; el: HTMLElement };
type CalcAlvo = { el: HTMLElement; config: CalcConfig };

const API = "/api/joelho/plano/comentarios";
const NOME_KEY = "plano-joelho-autor";

// O HTML do plano é estático (vem decifrado do servidor). Não pode re-renderizar,
// senão o React apaga os contêineres que montamos dentro das seções.
const Conteudo = memo(function Conteudo({ html }: { html: string }) {
  return <div className="plano" dangerouslySetInnerHTML={{ __html: html }} />;
});

export function PlanoView({ html }: { html: string }) {
  const raiz = useRef<HTMLDivElement>(null);
  const [alvos, setAlvos] = useState<Alvo[]>([]);
  const [calcs, setCalcs] = useState<CalcAlvo[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  // Só é lido no navegador: os fios de comentário não são renderizados no servidor.
  const [autor, setAutor] = useState(() => {
    try {
      return typeof window === "undefined" ? "" : (localStorage.getItem(NOME_KEY) ?? "");
    } catch {
      return "";
    }
  });

  useEffect(() => {
    const root = raiz.current;
    if (!root) return;
    const novos: Alvo[] = [];
    root.querySelectorAll<HTMLElement>("[data-sec]").forEach((sec) => {
      const pai = sec.querySelector<HTMLElement>(".wrap") ?? sec;
      let el = pai.querySelector<HTMLElement>(":scope > .coment-slot");
      if (!el) {
        el = document.createElement("div");
        el.className = "coment-slot";
        pai.appendChild(el);
      }
      novos.push({
        secao: sec.dataset.sec!,
        titulo: sec.dataset.titulo ?? sec.querySelector("h2")?.textContent ?? sec.dataset.sec!,
        el,
      });
    });
    setAlvos(novos);
    const cs: CalcAlvo[] = [];
    root.querySelectorAll<HTMLElement>("[data-calc]").forEach((el) => {
      try {
        const config = JSON.parse(el.dataset.calc!) as CalcConfig;
        if (config.cenarios?.length) cs.push({ el, config });
      } catch {}
    });
    setCalcs(cs);
  }, []);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch(API, { cache: "no-store" });
      if (r.status === 401) {
        window.location.reload();
        return;
      }
      if (!r.ok) throw new Error(String(r.status));
      setComentarios((await r.json()) as Comentario[]);
      setErro(null);
    } catch {
      setErro("Não foi possível carregar os comentários.");
    }
  }, []);

  useEffect(() => {
    const primeiro = setTimeout(carregar, 0);
    const t = setInterval(carregar, 30_000);
    return () => {
      clearTimeout(primeiro);
      clearInterval(t);
    };
  }, [carregar]);

  const salvarAutor = (nome: string) => {
    setAutor(nome);
    try {
      localStorage.setItem(NOME_KEY, nome);
    } catch {}
  };

  const abertos = comentarios.filter((c) => !c.resolvido);
  const porSecao = useMemo(() => {
    const m = new Map<string, Comentario[]>();
    for (const c of comentarios) m.set(c.secao, [...(m.get(c.secao) ?? []), c]);
    return m;
  }, [comentarios]);

  return (
    <div ref={raiz}>
      <div className="sticky top-0 z-30 border-b border-[#1F4A33]/15 bg-[#FAF7F1]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 text-[12px] text-[#4A524C] md:px-12">
          <span className="font-semibold tracking-[0.16em] text-[#1F4A33] uppercase">
            Plano · curso de joelho
          </span>
          <span aria-live="polite">
            {erro ?? `${abertos.length} comentário${abertos.length === 1 ? "" : "s"} em aberto · ${comentarios.length - abertos.length} resolvido${comentarios.length - abertos.length === 1 ? "" : "s"}`}
          </span>
          {abertos.length > 0 && (
            <a
              href={`#${abertos[0].secao}`}
              className="text-[#1F4A33] underline underline-offset-4"
            >
              Ir ao primeiro em aberto
            </a>
          )}
        </div>
      </div>
      <Conteudo html={html} />
      {alvos.map((a) =>
        createPortal(
          <Fio
            secao={a.secao}
            titulo={a.titulo}
            itens={porSecao.get(a.secao) ?? []}
            autor={autor}
            onAutor={salvarAutor}
            onMudou={carregar}
          />,
          a.el,
          a.secao,
        ),
      )}
      {calcs.map((c, i) => createPortal(<Calculadora config={c.config} />, c.el, `calc-${i}`))}
    </div>
  );
}

function Fio({
  secao,
  titulo,
  itens,
  autor,
  onAutor,
  onMudou,
}: {
  secao: string;
  titulo: string;
  itens: Comentario[];
  autor: string;
  onAutor: (s: string) => void;
  onMudou: () => Promise<void>;
}) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);
  const [verResolvidos, setVerResolvidos] = useState(false);
  const abertos = itens.filter((c) => !c.resolvido);
  const resolvidos = itens.length - abertos.length;
  const visiveis = verResolvidos ? itens : abertos;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor.trim() || !texto.trim()) return;
    setEnviando(true);
    setFalha(null);
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secao, autor: autor.trim(), texto }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setTexto("");
      await onMudou();
    } catch {
      setFalha("Não salvou. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  const resolver = async (c: Comentario) => {
    try {
      const r = await fetch(API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, resolvido: !c.resolvido }),
      });
      if (!r.ok) throw new Error(String(r.status));
      await onMudou();
    } catch {
      setFalha("Não foi possível atualizar.");
    }
  };

  const id = `fio-${secao}`;
  return (
    <div className="mt-10 border-t border-dashed border-[#1F4A33]/25 pt-4 font-sans">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-[#1F4A33] underline-offset-4 hover:underline"
      >
        <span aria-hidden className="text-[#A9650F]">{aberto ? "−" : "+"}</span>
        {abertos.length > 0
          ? `${abertos.length} comentário${abertos.length === 1 ? "" : "s"} sobre “${titulo}”`
          : `Comentar “${titulo}”`}
        {resolvidos > 0 && (
          <span className="font-normal text-[#4A524C]">· {resolvidos} resolvido{resolvidos === 1 ? "" : "s"}</span>
        )}
      </button>
      {aberto && (
        <div id={id} className="mt-3 max-w-[720px]">
          {resolvidos > 0 && (
            <button
              type="button"
              onClick={() => setVerResolvidos((v) => !v)}
              className="mb-3 min-h-9 text-[12px] text-[#4A524C] underline underline-offset-4"
            >
              {verResolvidos ? "Esconder resolvidos" : "Mostrar resolvidos"}
            </button>
          )}
          <ul className="space-y-3">
            {visiveis.map((c) => (
              <li
                key={c.id}
                className={`border-l-2 py-1 pl-4 ${c.resolvido ? "border-[#1F4A33]/20 text-[#4A524C]/70" : "border-[#E89B3C]"}`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 text-[12px] text-[#4A524C]">
                  <strong className="text-[#1F4A33]">{c.autor}</strong>
                  <time dateTime={c.createdAt}>
                    {new Date(c.createdAt).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  <button
                    type="button"
                    onClick={() => void resolver(c)}
                    className="min-h-9 text-[#1F4A33] underline underline-offset-4"
                  >
                    {c.resolvido ? "Reabrir" : "Marcar como resolvido"}
                  </button>
                </div>
                <p className="mt-1 text-[14px] leading-[1.55] whitespace-pre-wrap text-[#1A1F1B]">{c.texto}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={enviar} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-[11px] font-semibold tracking-[0.18em] text-[#1F4A33] uppercase">
              Seu nome
              <input
                value={autor}
                onChange={(e) => onAutor(e.target.value)}
                required
                maxLength={40}
                autoComplete="name"
                className="border border-[#1F4A33]/25 bg-white px-3 py-2 text-[14px] font-normal tracking-normal text-[#1A1F1B] normal-case focus:border-[#1F4A33] focus:outline-none"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold tracking-[0.18em] text-[#1F4A33] uppercase">
              Comentário
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                required
                maxLength={2000}
                rows={3}
                className="border border-[#1F4A33]/25 bg-white px-3 py-2 text-[14px] font-normal tracking-normal text-[#1A1F1B] normal-case focus:border-[#1F4A33] focus:outline-none"
              />
            </label>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={enviando}
                className="min-h-11 border border-[#1F4A33] bg-[#1F4A33] px-5 text-[12px] font-semibold tracking-[0.18em] text-[#FAF7F1] uppercase disabled:opacity-60"
              >
                {enviando ? "Salvando…" : "Comentar"}
              </button>
              {falha && (
                <span role="alert" className="text-[12px] text-red-700">
                  {falha}
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

type CalcConfig = {
  cenarios: Array<{
    nome: string;
    alunos: number;
    aluguel: number;
    anuncios: number;
    extras: number;
  }>;
  precoEstudante: number;
  precoProfissional: number;
  pctEstudantes: number;
  custoPorAluno: number;
  taxaPct: number;
};

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Calculadora({ config }: { config: CalcConfig }) {
  const [v, setV] = useState({
    alunos: config.cenarios[0].alunos,
    aluguel: config.cenarios[0].aluguel,
    anuncios: config.cenarios[0].anuncios,
    extras: config.cenarios[0].extras,
    pctEstudantes: config.pctEstudantes,
    precoEstudante: config.precoEstudante,
    precoProfissional: config.precoProfissional,
    custoPorAluno: config.custoPorAluno,
    taxaPct: config.taxaPct,
  });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: Number(e.target.value) || 0 }));

  const est = Math.round((v.alunos * v.pctEstudantes) / 100);
  const pro = v.alunos - est;
  const receita = est * v.precoEstudante + pro * v.precoProfissional;
  const taxas = (receita * v.taxaPct) / 100;
  const custos = taxas + v.alunos * v.custoPorAluno + v.aluguel + v.anuncios + v.extras;
  const resultado = receita - custos;
  const ticket = v.alunos ? receita / v.alunos : 0;
  const margemPorAluno = ticket * (1 - v.taxaPct / 100) - v.custoPorAluno;
  const empate = margemPorAluno > 0 ? Math.ceil((v.aluguel + v.anuncios + v.extras) / margemPorAluno) : null;

  const campos: Array<[keyof typeof v, string, number]> = [
    ["alunos", "Alunos pagantes", 1],
    ["pctEstudantes", "% estudantes", 5],
    ["precoEstudante", "Preço médio estudante (R$)", 10],
    ["precoProfissional", "Preço médio profissional (R$)", 10],
    ["aluguel", "Aluguel do espaço (R$)", 100],
    ["anuncios", "Anúncios (R$)", 100],
    ["extras", "Outros custos fixos (R$)", 50],
    ["custoPorAluno", "Custo por aluno (R$)", 5],
    ["taxaPct", "Taxa de pagamento (%)", 0.5],
  ];

  return (
    <div className="my-6 border border-[#1F4A33]/20 bg-white/70 p-5 font-sans md:p-7">
      <div className="mb-4 flex flex-wrap gap-2">
        {config.cenarios.map((c) => (
          <button
            key={c.nome}
            type="button"
            onClick={() => setV((s) => ({ ...s, alunos: c.alunos, aluguel: c.aluguel, anuncios: c.anuncios, extras: c.extras }))}
            className="min-h-10 border border-[#1F4A33]/30 px-3 text-[12px] font-semibold text-[#1F4A33] hover:bg-[#1F4A33] hover:text-[#FAF7F1]"
          >
            {c.nome}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-3 md:grid-cols-3">
        {campos.map(([k, rotulo, passo]) => (
          <label key={k} className="grid min-w-0 gap-1 text-[11px] font-semibold text-[#4A524C]">
            {rotulo}
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={passo}
              value={v[k]}
              onChange={set(k)}
              className="w-full min-w-0 border border-[#1F4A33]/25 bg-white px-2 py-2 text-[15px] font-normal text-[#1A1F1B] tabular-nums focus:border-[#1F4A33] focus:outline-none"
            />
          </label>
        ))}
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#1F4A33]/15 pt-5 md:grid-cols-4" aria-live="polite">
        {[
          ["Receita bruta", brl(receita)],
          ["Custos totais", brl(custos)],
          ["Resultado", brl(resultado)],
          ["Empate em", empate == null ? "—" : `${empate} aluno${empate === 1 ? "" : "s"}`],
        ].map(([k, val]) => (
          <div key={k}>
            <dt className="text-[10px] font-semibold tracking-[0.18em] text-[#4A524C] uppercase">{k}</dt>
            <dd
              className={`mt-1 text-[22px] tabular-nums ${k === "Resultado" && resultado < 0 ? "text-red-700" : "text-[#1F4A33]"}`}
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              {val}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[12px] text-[#4A524C]">
        {est} estudantes e {pro} profissionais · ticket médio {brl(ticket)}.
      </p>
    </div>
  );
}
