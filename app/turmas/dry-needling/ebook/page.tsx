import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { SmoothScrollOnHash } from "@/components/smooth-scroll-on-hash";

import { ECA, FORA, MUSCLES, OUTROS, type Muscle, type Ref, type Sig, type Status } from "./data";
import { AtlasFilter, EbookNav, FigureTabs, FilterItem, PdfButton, type Chapter as ChapterT } from "./ui";

export const metadata: Metadata = {
  title: "Manual do Curso · Dry Needling — Matheus Fernandes",
  description:
    "Manual do curso de Dry Needling: fundamentos, biossegurança, evidência por região e atlas prático com os músculos que têm ensaio clínico.",
  robots: { index: false, follow: false },
};

const FRAUNCES = "var(--font-fraunces), Georgia, serif";

const CHAPTERS: ChapterT[] = [
  { id: "uso", n: "01", title: "Como usar e a regra do curso" },
  { id: "fundamentos", n: "02", title: "Fundamentos" },
  { id: "evidencia", n: "03", title: "Como lemos a evidência" },
  { id: "biosseguranca", n: "04", title: "Biossegurança" },
  { id: "regioes", n: "05", title: "Evidência por região" },
  { id: "atlas", n: "06", title: `Atlas prático · ${MUSCLES.length} músculos` },
  { id: "fora", n: "07", title: "Fora do curso" },
  { id: "raciocinio", n: "08", title: "Raciocínio clínico e casos" },
  { id: "materiais", n: "09", title: "Materiais e insumos" },
  { id: "referencias", n: "10", title: "Referências" },
  { id: "revisao", n: "11", title: "Nota de revisão" },
];

const STATUS: Record<Status, { label: string; cls: string }> = {
  ensina: { label: "Ensinado na prática", cls: "bg-[#1F4A33] text-white" },
  ressalva: { label: "Ensinado com ressalva", cls: "bg-[#E89B3C] text-[#1F4A33]" },
  demo: { label: "Somente demonstração", cls: "border border-[#B3261E] text-[#B3261E] bg-white" },
};
const SIG: Record<Sig, { label: string; cls: string }> = {
  "+": { label: "Favorável", cls: "bg-[#DCEBDF] text-[#1F4A33]" },
  "-": { label: "Negativo", cls: "bg-[#F6D9D6] text-[#8E1E17]" },
  "=": { label: "Sem diferença", cls: "bg-[#ECE7DC] text-[#5B5340]" },
};
const MOD: Record<string, { k: string; t: string }> = {
  II: { k: "Módulo II · Sábado 13h–18h", t: "Quadrante superior — cervical, ombro e membro superior" },
  III: { k: "Módulo III · Domingo 08h–12h", t: "Coluna lombar e região pélvica" },
  IV: { k: "Módulo IV · Domingo 13h–18h", t: "Face e membro inferior" },
};

/* ------------------------------------------------------------ blocos */

function Html({ html, className }: { html: string; className?: string }) {
  // Conteúdo estático do próprio repositório (data.ts), sem entrada de usuário.
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10.5px] font-semibold tracking-[0.26em] text-[#E89B3C] uppercase">{children}</span>
  );
}

function Chap({ id, n, title, lead, children }: { id: string; n: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-[#1F4A33]/10 py-14 first:border-t-0 md:py-20 lg:scroll-mt-6">
      <Kicker>Capítulo {n}</Kicker>
      <h2 className="mt-3 mb-6 text-[clamp(30px,4.4vw,44px)] leading-[1.05] tracking-tight text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
        {title}
      </h2>
      {lead && (
        <p className="mb-8 max-w-[640px] text-[19px] leading-normal font-light text-[#4A524C]" style={{ fontFamily: FRAUNCES }}>
          {lead}
        </p>
      )}
      <div className="space-y-5 text-[16px] leading-[1.65] text-[#1A1F1B]">{children}</div>
    </section>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-4 text-[22px] leading-tight text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
      {children}
    </h3>
  );
}

function Box({ tone = "amber", children }: { tone?: "amber" | "green" | "red"; children: ReactNode }) {
  const border = { amber: "border-l-[#E89B3C]", green: "border-l-[#1F4A33]", red: "border-l-[#B3261E]" }[tone];
  return <div className={`border border-l-4 border-[#1F4A33]/12 ${border} bg-white px-5 py-4 text-[15px] leading-relaxed`}>{children}</div>;
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <>
      {/* desktop */}
      <div className="hidden overflow-hidden border border-[#1F4A33]/12 bg-white md:block">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} className="border-b-2 border-[#1F4A33] px-3 py-2.5 text-left text-[10px] font-semibold tracking-[0.16em] text-[#4A524C] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[#1F4A33]/10 last:border-0">
                {r.map((c, j) => (
                  <td key={j} className={`px-3 py-3 align-top leading-snug ${j === 0 ? "font-semibold text-[#1F4A33]" : ""}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* mobile: cada linha vira um cartão */}
      <div className="space-y-3 md:hidden">
        {rows.map((r, i) => (
          <div key={i} className="border border-[#1F4A33]/12 bg-white p-4 text-[14.5px] leading-snug">
            <p className="mb-2 font-semibold text-[#1F4A33]">{r[0]}</p>
            <dl className="space-y-2">
              {r.slice(1).map((c, j) => (
                <div key={j}>
                  <dt className="text-[9.5px] font-semibold tracking-[0.18em] text-[#4A524C] uppercase">{head[j + 1]}</dt>
                  <dd>{c}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

function Fig({ svg, label, caption }: { svg: string; label: string; caption: string }) {
  return (
    <figure className="flex h-full flex-col border border-[#1F4A33]/12 bg-[#FDFBF7]">
      <div className="aspect-4/5 p-1 md:aspect-auto md:h-[280px] [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption className="border-t border-[#1F4A33]/10 px-3 py-2 text-[12px] leading-snug text-[#4A524C]">
        <b className="text-[#1F4A33]">{label}</b> {caption}
      </figcaption>
    </figure>
  );
}

function Field({ k, v, risk }: { k: string; v: string; risk?: boolean }) {
  return (
    <div>
      <dt className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${risk ? "text-[#2F6FB3]" : "text-[#1F4A33]"}`}>{k}</dt>
      <dd className="mt-1 text-[15px] leading-[1.55]">
        <Html html={v} />
      </dd>
    </div>
  );
}

function MuscleCard({ m }: { m: Muscle }) {
  const st = STATUS[m.status];
  return (
    <article id={`m-${m.id}`} className="scroll-mt-44 border border-[#1F4A33]/15 bg-white lg:scroll-mt-32">
      <header className="flex flex-col gap-3 border-b border-[#1F4A33]/10 p-5 sm:flex-row sm:items-start sm:justify-between md:p-6">
        <div>
          <Kicker>{MOD[m.mod].k.split(" · ")[0]}</Kicker>
          <h3 className="mt-1.5 text-[28px] leading-tight text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
            {m.nome}
          </h3>
          <p className="mt-2 text-[14.5px] text-[#4A524C]">
            <b className="text-[#1A1F1B]">Indicação com evidência:</b> {m.indic}
          </p>
        </div>
        <span className={`self-start px-2.5 py-1.5 text-[10px] font-bold tracking-[0.14em] whitespace-nowrap uppercase ${st.cls}`}>{st.label}</span>
      </header>

      <div className="p-5 md:p-6">
        <FigureTabs
          a={<Fig svg={m.svgA} label="Dor referida." caption="Vermelho = zona principal; pontilhado = extensão; ✕ = ponto-gatilho." />}
          b={<Fig svg={m.svgB} label="Agulhamento." caption="Cabo âmbar; seta verde = direção; azul tracejado = risco." />}
          c={<Fig svg={m.svgC} label="Corte." caption="Ângulo, profundidade e o que está abaixo." />}
        />

        <div className="mt-5 grid gap-px border border-[#E89B3C]/40 bg-[#E89B3C]/40 text-[14px] sm:grid-cols-3">
          {[
            ["Agulha", m.agulha],
            ["Trajeto", m.trajeto],
            ["Abaixo", m.abaixo],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#FAF7F1] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#E89B3C] uppercase">{k}</p>
              <p className="mt-0.5 text-[#1F4A33]">{v}</p>
            </div>
          ))}
        </div>

        <dl className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
          <div className="space-y-4">
            <Field k="Anatomia" v={m.anat} />
            <Field k="Posição" v={m.pos} />
            <Field k="Palpação" v={m.palp} />
            <Field k="Direção da agulha" v={m.direcao} />
          </div>
          <div className="space-y-4">
            <Field k="Risco" v={m.risco} risk />
            <Field k="Dor referida" v={m.dor} />
            <Field k="Após agulhar" v={m.posAg} />
          </div>
        </dl>

        <div className="mt-7 border-t border-[#1F4A33]/10 pt-5">
          <h4 className="mb-3 text-[18px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
            Evidência
          </h4>
          <ul className="grid gap-3 md:grid-cols-2">
            {m.evid.map((e) => (
              <li key={e.cit + e.txt} className="border border-[#1F4A33]/10 bg-[#FDFBF7] p-3.5 text-[14px] leading-snug">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className={`px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.12em] uppercase ${SIG[e.sig].cls}`}>{SIG[e.sig].label}</span>
                  <b>{e.cit}</b>
                  <span className="font-semibold text-[#E89B3C]">{e.pedro.includes("/") ? `PEDro ${e.pedro}` : e.pedro}</span>
                </div>
                {e.txt}
              </li>
            ))}
          </ul>
          {m.nota && (
            <p className="mt-4 border-l-4 border-[#E89B3C] bg-[#FAF7F1] px-4 py-3 text-[14.5px] leading-relaxed">
              <Html html={m.nota} />
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function RefList({ rows }: { rows: Ref[] }) {
  return (
    <ol className="divide-y divide-[#1F4A33]/10 border-y border-[#1F4A33]/10">
      {rows.map((r) => (
        <li key={r.txt} className="grid grid-cols-[64px_1fr] gap-3 py-3 text-[14px] leading-snug">
          <span className="text-[12px] font-bold text-[#1F4A33]">{r.tag}</span>
          <span>
            <Html html={r.txt} />{" "}
            {r.pmid && (
              <a href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-[#1F4A33] underline decoration-[#E89B3C] underline-offset-2">
                PMID {r.pmid}
              </a>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------ página */

export default function EbookPage() {
  const count = (s: Status) => MUSCLES.filter((m) => m.status === s).length;

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1A1F1B]">
      <SmoothScrollOnHash />
      {/* capa */}
      <header className="bg-[#1F4A33] text-[#FAF7F1]">
        <div className="mx-auto max-w-[1200px] px-5 pt-8 pb-14 md:px-12 md:pt-10 md:pb-20">
          <Link href="/turmas/dry-needling" className="text-[11px] font-medium tracking-[0.18em] text-[#FAF7F1]/70 uppercase hover:text-[#E89B3C]">
            ← Curso de Dry Needling
          </Link>
          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">Manual do aluno · 20 h</p>
              <h1 className="mt-5 text-[clamp(52px,9vw,112px)] leading-[0.92] font-light tracking-tight" style={{ fontFamily: FRAUNCES }}>
                Dry <em className="text-[#E89B3C]">needling.</em>
              </h1>
              <p className="mt-7 max-w-[560px] text-[19px] leading-normal font-light text-[#FAF7F1]/80" style={{ fontFamily: FRAUNCES }}>
                Fundamentos, biossegurança e atlas prático baseado em evidência. Só agulhamos os músculos para os quais existem ensaios clínicos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PdfButton />
                <a href="#atlas" className="inline-flex items-center px-4 py-3 text-[11px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase ring-1 ring-[#FAF7F1]/30 hover:ring-[#E89B3C]">
                  Ir para o atlas
                </a>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-end border-t border-[#FAF7F1]/20 pt-6 text-[14px] lg:col-span-4 lg:grid-cols-1">
              {[
                ["Datas", "14 e 15 de novembro de 2026"],
                ["Local", "Clínica Aviven · Centro · São Carlos/SP"],
                ["Ministrante", "Matheus Fernandes · CREFITO 3/321383-F"],
                ["Revisão", "PubMed + PEDro em 09/11/2026"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-semibold tracking-[0.2em] text-[#E89B3C] uppercase">{k}</dt>
                  <dd className="mt-1 text-[#FAF7F1]/90">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[230px_1fr] lg:gap-14 lg:px-12 lg:pt-12">
        <EbookNav chapters={CHAPTERS} />

        <main className="min-w-0 px-4 sm:px-6 lg:px-0">
          {/* 01 */}
          <Chap id="uso" n="01" title="Como usar este manual" lead="A teoria (Módulo I) está nos capítulos 2 a 5; a prática (Módulos II a IV) está no atlas, com uma ficha por músculo.">
            <Box tone="green">
              <b>A regra do curso.</b> Um músculo só é ensinado na prática se existir pelo menos um <b>ensaio clínico aleatorizado em pacientes</b>, com desfecho clínico (dor, função ou incapacidade), em que aquele músculo foi alvo do agulhamento. Estudos em pessoas sem dor, em cadáveres ou só com medidas de laboratório não bastam. Por essa regra, seis grupos musculares da apresentação original saíram do curso.
            </Box>
            <H3>Os três níveis do atlas</H3>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["ensina", "ressalva", "demo"] as Status[]).map((s) => (
                <div key={s} className="border border-[#1F4A33]/12 bg-white p-4">
                  <span className={`inline-block px-2 py-1 text-[9.5px] font-bold tracking-[0.14em] uppercase ${STATUS[s].cls}`}>{STATUS[s].label}</span>
                  <p className="mt-3 text-[30px] leading-none text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
                    {count(s)}
                  </p>
                  <p className="mt-2 text-[14px] leading-snug text-[#4A524C]">
                    {s === "ensina" && "Ensaio(s) favorável(is) de boa qualidade (PEDro ≥ 6), com o músculo como alvo e controle sham ou ativo."}
                    {s === "ressalva" && "Ensaio favorável, mas pequeno, sem sham, só dentro de protocolo multi-músculo ou contradito por outro ensaio bom."}
                    {s === "demo" && "Evidência só indireta e risco anatômico alto. O ministrante demonstra; os alunos não praticam entre si."}
                  </p>
                </div>
              ))}
            </div>
            <H3>Como ler as figuras</H3>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><b>Dor referida:</b> vermelho sólido = zona principal; pontilhado = extensão; ✕ = ponto-gatilho.</li>
              <li><b>Agulhamento:</b> cabo âmbar; seta verde = direção de avanço; azul tracejado = estrutura de risco.</li>
              <li><b>Corte:</b> camadas da pele ao plano profundo, terminando em osso (anteparo seguro, hachurado) ou em estrutura de risco (azul).</li>
            </ul>
            <Box>
              <b>Sobre as ilustrações.</b> São esquemas originais e simplificados, feitos para este curso. Os padrões de dor referida seguem o manual de Travell, Simons &amp; Simons (Donnelly et al., 3ª ed., 2019), a referência anatômica do curso. Pelo consenso internacional, a área de dor referida varia entre pacientes e <b>não se deve esperar uma localização fixa</b> (Fernández-de-las-Peñas &amp; Dommerholt, 2018).
            </Box>
          </Chap>

          {/* 02 */}
          <Chap id="fundamentos" n="02" title="Fundamentos">
            <p>
              Intervenção minimamente invasiva que usa agulhas filiformes sólidas, sem injetar substância, para atingir tecidos miofasciais, conjuntivos e nervosos. O objetivo é tratar a dor musculoesquelética e restaurar movimento e ativação muscular. No raciocínio do curso, o DN é <b>adjuvante</b> do exercício e da terapia manual, nunca substituto.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Box tone="green"><b>Modelo radiculopático (Gunn, anos 1970).</b> A dor miofascial recorrente seria expressão de neuropatia periférica (irritação radicular). Supersensibilidade por denervação (Lei de Cannon) leva a encurtamento muscular crônico. Técnica: agulhamento paraespinal mais os músculos do miótomo (IMS).</Box>
              <Box tone="green"><b>Modelo do ponto-gatilho (Travell &amp; Simons; Hong).</b> PGM é um ponto hiperirritável numa banda tensa de músculo esquelético, com padrão de dor referida. Hong (1994) associou a resposta de contração local (LTR) ao alívio imediato; no mesmo estudo, <b>100%</b> dos pacientes do grupo DN tiveram dor pós-agulhamento.</Box>
            </div>
            <H3>Diagnóstico do ponto-gatilho</H3>
            <p>Consenso Delphi com 60 especialistas de 12 países (Fernández-de-las-Peñas &amp; Dommerholt, 2018). Critérios essenciais:</p>
            <ol className="grid gap-3 sm:grid-cols-3">
              {["Banda tensa palpável", "Ponto hipersensível na banda", "Dor referida, que pode vir como formigamento, queimação ou dor profunda"].map((t, i) => (
                <li key={t} className="border border-[#1F4A33]/12 bg-white p-4 text-[15px] leading-snug">
                  <span className="mb-1 block text-[26px] text-[#E89B3C]" style={{ fontFamily: FRAUNCES }}>{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <p><b>Ativo × latente:</b> o PGM ativo reproduz sintomas que o paciente <b>reconhece</b>; o latente dói à palpação, mas não reproduz a queixa.</p>
            <H3>Hipótese integrada</H3>
            <ol className="relative space-y-3 border-l-2 border-[#E89B3C]/50 pl-6">
              {["Liberação excessiva de acetilcolina na placa motora", "Contração sustentada dos sarcômeros", "Compressão vascular → isquemia e hipóxia", "Crise energética local (↓ ATP)", "Mediadores liberados → sensibilização de nociceptores"].map((t, i) => (
                <li key={t} className="relative">
                  <span className="absolute -left-[35px] grid h-6 w-6 place-items-center rounded-full bg-[#1F4A33] text-[12px] text-white">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="text-[14px] text-[#4A524C]">Simons, 2004; Gerwin, Dommerholt &amp; Shah, 2004. Modelo útil para raciocinar, ainda em debate. Não é mecanismo comprovado.</p>
            <H3>O que Shah realmente mostrou</H3>
            <Box>
              <p className="mb-3"><b>Shah et al., 2005</b> (J Appl Physiol): estudo laboratorial, n = 9, sem nota PEDro. Microdiálise no trapézio superior: no PGM ativo havia mais substância P, CGRP, bradicinina, TNF-α, IL-1β, serotonina e noradrenalina, e o pH era mais ácido. Após a LTR, substância P e CGRP caíram.</p>
              <p><b>Não demonstrado:</b> “pH voltando a 7,4”, queda dos demais mediadores, qualquer efeito clínico. É hipótese biológica plausível, não prova de eficácia.</p>
            </Box>
            <H3>Modulação da dor</H3>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["Segmentar", "Teoria das comportas (Melzack & Wall, 1965): aferentes de maior calibre inibem no corno posterior a transmissão nociceptiva das fibras C."],
                ["Descendente", "Modulação condicionada da dor (CPM, antiga DNIC): vias do tronco encefálico com opioides endógenos, serotonina e noradrenalina."],
                ["Periférico", "Possível alteração da química local, do fluxo sanguíneo e da atividade elétrica da placa motora. Evidência predominantemente laboratorial."],
              ].map(([k, v]) => (
                <div key={k} className="border border-[#1F4A33]/12 bg-white p-4 text-[14.5px] leading-snug">
                  <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#E89B3C] uppercase">{k}</p>
                  {v}
                </div>
              ))}
            </div>
          </Chap>

          {/* 03 */}
          <Chap id="evidencia" n="03" title="Como lemos a evidência">
            <p><b>Escala PEDro:</b> 11 itens que avaliam a qualidade metodológica de ensaios aleatorizados em fisioterapia. O item 1 não soma, então a nota vai de 0 a 10 (Cashin &amp; McAuley, 2020).</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[["9–10", "Excelente", "#1F4A33"], ["6–8", "Boa", "#2E6B4A"], ["4–5", "Regular", "#E89B3C"], ["0–3", "Baixa", "#B3261E"]].map(([n, l, c]) => (
                <div key={n} className="border border-[#1F4A33]/12 bg-white p-4">
                  <p className="text-[26px]" style={{ fontFamily: FRAUNCES, color: c }}>{n}</p>
                  <p className="text-[13px] text-[#4A524C]">{l}</p>
                </div>
              ))}
            </div>
            <ul className="list-disc space-y-2 pl-5">
              <li>Todas as notas foram conferidas no registro oficial (search.pedro.org.au) em 09/11/2026. “n. loc.” = ensaio não localizado na base PEDro.</li>
              <li>Revisões sistemáticas não recebem nota PEDro. Para elas, citamos a certeza da evidência (GRADE) quando os autores a informam.</li>
              <li><b>Nota alta não quer dizer efeito grande.</b> Cotchett et al. (2014) tem PEDro 9, e o efeito na dor do calcanhar ficou abaixo da diferença mínima clinicamente importante.</li>
              <li>“Sham” é o agulhamento simulado, o melhor controle contra o placebo do próprio agulhamento.</li>
            </ul>
            <Box>
              <b>Por que a evidência do DN é difícil de ler.</b> O efeito costuma ser de curto prazo; muitos ensaios somam o DN a outras terapias; o terapeuta raramente é cego; e protocolos com vários músculos não dizem qual músculo fez diferença. Por isso o atlas separa “ensinado” de “com ressalva”.
            </Box>
          </Chap>

          {/* 04 */}
          <Chap id="biosseguranca" n="04" title="Biossegurança">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-[#1F4A33]/12 bg-white p-5">
                <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#B3261E] uppercase">Contraindicações absolutas</p>
                <ul className="list-disc space-y-1 pl-5 text-[15px]">
                  <li>Belonefobia (fobia incontrolável de agulhas)</li><li>Recusa do paciente</li><li>Infecção local, celulite ou lesão aberta na área</li><li>Emergência médica aguda</li><li>Agulhar diretamente sobre próteses ou implantes</li>
                </ul>
              </div>
              <div className="border border-[#1F4A33]/12 bg-white p-5">
                <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#E89B3C] uppercase">Relativas · cuidados</p>
                <ul className="list-disc space-y-1 pl-5 text-[15px]">
                  <li>Anticoagulantes ou distúrbios de coagulação (hematoma)</li><li>Imunocomprometimento</li><li>Gestação: evitar região lombopélvica e pontos de forte estimulação (precaução por consenso)</li><li>Linfedema, diabetes descompensado, epilepsia não controlada</li>
                </ul>
              </div>
            </div>
            <H3>Quão seguro é agulhar</H3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-[#1F4A33]/12 bg-white p-5">
                <p className="text-[44px] leading-none text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>19,2%</p>
                <p className="mt-2 text-[14.5px]">dos 7.629 tratamentos com evento leve; <b>nenhum grave</b> (risco ≤ 0,04%). Hematoma 7,6%, sangramento 4,7%, dor durante 3,0%.</p>
                <p className="mt-2 text-[11px] tracking-[0.16em] text-[#4A524C] uppercase">Brady et al., 2014</p>
              </div>
              <div className="border border-[#1F4A33]/12 bg-white p-5">
                <p className="text-[44px] leading-none text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>&lt;0,1%</p>
                <p className="mt-2 text-[14.5px]">de eventos graves em 20.494 tratamentos (≈ 1 a cada 1.024). Eventos leves em 36,7%: sangramento 16%, hematoma 7,7%.</p>
                <p className="mt-2 text-[11px] tracking-[0.16em] text-[#4A524C] uppercase">Boyce et al., 2020</p>
              </div>
            </div>
            <Box tone="red">
              <b>Pneumotórax</b> é a complicação grave mais documentada (regiões torácica, interescapular e supraclavicular). Prevenção: palpação precisa, pinça para afastar o músculo do tórax, agulha tangencial à caixa torácica ou contra um plano ósseo, controle de profundidade. <b>Por isso os paraespinais torácicos saíram do curso.</b> Sinais de alerta após a sessão: falta de ar, dor torácica ao respirar, tosse seca → pronto-socorro.
            </Box>
            <H3>Técnica, passo a passo</H3>
            <ol className="space-y-0 divide-y divide-[#1F4A33]/10 border-y border-[#1F4A33]/10">
              {[
                "Triagem: contraindicações, medicações (anticoagulantes), experiência prévia com agulhas.",
                "Consentimento informado: objetivo, sensações esperadas (LTR, dor pós-agulhamento por 24–48 h) e riscos, incluindo pneumotórax quando aplicável.",
                "Higiene das mãos, luvas de procedimento sem pó, antissepsia da pele com álcool 70%.",
                "Agulha estéril de uso único. Palpe, posicione a mão de apoio (pinça ou plana contra o osso) e insira com o mandril.",
                "Avance na direção do atlas. Busque a LTR e a reprodução da dor reconhecida, sem insistir além do necessário.",
                "Retire, faça compressão hemostática e descarte imediatamente no coletor de perfurocortantes. Nunca reencape.",
                "Reavalie na hora (dor, ADM, teste provocativo) e prescreva o exercício pós-agulhamento.",
              ].map((t, i) => (
                <li key={t} className="flex gap-4 py-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1F4A33] text-[13px] text-white" style={{ fontFamily: FRAUNCES }}>{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <Box tone="green"><b>Dor pós-agulhamento</b> é esperada. Exercício leve logo após o DN a reduz em 24–48 h (Salom-Moreno et al., 2017, PEDro 8).</Box>
          </Chap>

          {/* 05 */}
          <Chap id="regioes" n="05" title="Evidência por região" lead="Mapa atualizado em 09/11/2026. A força é a leitura do conjunto, não de um ensaio isolado.">
            <Table
              head={["Condição", "Ensaios-chave · PEDro", "Resultado", "Força"]}
              rows={[
                ["Cervicalgia mecânica", "Gallego-Sendarrubias 2020 · 7 (+); Gattie 2021 · 7 (−); Medrano-de-la-Fuente 2024 · 8 (−); RS Navarro-Santana 2020", "↓ dor no curto prazo vs sham (DM −1,5 a −2,3); sem ganho extra num programa multimodal", "Mista"],
                ["Cefaleia tipo tensional", "Gildir 2019 · 6; RS France 2014", "↓ intensidade, frequência e duração (1 mês); RS: evidência insuficiente para recomendação forte", "Moderada"],
                ["Dor subacromial", "Arias-Buría 2017 · 8; Calvo-Lobo 2018 · 8; Imani 2021 · 7", "↓ incapacidade até 12 meses somado ao exercício; dor semelhante", "Boa"],
                ["Epicondilalgia lateral", "Uygur 2021 · 8; RS Ma 2024", "Melhor que corticoide aos 6 meses, sem atrofia cutânea", "Boa"],
                ["Lombalgia crônica", "Martín-Corrales 2020 · 8; Dar 2025 · 9; Griswold 2019 · 7 (=); RS Liu 2018", "DN glúteo + exercício ↓ dor vs sham; DN paravertebral ≈ terapia manual", "Boa (glúteo)"],
                ["OA de quadril", "Ceballos-Laita 2019 · 7; 2021 · 6", "↓ dor, ↑ força e função vs sham", "Moderada"],
                ["OA de joelho", "Pang 2022 · 9 (+, US); Dunning 2018 · 8 (+, periosteal); Sánchez-Romero 2020 · 8 (−); Agost-González 2024 · 8 (+)", "Positivo com US ou DN elétrico; DN na coxa sem ganho em 1 ano", "Mista"],
                ["Dor femoropatelar", "Espí-López 2017 · 8 (−); Zarei 2020 · 8 (+, proximal)", "Quadríceps sem benefício; glúteo médio + QL com exercício, favorável", "Fraca / mista"],
                ["Dor plantar no calcanhar", "Cotchett 2014 · 9", "↓ dor vs sham, abaixo da diferença mínima importante; NNT 4", "Moderada"],
                ["DTM miofascial", "Fernández-Carnero 2010 · 8; Dıraçoğlu 2012 · 8; McMillan 1997 · 5 (=)", "↑ abertura de boca e limiar de dor no curto prazo", "Boa (masseter)"],
              ]}
            />
            <Box><b>Fora do escopo prático:</b> DN guiado por ultrassom (Pang 2022) e DN elétrico periosteal (Dunning 2018) têm bons resultados na OA de joelho, mas exigem equipamento e treinamento que não fazem parte deste curso.</Box>
          </Chap>

          {/* 06 atlas */}
          <section id="atlas" className="scroll-mt-20 border-t border-[#1F4A33]/10 py-14 md:py-20 lg:scroll-mt-6">
            <Kicker>Capítulo 06 · Módulos II a IV</Kicker>
            <h2 className="mt-3 mb-4 text-[clamp(30px,4.4vw,44px)] leading-[1.05] tracking-tight text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
              Atlas prático
            </h2>
            <p className="mb-8 max-w-[640px] text-[19px] leading-normal font-light text-[#4A524C]" style={{ fontFamily: FRAUNCES }}>
              Uma ficha por músculo: dor referida, direção da agulha, o que está abaixo e os ensaios que sustentam a técnica.
            </p>
            <AtlasFilter items={MUSCLES.map((m) => ({ id: m.id, mod: m.mod, status: m.status, name: m.nome }))}>
              {(["II", "III", "IV"] as const).map((mod) => (
                <div key={mod} className="mb-12">
                  <div className="mb-5">
                    <Kicker>{MOD[mod].k}</Kicker>
                    <h3 className="mt-1 text-[24px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>{MOD[mod].t}</h3>
                  </div>
                  <div className="space-y-8">
                    {MUSCLES.filter((m) => m.mod === mod).map((m) => (
                      <FilterItem key={m.id} id={m.id} mod={m.mod} status={m.status} name={m.nome}>
                        <MuscleCard m={m} />
                      </FilterItem>
                    ))}
                  </div>
                </div>
              ))}
            </AtlasFilter>
          </section>

          {/* 07 */}
          <Chap id="fora" n="07" title="Fora do curso" lead="Estes músculos estavam na apresentação original. Pela regra do curso, não são ensinados.">
            <div className="grid gap-3 md:grid-cols-2">
              {FORA.map((f) => (
                <div key={f.nome} className="border border-[#1F4A33]/12 bg-white p-5">
                  <p className="mb-2 flex items-center gap-2 text-[18px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
                    <span className="text-[#B3261E]">✕</span> {f.nome}
                  </p>
                  <p className="text-[14.5px] leading-snug text-[#4A524C]"><Html html={f.motivo} /></p>
                </div>
              ))}
            </div>
            <Box>Se surgir um ensaio clínico favorável de boa qualidade, o músculo pode voltar numa próxima turma. A revisão é contínua.</Box>
          </Chap>

          {/* 08 */}
          <Chap id="raciocinio" n="08" title="Raciocínio clínico">
            <ol className="divide-y divide-[#1F4A33]/10 border-y border-[#1F4A33]/10">
              {[
                ["Triagem", "Bandeiras vermelhas e contraindicações. Dor de origem não musculoesquelética exclui o DN."],
                ["A condição tem evidência?", "Consulte o capítulo 5. Sem evidência para a condição, prefira outra conduta."],
                ["Há PGM relevante?", "Banda tensa + ponto hipersensível + dor referida reconhecida pelo paciente."],
                ["O músculo está no atlas?", "Siga a direção e o anteparo indicados. Fora do atlas = não agulhar neste curso."],
                ["Dose", "Nos ensaios do atlas: 1 a 6 sessões, 1 a 3 vezes por semana, sempre somadas a exercício ou terapia manual."],
                ["Reavaliação imediata", "Mesmo teste da avaliação. Sem mudança após 2–3 sessões, revise o raciocínio."],
                ["Exercício", "Logo após, para reduzir a dor pós-agulhamento e consolidar o ganho."],
              ].map(([k, v], i) => (
                <li key={k} className="flex gap-4 py-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1F4A33] text-[13px] text-white" style={{ fontFamily: FRAUNCES }}>{i + 1}</span>
                  <span><b>{k}.</b> {v}</span>
                </li>
              ))}
            </ol>
            <H3>Casos para discussão em grupo</H3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Epicondilalgia lateral", "Mulher, 44 anos, tenista recreativa, dor lateral no cotovelo há 4 meses; já recebeu uma infiltração. PGM no ERCC reproduz a dor no dorso do punho.", "Por que o DN é alternativa ao corticoide (Uygur 2021)? Como progredir a carga do tendão? Que estrutura proteger?", "ercc"],
                ["Dor subacromial", "Homem, 52 anos, dor ao elevar o braço; PGM no infraespinal refere para a face anterior do ombro.", "Por que associar o exercício (Arias-Buría 2017)? Que exercício prescrever logo após (Salom-Moreno 2017)?", "infra"],
                ["Cervicalgia crônica", "Mulher, 36 anos, trabalho em computador, já em programa de exercício e terapia manual. PGM no trapézio superior.", "O que Gattie 2021 e Medrano-de-la-Fuente 2024 dizem sobre somar DN a um bom programa? Quando vale a pena?", "trap"],
                ["Dor plantar no calcanhar", "Corredor, 39 anos, dor ao primeiro passo há 6 meses. PGMs no sóleo e no gastrocnêmio medial.", "O NNT de 4 e o efeito abaixo da diferença mínima importante (Cotchett 2014): como explicar isso ao paciente?", "soleo"],
              ].map(([t, c, d, id], i) => (
                <div key={t} className="flex flex-col border border-[#1F4A33]/12 bg-white p-5">
                  <Kicker>Caso {i + 1}</Kicker>
                  <p className="mt-1 mb-3 text-[20px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>{t}</p>
                  <p className="mb-3 text-[15px] leading-snug">{c}</p>
                  <p className="mb-4 text-[15px] leading-snug text-[#4A524C]"><b className="text-[#1A1F1B]">Discuta:</b> {d}</p>
                  <a href={`#m-${id}`} className="mt-auto self-start text-[11px] font-semibold tracking-[0.18em] text-[#1F4A33] uppercase underline decoration-[#E89B3C] underline-offset-4">
                    Ver no atlas →
                  </a>
                </div>
              ))}
            </div>
          </Chap>

          {/* 09 */}
          <Chap id="materiais" n="09" title="Materiais e insumos">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Agulhas filiformes estéreis", "0,25 × 13 · 0,25 × 30 · 0,25 × 40 · 0,30 × 60 · 0,30 × 75 mm"],
                ["Descarte", "Coletor de perfurocortantes (tipo Descarpack)"],
                ["Antissepsia", "Álcool 70% e algodão"],
                ["EPI", "Luvas de procedimento sem pó"],
              ].map(([k, v]) => (
                <div key={k} className="border border-[#1F4A33]/12 bg-white p-4">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#E89B3C] uppercase">{k}</p>
                  <p className="mt-1 text-[15px]">{v}</p>
                </div>
              ))}
            </div>
            <H3>Agulha por músculo</H3>
            <Table
              head={["Músculo", "Agulha", "Abaixo da agulha"]}
              rows={MUSCLES.map((m) => [
                <a key={m.id} href={`#m-${m.id}`} className="underline decoration-[#E89B3C]/60 underline-offset-2">{m.nome}</a>,
                m.agulha,
                m.abaixo,
              ])}
            />
          </Chap>

          {/* 10 */}
          <Chap id="referencias" n="10" title="Referências">
            <p className="text-[14px] text-[#4A524C]">
              Notas PEDro conferidas no registro oficial em 09/11/2026 (base atualizada em 02/11/2026); dados bibliográficos conferidos no PubMed. *Gattie 2021: nota conferida em 12/10/2026; o registro não foi reencontrado nesta revisão.
            </p>
            <details open className="group border border-[#1F4A33]/12 bg-white">
              <summary className="cursor-pointer list-none px-5 py-4 text-[18px] text-[#1F4A33] marker:hidden" style={{ fontFamily: FRAUNCES }}>
                Ensaios clínicos <span className="text-[14px] text-[#4A524C]">· {ECA.length}</span>
              </summary>
              <div className="px-5 pb-4"><RefList rows={ECA} /></div>
            </details>
            <details className="group border border-[#1F4A33]/12 bg-white">
              <summary className="cursor-pointer list-none px-5 py-4 text-[18px] text-[#1F4A33] marker:hidden" style={{ fontFamily: FRAUNCES }}>
                Revisões, segurança e outros <span className="text-[14px] text-[#4A524C]">· {OUTROS.length}</span>
              </summary>
              <div className="px-5 pb-4">
                <p className="mb-3 text-[13px] text-[#4A524C]">RS = revisão sistemática · Cons. = consenso · Obs. = observacional · Cad. = cadáver · Lab. = laboratorial · Rev. = revisão narrativa.</p>
                <RefList rows={OUTROS} />
              </div>
            </details>
          </Chap>

          {/* 11 */}
          <Chap id="revisao" n="11" title="O que mudou desde a apresentação de 30/10">
            <Table
              head={["Item", "Antes", "Agora"]}
              rows={[
                ["Músculos na prática", "23 alvos em 3 módulos, sem filtro de evidência", `${MUSCLES.length} músculos com ensaio clínico; 6 grupos removidos`],
                ["PM&R 2017 (exercício pós-DN)", "Primeiro autor citado como Arias-Buría", "Primeiro autor é Salom-Moreno J (Arias-Buría é coautor)"],
                ["Sánchez-Romero", "Só o piloto de 2018", "Acrescentado o ECA definitivo (Pain Med 2020, PEDro 8), negativo em 1 ano"],
                ["Cervical", "Gattie 2021 como único negativo", "Acrescentado Medrano-de-la-Fuente 2024 (PEDro 8), negativo"],
                ["Boyce et al., 2020", "20.464 tratamentos", "20.494 tratamentos; eventos leves em 36,7%"],
                ["Gattie et al., 2017 (RS)", "“PEDro mediana 7”", "ECAs incluídos com PEDro de 4 a 9 (o resumo não informa a mediana)"],
                ["Novas indicações", "—", "OA de quadril, dor plantar no calcanhar, lombalgia com glúteo médio"],
              ]}
            />
            <div className="mt-10 flex flex-col gap-5 border-t border-[#1F4A33]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[14px] text-[#4A524C]">
                <p className="text-[18px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>Matheus Fernandes</p>
                <p>Fisioterapeuta esportivo · CREFITO 3/321383-F</p>
                <p>@ft.matheusfernandes · (16) 99116-7474</p>
              </div>
              <PdfButton variant="ghost" />
            </div>
          </Chap>
        </main>
      </div>
    </div>
  );
}
