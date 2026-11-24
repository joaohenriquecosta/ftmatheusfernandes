import type { Metadata } from "next";
import Link from "next/link";

import { DevCredit } from "@/components/dev-credit";
import { ArrowRight } from "@/components/icons";
import * as turmaModel from "@/models/turma";

export const metadata: Metadata = {
  title: "Curso Joelho no Esporte — São Carlos · 10 e 11 de Abril de 2027",
  description:
    "Disfunções e lesões do joelho e pós-operatório de reconstrução do LCA em atletas. 20 horas presenciais com Matheus Fernandes, em São Carlos/SP. Para fisioterapeutas e estudantes a partir do penúltimo ano.",
  openGraph: {
    title: "Curso Joelho no Esporte — São Carlos",
    description:
      "Disfunções e lesões do joelho e pós-operatório de LCA em atletas. 10 e 11 de Abril de 2027.",
    url: "/joelho",
    images: ["/matheus.jpeg"],
  },
};

const FRAUNCES = "var(--font-fraunces), Georgia, serif";
const SLUG = "joelho";
const WHATSAPP_URL =
  "https://wa.me/5516991167474?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20curso%20de%20joelho.";

const brl = (c: number) =>
  (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default async function JoelhoPage({
  searchParams,
}: {
  searchParams: Promise<{ lista?: string; utm_source?: string; origem?: string }>;
}) {
  const { lista, utm_source, origem } = await searchParams;
  const turma = turmaModel.get(SLUG)!;
  const lote = turmaModel.getLoteVigente(turma);
  const vendas = turma.vendasAbertas !== false && !!lote;
  const cta = vendas ? "Garantir minha vaga" : "Entrar na lista de espera";
  const ctaHref = vendas ? turmaModel.paginaInscricao(turma) : "#investimento";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF7F1] text-[#1A1F1B]">
      <div
        className="pointer-events-none fixed inset-0 z-1 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-[#1F4A33]" />

      {/* NAV */}
      <nav className="relative z-2 mx-auto flex max-w-[1200px] items-center justify-between px-6 pt-10 md:px-12">
        <Link
          href="/"
          className="group inline-flex flex-col gap-1 text-[11px] font-medium tracking-[0.18em] text-[#4A524C] uppercase transition-colors hover:text-[#1F4A33]"
        >
          <span>← Matheus Fernandes</span>
          <span className="text-[10px] tracking-[0.2em] text-[#4A524C]/60 group-hover:text-[#1F4A33]/70">
            CREFITO 3/321383-F
          </span>
        </Link>
        <div className="hidden text-[11px] tracking-[0.18em] text-[#4A524C] uppercase md:block">
          Turma · São Carlos 2027
        </div>
      </nav>

      {/* HERO */}
      <header className="relative z-2 mx-auto max-w-[1200px] px-6 pt-20 pb-32 md:px-12 md:pt-28 md:pb-40">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-10 inline-flex animate-[fadeUp_0.8s_ease_0.2s_both] items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
              <span className="h-px w-8 bg-[#E89B3C]" />
              <span>Curso presencial · 20h</span>
            </div>
            <h1
              className="mb-10 animate-[fadeUp_0.9s_ease_0.4s_both] text-[clamp(48px,8vw,112px)] leading-[0.95] tracking-tight text-[#1F4A33]"
              style={{ fontFamily: FRAUNCES }}
            >
              Joelho{" "}
              <em className="font-light text-[#E89B3C] italic">no esporte.</em>
            </h1>
            <p
              className="mb-14 max-w-[560px] animate-[fadeUp_0.9s_ease_0.6s_both] text-[20px] leading-normal font-light text-[#4A524C]"
              style={{ fontFamily: FRAUNCES }}
            >
              Disfunções e lesões do joelho e o pós-operatório de reconstrução
              do LCA em atletas. Dois dias de raciocínio clínico, prática na
              maca e critérios para devolver o atleta ao esporte.
            </p>
            <a
              href={ctaHref}
              className="group relative inline-flex animate-[fadeUp_0.9s_ease_0.8s_both] items-center gap-3.5 overflow-hidden border border-[#1F4A33] bg-[#1F4A33] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase transition-colors hover:border-[#E89B3C]"
            >
              <span className="absolute inset-0 -translate-y-full bg-[#E89B3C] transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">{cta}</span>
              <ArrowRight className="relative transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="lg:col-span-5 lg:pl-8">
            <div className="relative animate-[fadeUp_1s_ease_0.5s_both]">
              <div
                className="absolute -top-12 -right-4 text-[clamp(140px,18vw,240px)] leading-none font-light text-transparent select-none lg:right-0"
                style={{
                  fontFamily: FRAUNCES,
                  WebkitTextStroke: "1px rgba(31, 74, 51, 0.12)",
                  fontStyle: "italic",
                }}
                aria-hidden
              >
                10
              </div>
              <div className="relative border-l-[3px] border-[#E89B3C] py-2 pl-8">
                <div className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-[#E89B3C] uppercase">
                  Sábado e Domingo
                </div>
                <div
                  className="text-[clamp(48px,7vw,80px)] leading-none tracking-[-0.02em] text-[#1F4A33]"
                  style={{ fontFamily: FRAUNCES }}
                >
                  10 <em className="font-light text-[#E89B3C] italic">&amp;</em>{" "}
                  11
                </div>
                <div
                  className="text-[24px] font-light text-[#4A524C]"
                  style={{ fontFamily: FRAUNCES }}
                >
                  Abril de 2027
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#1F4A33]/15 pt-8">
                <Info label="Local">
                  São Carlos/SP
                  <br />
                  endereço na abertura
                </Info>
                <Info label="Carga horária">20 horas</Info>
                <Info label="Para quem">
                  Fisioterapeutas e estudantes do penúltimo ano em diante
                </Info>
                <Info label="Vagas">Limitadas</Info>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PROPOSTA */}
      <section className="relative z-2 border-t border-[#1F4A33]/10 bg-[#F5F1E8]">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
                <span className="h-px w-8 bg-[#E89B3C]" />
                <span>A proposta</span>
              </div>
              <h2
                className="text-[clamp(36px,4.5vw,52px)] leading-[1.05] tracking-[-0.015em] text-[#1F4A33]"
                style={{ fontFamily: FRAUNCES }}
              >
                Critério,{" "}
                <em className="font-light text-[#E89B3C] italic">
                  não calendário.
                </em>
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p
                className="mb-6 text-[19px] leading-[1.55] font-light text-[#1A1F1B]"
                style={{ fontFamily: FRAUNCES }}
              >
                Nossa abordagem é baseada em Prática Baseada em Evidência,
                aplicada ao que o Matheus vê todos os dias na clínica com
                atletas.
              </p>
              <p className="text-[14px] leading-[1.7] text-[#4A524C]">
                O foco é saber avaliar o joelho, escolher a conduta e decidir
                cada passo da reabilitação com critérios objetivos: da dor no
                joelho que aparece no treino ao atleta que acabou de operar o
                LCA e quer voltar a competir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMA */}
      <section className="relative z-2">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="mb-16 max-w-[720px]">
            <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
              <span className="h-px w-8 bg-[#E89B3C]" />
              <span>Programa · 2 dias</span>
            </div>
            <h2
              className="text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#1F4A33]"
              style={{ fontFamily: FRAUNCES }}
            >
              Da avaliação{" "}
              <em className="font-light text-[#E89B3C] italic">ao retorno.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 border-t border-[#1F4A33]">
            {PROGRAMA.map((mod) => (
              <div
                key={mod.num}
                className="group grid grid-cols-1 gap-6 border-b border-[#1F4A33]/15 py-10 transition-colors hover:bg-[#F5F1E8]/50 md:grid-cols-12 md:gap-10 md:py-14"
              >
                <div className="md:col-span-1">
                  <div
                    className="text-[42px] leading-none font-light text-[#E89B3C] italic"
                    style={{ fontFamily: FRAUNCES }}
                  >
                    {mod.num}.
                  </div>
                </div>
                <div className="md:col-span-4">
                  <h3
                    className="text-[24px] leading-[1.2] font-medium text-[#1F4A33] transition-transform duration-300 group-hover:translate-x-1"
                    style={{ fontFamily: FRAUNCES }}
                  >
                    {mod.title}
                  </h3>
                </div>
                <ul className="space-y-3 md:col-span-7">
                  {mod.topics.map((t) => (
                    <li
                      key={t}
                      className="flex gap-3 text-[15px] leading-[1.55] text-[#4A524C]"
                    >
                      <span className="mt-2 inline-block h-px w-3 shrink-0 bg-[#E89B3C]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM */}
      <section className="relative z-2 border-t border-[#1F4A33]/10 bg-[#F5F1E8]">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="mb-14 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
            <span className="h-px w-8 bg-[#E89B3C]" />
            <span>Para quem</span>
          </div>
          <div className="grid grid-cols-1 gap-12 border-t border-[#1F4A33] pt-10 md:grid-cols-2">
            <Publico
              titulo="Fisioterapeutas"
              texto="Formados, com CREFITO ativo. Para quem atende atleta, praticante de esporte ou paciente operado e quer conduzir o caso com segurança."
              pede="Na inscrição: número do CREFITO."
            />
            <Publico
              titulo="Estudantes"
              texto="Do penúltimo ano de Fisioterapia em diante. Para chegar ao estágio e ao primeiro emprego sabendo conduzir o joelho."
              pede="Na inscrição: instituição, ano e número de matrícula."
            />
          </div>
        </div>
      </section>

      {/* INVESTIMENTO */}
      <section id="investimento" className="relative z-2 scroll-mt-8 bg-[#1F4A33] text-[#FAF7F1]">
        <div
          className="absolute -top-32 right-0 h-64 w-64 opacity-15"
          style={{
            background: "radial-gradient(circle, #E89B3C 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#F4C690] uppercase">
                <span className="h-px w-8 bg-[#F4C690]" />
                <span>Investimento</span>
              </div>
              <h2
                className="mb-8 text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em]"
                style={{ fontFamily: FRAUNCES }}
              >
                {vendas ? (
                  <>
                    {lote!.nome}{" "}
                    <em className="font-light text-[#F4C690] italic">aberto.</em>
                  </>
                ) : (
                  <>
                    Inscrições{" "}
                    <em className="font-light text-[#F4C690] italic">em breve.</em>
                  </>
                )}
              </h2>
              <p className="max-w-[480px] text-[14px] leading-[1.6] text-[#FAF7F1]/75">
                {vendas
                  ? `Valor por categoria, ${lote!.prazo.replace("até", "válido até")}. Pagamento via Pix ou cartão em até 12x. Confirmação imediata e adição ao grupo de WhatsApp da turma.`
                  : "Quem está na lista de espera recebe primeiro os valores do Lote 1 e o link de inscrição. Estudantes têm valor diferenciado. Pagamento via Pix ou cartão em até 12x."}
              </p>
            </div>
            <div className="lg:col-span-6">
              {vendas ? (
                <div className="border-l-[3px] border-[#E89B3C] pl-8">
                  <div className="grid grid-cols-2 gap-8">
                    <Preco rotulo="Estudante" valor={brl(turmaModel.valorDoLote(lote!, "estudante"))} />
                    <Preco rotulo="Fisioterapeuta" valor={brl(turmaModel.valorDoLote(lote!, "profissional"))} />
                  </div>
                  <a
                    href={turmaModel.paginaInscricao(turma)}
                    className="group relative mt-10 inline-flex items-center gap-3.5 overflow-hidden border border-[#E89B3C] bg-[#E89B3C] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase"
                  >
                    <span className="absolute inset-0 -translate-y-full bg-[#FAF7F1] transition-transform duration-300 group-hover:translate-y-0" />
                    <span className="relative">Inscrever-se agora</span>
                    <ArrowRight className="relative transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              ) : lista === "ok" ? (
                <div role="status" className="border-l-[3px] border-[#E89B3C] py-2 pl-8">
                  <div
                    className="mb-3 text-[32px] leading-tight"
                    style={{ fontFamily: FRAUNCES }}
                  >
                    Você está na <em className="font-light text-[#F4C690] italic">lista.</em>
                  </div>
                  <p className="text-[14px] leading-[1.6] text-[#FAF7F1]/75">
                    Vamos avisar pelo WhatsApp e pelo e-mail assim que as
                    inscrições abrirem.
                  </p>
                </div>
              ) : (
                <form
                  method="post"
                  action={`/api/turmas/${SLUG}/lista`}
                  className="space-y-6 border-l-[3px] border-[#E89B3C] pl-8"
                >
                  {lista === "erro" && (
                    <p role="alert" className="text-[13px] text-[#F4C690]">
                      Confira os campos: nome, e-mail, WhatsApp com DDD e perfil.
                    </p>
                  )}
                  <CampoEscuro label="Nome" name="nome" autoComplete="name" />
                  <CampoEscuro label="E-mail" name="email" type="email" autoComplete="email" />
                  <CampoEscuro
                    label="WhatsApp"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(16) 99999-9999"
                    pattern={String.raw`(\+?55)?[\s\(]*\d{2}[\s\)]*9?[\s.\-]*\d{4}[\s.\-]*\d{4}\s*`}
                    title="Celular com DDD, ex.: (16) 99999-9999"
                  />
                  <fieldset>
                    <legend className="mb-3 text-[10px] font-semibold tracking-[0.28em] text-[#F4C690] uppercase">
                      Você é
                    </legend>
                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
                      <label className="inline-flex min-h-11 items-center gap-3">
                        <input type="radio" name="perfil" value="estudante" required className="h-4 w-4 accent-[#E89B3C]" />
                        Estudante
                      </label>
                      <label className="inline-flex min-h-11 items-center gap-3">
                        <input type="radio" name="perfil" value="profissional" className="h-4 w-4 accent-[#E89B3C]" />
                        Fisioterapeuta
                      </label>
                    </div>
                  </fieldset>
                  <input type="hidden" name="origem" value={(utm_source ?? origem ?? "").slice(0, 60)} />
                  <div aria-hidden className="absolute -left-[9999px]">
                    <label>
                      Não preencha
                      <input type="text" name="site" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="group relative inline-flex items-center gap-3.5 overflow-hidden border border-[#E89B3C] bg-[#E89B3C] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase"
                  >
                    <span className="absolute inset-0 -translate-y-full bg-[#FAF7F1] transition-transform duration-300 group-hover:translate-y-0" />
                    <span className="relative">Quero ser avisado</span>
                    <ArrowRight className="relative transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="text-[11px] leading-[1.6] text-[#FAF7F1]/60">
                    Seus dados são usados só para avisar sobre este curso.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="relative z-2">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-28">
          <div className="mb-12 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
            <span className="h-px w-8 bg-[#E89B3C]" />
            <span>Como funciona</span>
          </div>
          <dl className="grid grid-cols-1 gap-x-12 gap-y-10 border-t border-[#1F4A33] pt-10 md:grid-cols-3">
            {COMO.map(([t, d]) => (
              <div key={t}>
                <dt className="mb-3 text-[22px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
                  {t}
                </dt>
                <dd className="text-[14px] leading-[1.7] text-[#4A524C]">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-2 border-t border-[#1F4A33]/10">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-2 text-[28px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
                Matheus Fernandes
              </div>
              <div className="text-[11px] tracking-[0.2em] text-[#4A524C] uppercase">
                Fisioterapeuta Esportivo · CREFITO 3/321383-F
              </div>
            </div>
            <div className="text-left text-[11px] tracking-[0.2em] text-[#4A524C] uppercase md:text-right">
              <div>Local</div>
              <div className="mt-1 text-[#1F4A33]">São Carlos/SP</div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#1F4A33]/15 pt-6 text-[11px] tracking-[0.18em] text-[#4A524C] uppercase md:flex-row md:items-center">
            <div>© 2026 Matheus Fernandes · Todos os direitos reservados</div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#E89B3C]"
            >
              Dúvidas? WhatsApp · (16) 99116-7474 →
            </a>
          </div>
          <DevCredit />
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          main * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </main>
  );
}

const PROGRAMA = [
  {
    num: "i",
    title: "Avaliação do joelho",
    topics: [
      "Anamnese e exame físico orientados ao esporte",
      "Testes clínicos: o que cada um realmente informa",
      "Diagnóstico diferencial e sinais de encaminhamento",
      "Medidas de força e função que cabem na clínica",
    ],
  },
  {
    num: "ii",
    title: "Disfunções e lesões no esporte",
    topics: [
      "Dor femoropatelar e tendinopatia patelar",
      "Lesões ligamentares e meniscais: quando o tratamento é conservador",
      "Carga, exercício e retorno ao treino",
      "Prática supervisionada em duplas",
    ],
  },
  {
    num: "iii",
    title: "Pós-operatório do LCA",
    topics: [
      "O que muda com o tipo de enxerto e as lesões associadas",
      "Primeiras semanas: edema, extensão e ativação do quadríceps",
      "Progressão por critérios, fase a fase",
      "Força, pliometria e retorno à corrida",
    ],
  },
  {
    num: "iv",
    title: "Retorno ao esporte",
    topics: [
      "Testes de retorno e como interpretar os resultados",
      "Prontidão psicológica e decisão compartilhada com o atleta",
      "Prevenção de uma nova lesão",
      "Casos reais da clínica do Matheus",
    ],
  },
] as const;

const COMO: Array<[string, string]> = [
  [
    "Presencial",
    "Dois dias em São Carlos, com teoria e prática na maca. O endereço é confirmado na abertura das inscrições.",
  ],
  [
    "Material e certificado",
    "Material de apoio do curso e certificado de 20 horas, com código de verificação no site.",
  ],
  [
    "Aulas gravadas",
    "O curso é filmado para uso educacional. Na inscrição, você autoriza o uso da sua imagem nas gravações.",
  ],
];

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#4A524C] uppercase">
        {label}
      </div>
      <div className="text-[15px] leading-[1.4] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
        {children}
      </div>
    </div>
  );
}

function Publico({ titulo, texto, pede }: { titulo: string; texto: string; pede: string }) {
  return (
    <div>
      <h3 className="mb-4 text-[30px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
        {titulo}
      </h3>
      <p className="mb-4 max-w-[460px] text-[15px] leading-[1.65] text-[#4A524C]">{texto}</p>
      <p className="text-[12px] font-semibold tracking-[0.12em] text-[#1F4A33] uppercase">{pede}</p>
    </div>
  );
}

function Preco({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-[#F4C690] uppercase">{rotulo}</div>
      <div className="text-[clamp(40px,6vw,64px)] leading-none tracking-[-0.02em]" style={{ fontFamily: FRAUNCES }}>
        {valor}
      </div>
    </div>
  );
}

function CampoEscuro({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold tracking-[0.28em] text-[#F4C690] uppercase">
        {label}
      </span>
      <input
        name={name}
        required
        maxLength={140}
        className="w-full border-0 border-b border-[#FAF7F1]/30 bg-transparent pb-2 text-[17px] text-[#FAF7F1] placeholder:text-[#FAF7F1]/35 focus:border-[#E89B3C] focus:outline-none"
        style={{ fontFamily: FRAUNCES }}
        {...rest}
      />
    </label>
  );
}
