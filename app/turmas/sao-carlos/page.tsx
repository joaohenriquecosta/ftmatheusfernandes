import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terapias Manuais Modernas — São Carlos · 20, 21, 27 e 28 de Junho",
  description:
    "Curso presencial de Terapias Manuais Modernas com Matheus Fernandes. Dry Needling, mobilização miofascial, manipulações quiropráticas, Maitland, Mulligan, neurodinâmica e crochetagem. São Carlos/SP · 20, 21, 27 e 28 de Junho de 2026.",
  robots: { index: false, follow: false },
};

// Re-renderiza no máximo a cada hora pra atualizar o lote vigente quando o prazo virar.
export const revalidate = 3600;

const INSTAGRAM_URL = "https://www.instagram.com/ft.matheusfernandes/";
const WHATSAPP_URL =
  "https://wa.me/5516991167474?text=Ol%C3%A1!%20Quero%20garantir%20minha%20vaga%20na%20turma%20de%20S%C3%A3o%20Carlos%20(20%2C%2021%2C%2027%20e%2028%20de%20junho).";

// Prazos em horário de Brasília (UTC-3). O lote ativo é o primeiro cujo endsAt
// ainda é futuro em relação a `now`. Quando todos expiram, nenhum CTA de lote
// aparece — só os dias do curso restam.
const LOTES = [
  {
    nome: "Lote 1 · promocional",
    prazo: "até 24 de Maio · 23h59",
    valor: "599,99",
    endsAt: "2026-05-24T23:59:59-03:00",
  },
  {
    nome: "Lote 2",
    prazo: "até 31 de Maio · 23h59",
    valor: "699,99",
    endsAt: "2026-05-31T23:59:59-03:00",
  },
  {
    nome: "Lote 3",
    prazo: "até 7 de Junho · 23h59",
    valor: "799,99",
    endsAt: "2026-06-07T23:59:59-03:00",
  },
  {
    nome: "Lote 4",
    prazo: "até 14 de Junho · 23h59",
    valor: "899,99",
    endsAt: "2026-06-14T23:59:59-03:00",
  },
  {
    nome: "Lote final",
    prazo: "até o início do curso",
    valor: "999,99",
    endsAt: "2026-06-20T08:00:00-03:00",
  },
];

const MODULOS = [
  {
    num: "i",
    title: "Complexo do Ombro e Quadril",
    topics: [
      "Avaliação articular, muscular e neural integrada",
      "Diagnóstico diferencial: impacto, instabilidade, tendinopatia",
      "Tratamento manual orientado por raciocínio clínico",
      "Mobilizações Maitland e Mulligan aplicadas",
    ],
  },
  {
    num: "ii",
    title: "Coluna Lombar",
    topics: [
      "Avaliação completa e triagem de bandeiras vermelhas",
      "Manipulação quiroprática segura para a região lombar",
      "Neurodinâmica de membros inferiores (Slump, Lasègue)",
      "Liberação miofascial profunda de quadrado lombar e psoas",
    ],
  },
  {
    num: "iii",
    title: "Joelho e Tornozelo",
    topics: [
      "Diagnóstico diferencial das dores anteriores e laterais",
      "Mobilizações articulares para ganho de ADM",
      "Floss Band aplicado em compressão e descompressão",
      "Crochetagem para restrições fasciais e cicatrizes",
    ],
  },
];

const TECNICAS = [
  "Dry Needling",
  "Mobilização miofascial",
  "Compressão isquêmica",
  "Manipulações quiropráticas",
  "Crochetagem",
  "Floss Band",
  "Mobilizações Maitland e Mulligan",
  "Neurodinâmica",
];

export default function TurmaSaoCarlos() {
  // Intencionalmente impuro: o lote vigente depende do tempo. A página é um
  // Server Component com `revalidate = 3600`, então o render é refeito ao
  // menos uma vez por hora e o lote atualiza junto.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  // Primeiro lote cujo endsAt ainda é futuro. -1 = todos expiraram.
  const loteAtualIndex = LOTES.findIndex(
    (l) => new Date(l.endsAt).getTime() > now,
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF7F1] text-[#1A1F1B] antialiased">
      {/* Grain texture */}
      <div
        className="pointer-events-none fixed inset-0 z-1 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-[#1F4A33]" />

      {/* ====== TOP NAV ====== */}
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
          Turma · São Carlos 2026
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <header className="relative z-2 mx-auto max-w-[1200px] px-6 pt-20 pb-32 md:px-12 md:pt-28 md:pb-40">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
          {/* Left: text */}
          <div className="lg:col-span-7">
            <div className="mb-10 inline-flex animate-[fadeUp_0.8s_ease_0.2s_both] items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
              <span className="h-px w-8 bg-[#E89B3C]" />
              <span>2 finais de semana · 36h · 20 vagas</span>
            </div>

            <h1
              className="mb-10 animate-[fadeUp_0.9s_ease_0.4s_both] text-[clamp(48px,8vw,112px)] leading-[0.95] tracking-tight text-[#1F4A33]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Terapias{" "}
              <em className="font-light text-[#E89B3C] italic">manuais</em>
              <br />
              modernas.
            </h1>

            <p
              className="mb-14 max-w-[540px] animate-[fadeUp_0.9s_ease_0.6s_both] text-[20px] leading-normal font-light text-[#4A524C]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Quatro dias em dois finais de semana — 20, 21, 27 e 28 de junho.
              Prática hands-on com Dry Needling, manipulações quiropráticas,
              Maitland, Mulligan, neurodinâmica, crochetagem e Floss Band —
              aplicados ao ombro, quadril, coluna lombar, joelho e tornozelo.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex animate-[fadeUp_0.9s_ease_0.8s_both] items-center gap-3.5 overflow-hidden border border-[#1F4A33] bg-[#1F4A33] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase transition-colors hover:border-[#E89B3C]"
            >
              <span className="absolute inset-0 -translate-y-full bg-[#E89B3C] transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Garantir minha vaga</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M3 7H11M11 7L7 3M11 7L7 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Right: date block */}
          <div className="lg:col-span-5 lg:pl-8">
            <div className="relative animate-[fadeUp_1s_ease_0.5s_both]">
              {/* Decorative outline — carga horária */}
              <div
                className="absolute top-10 -right-4 text-[clamp(120px,18vw,240px)] leading-none font-light text-transparent select-none sm:-top-12 lg:right-0"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  WebkitTextStroke: "1px rgba(31, 74, 51, 0.12)",
                  fontStyle: "italic",
                }}
                aria-hidden
              >
                36h
              </div>

              <div className="relative border-l-[3px] border-[#E89B3C] py-2 pl-8">
                <div className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-[#E89B3C] uppercase">
                  Dois finais de semana
                </div>
                <div
                  className="text-[clamp(40px,5.5vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#1F4A33]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  20, 21
                  <br />
                  <em className="font-light text-[#E89B3C] italic">27 e 28</em>
                </div>
                <div
                  className="mt-2 text-[22px] font-light text-[#4A524C]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Junho de 2026
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#1F4A33]/15 pt-8">
                <div>
                  <div className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#4A524C] uppercase">
                    Local
                  </div>
                  <div
                    className="text-[15px] leading-[1.4] text-[#1F4A33]"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    Multfisio
                    <br />
                    Vila Prado · São Carlos/SP
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#4A524C] uppercase">
                    Vagas
                  </div>
                  <div
                    className="text-[15px] leading-[1.4] text-[#1F4A33]"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    Limitadas a 20
                    <br />
                    Turma intimista
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====== SOBRE ====== */}
      <section className="relative z-2 border-t border-[#1F4A33]/10 bg-[#F5F1E8]">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
                <span className="h-px w-8 bg-[#E89B3C]" />
                <span>O instrutor</span>
              </div>
              <h2
                className="text-[clamp(36px,4.5vw,52px)] leading-[1.05] tracking-[-0.015em] text-[#1F4A33]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Matheus
                <br />
                <em className="font-light text-[#E89B3C] italic">Fernandes.</em>
              </h2>
              <div className="mt-6 text-[11px] tracking-[0.2em] text-[#4A524C] uppercase">
                CREFITO 3/321383-F
                <br />
                Fisioterapeuta esportivo
              </div>
            </div>

            <div className="lg:col-span-8">
              <p
                className="mb-6 text-[19px] leading-[1.55] font-light text-[#1A1F1B]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Atuação clínica em fisioterapia esportiva, com experiência em
                avaliação, diagnóstico diferencial e reabilitação de atletas
                amadores e profissionais. Conteúdo construído com base em
                evidência científica atualizada e 36 horas de prática
                hands-on.
              </p>
              <p className="text-[14px] leading-[1.7] text-[#4A524C]">
                Pós-graduado em Fisioterapia Traumato-Ortopédica com ênfase em
                Terapia Manual (Barão de Mauá), Fisioterapia Esportiva
                (CETE/UNIFESP) e Ciência do Treinamento de Força
                (Musculab/UFSCar). Certificado em Quiropraxia Clínica e
                Dinamometria Manual Isométrica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PROGRAMA ====== */}
      <section className="relative z-2">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="mb-16 max-w-[720px]">
            <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
              <span className="h-px w-8 bg-[#E89B3C]" />
              <span>Programa · 3 grandes blocos</span>
            </div>
            <h2
              className="text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#1F4A33]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Avaliação e tratamento,{" "}
              <em className="font-light text-[#E89B3C] italic">
                região por região.
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 border-t border-[#1F4A33]">
            {MODULOS.map((mod) => (
              <div
                key={mod.num}
                className="group grid grid-cols-1 gap-6 border-b border-[#1F4A33]/15 py-10 transition-colors hover:bg-[#F5F1E8]/50 md:grid-cols-12 md:gap-10 md:py-14"
              >
                <div className="md:col-span-1">
                  <div
                    className="text-[42px] leading-none font-light text-[#E89B3C] italic"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    {mod.num}.
                  </div>
                </div>
                <div className="md:col-span-4">
                  <h3
                    className="text-[24px] leading-[1.2] font-medium text-[#1F4A33] transition-transform duration-300 group-hover:translate-x-1"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
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

      {/* ====== TÉCNICAS ====== */}
      <section className="relative z-2 border-t border-[#1F4A33]/10 bg-[#F5F1E8]">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
                <span className="h-px w-8 bg-[#E89B3C]" />
                <span>Técnicas</span>
              </div>
              <h2
                className="text-[clamp(36px,4.5vw,52px)] leading-[1.05] tracking-[-0.015em] text-[#1F4A33]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Caixa de{" "}
                <em className="font-light text-[#E89B3C] italic">
                  ferramentas.
                </em>
              </h2>
              <p className="mt-6 text-[14px] leading-[1.7] text-[#4A524C]">
                Cada técnica é apresentada com indicação clínica, evidência e
                prática supervisionada em dupla.
              </p>
            </div>

            <div className="lg:col-span-8">
              <ul className="grid grid-cols-1 gap-0 border-t border-[#1F4A33]/15 sm:grid-cols-2">
                {TECNICAS.map((tec, i) => (
                  <li
                    key={tec}
                    className={`flex items-center gap-4 border-b border-[#1F4A33]/15 py-5 text-[16px] text-[#1F4A33] sm:border-b ${
                      i % 2 === 0 ? "sm:border-r sm:pr-6" : "sm:pl-6"
                    }`}
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                    }}
                  >
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-[#E89B3C]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{tec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====== INVESTIMENTO ====== */}
      <section className="relative z-2 bg-[#1F4A33] text-[#FAF7F1]">
        <div
          className="absolute -top-32 right-0 h-64 w-64 opacity-15"
          style={{
            background: "radial-gradient(circle, #E89B3C 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="mb-16 max-w-[720px]">
            <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#F4C690] uppercase">
              <span className="h-px w-8 bg-[#F4C690]" />
              <span>Investimento · 5 lotes</span>
            </div>
            <h2
              className="text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#FAF7F1]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Quanto antes você entra,{" "}
              <em className="font-light text-[#F4C690] italic">
                mais econômico fica.
              </em>
            </h2>
            <p className="mt-6 max-w-[560px] text-[14px] leading-[1.7] text-[#FAF7F1]/70">
              {loteAtualIndex === -1 ? (
                <>Inscrições encerradas — turma cheia ou em andamento.</>
              ) : (
                <>
                  O preço sobe a cada semana. Lote vigente:{" "}
                  <span className="text-[#F4C690]">
                    {LOTES[loteAtualIndex].nome}
                  </span>{" "}
                  ({LOTES[loteAtualIndex].prazo}) — vagas limitadas a 20
                  participantes.
                </>
              )}
            </p>
          </div>

          {/* Timeline de lotes */}
          <ol className="relative">
            <div
              className="absolute top-0 bottom-0 left-[7px] w-px bg-[#FAF7F1]/15 md:left-[11px]"
              aria-hidden
            />
            {LOTES.map((lote, idx) => {
              const isAtual = idx === loteAtualIndex;
              const isEncerrado =
                loteAtualIndex === -1 || idx < loteAtualIndex;
              return (
                <li
                  key={lote.nome}
                  className={`relative grid grid-cols-1 items-baseline gap-6 py-6 pl-10 md:grid-cols-12 md:gap-10 md:pl-16 ${
                    isEncerrado ? "opacity-40" : ""
                  }`}
                >
                  <span
                    className={`absolute top-7 left-0 inline-block h-4 w-4 rounded-full border-2 md:h-6 md:w-6 ${
                      isAtual
                        ? "border-[#E89B3C] bg-[#E89B3C]"
                        : isEncerrado
                          ? "border-[#FAF7F1]/20 bg-transparent"
                          : "border-[#FAF7F1]/30 bg-[#1F4A33]"
                    }`}
                    aria-hidden
                  />
                  <div className="md:col-span-4">
                    <div
                      className={`mb-1 text-[11px] font-semibold tracking-[0.24em] uppercase ${
                        isAtual ? "text-[#E89B3C]" : "text-[#F4C690]/70"
                      }`}
                    >
                      {lote.nome}
                      {isAtual
                        ? " · atual"
                        : isEncerrado
                          ? " · encerrado"
                          : ""}
                    </div>
                    <div className="text-[13px] text-[#FAF7F1]/60">
                      {lote.prazo}
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <div
                      className={`leading-none ${
                        isAtual
                          ? "text-[clamp(40px,5vw,56px)] text-[#FAF7F1]"
                          : "text-[clamp(28px,3.5vw,36px)] text-[#FAF7F1]/80"
                      } ${isEncerrado ? "line-through" : ""}`}
                      style={{
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      <span
                        className={`align-top ${
                          isAtual
                            ? "text-[20px] text-[#F4C690]"
                            : "text-[14px] text-[#F4C690]/70"
                        }`}
                      >
                        R$
                      </span>{" "}
                      {lote.valor}
                    </div>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    {isAtual ? (
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-[#E89B3C] bg-[#E89B3C] px-5 py-3 text-[12px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase transition-colors hover:bg-[#FAF7F1] hover:border-[#FAF7F1]"
                      >
                        Quero esse lote →
                      </a>
                    ) : (
                      <span className="text-[11px] tracking-[0.2em] text-[#FAF7F1]/40 uppercase">
                        {isEncerrado ? "Encerrado" : "Próximo"}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* O que está incluso */}
          <div className="mt-16 grid grid-cols-1 gap-6 border-t border-[#FAF7F1]/15 pt-12 md:grid-cols-3">
            <div>
              <div className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#F4C690] uppercase">
                Material
              </div>
              <div
                className="text-[16px] text-[#FAF7F1]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Apostila impressa com todo o conteúdo do curso.
              </div>
            </div>
            <div>
              <div className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#F4C690] uppercase">
                Certificado
              </div>
              <div
                className="text-[16px] text-[#FAF7F1]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                36 horas, emitido em PDF após a conclusão dos 4 dias.
              </div>
            </div>
            <div>
              <div className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#F4C690] uppercase">
                Pagamento
              </div>
              <div
                className="text-[16px] text-[#FAF7F1]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Pix à vista. Parcelamento no cartão em breve.
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div
            id="inscricao"
            className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-[#FAF7F1]/15 pt-12 md:flex-row md:items-end"
          >
            <div>
              <div
                className="mb-3 text-[clamp(28px,3.5vw,40px)] leading-[1.1] text-[#FAF7F1]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Pronto pra reservar{" "}
                <em className="font-light text-[#F4C690] italic">sua vaga?</em>
              </div>
              <p className="max-w-[520px] text-[14px] leading-[1.6] text-[#FAF7F1]/70">
                Fala comigo direto no WhatsApp — eu te confirmo o lote vigente,
                envio o link de pagamento e te adiciono no grupo da turma.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex shrink-0 items-center gap-3.5 overflow-hidden border border-[#E89B3C] bg-[#E89B3C] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase"
            >
              <span className="absolute inset-0 -translate-y-full bg-[#FAF7F1] transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Falar no WhatsApp</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M3 7H11M11 7L7 3M11 7L7 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ====== FAQ MINI ====== */}
      <section className="relative z-2 border-t border-[#1F4A33]/10">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
                <span className="h-px w-8 bg-[#E89B3C]" />
                <span>Perguntas frequentes</span>
              </div>
              <h2
                className="text-[clamp(36px,4.5vw,52px)] leading-[1.05] tracking-[-0.015em] text-[#1F4A33]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Antes de{" "}
                <em className="font-light text-[#E89B3C] italic">decidir.</em>
              </h2>
            </div>

            <div className="lg:col-span-8">
              <div className="border-t border-[#1F4A33]/15">
                {[
                  {
                    q: "Para quem é o curso?",
                    a: "Fisioterapeutas, recém-formados e profissionais que querem ampliar o arsenal de técnicas manuais com respaldo clínico.",
                  },
                  {
                    q: "Tem certificado?",
                    a: "Sim — certificado de 36 horas, emitido em PDF e enviado por email após a conclusão dos quatro dias de curso.",
                  },
                  {
                    q: "Como funciona o pagamento?",
                    a: "No momento, via Pix. O parcelamento no cartão de crédito entra em breve — me chama no WhatsApp se quiser esperar essa opção.",
                  },
                  {
                    q: "Posso transferir minha vaga?",
                    a: "Não. A vaga é nominal e intransferível, justamente por respeitar a ordem de inscrição e o limite de 20 participantes.",
                  },
                  {
                    q: "Política de cancelamento?",
                    a: "Conforme o Código de Defesa do Consumidor, você tem 7 dias após a inscrição para solicitar reembolso integral. Após esse prazo, não há reembolso nem transferência.",
                  },
                  {
                    q: "Preciso levar algum material?",
                    a: "Roupa confortável para prática hands-on (camiseta regata e shorts ajudam no acesso às regiões trabalhadas). Apostila e materiais técnicos estão inclusos.",
                  },
                ].map((item) => (
                  <details
                    key={item.q}
                    className="group border-b border-[#1F4A33]/15 py-6"
                  >
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-6 text-[18px] text-[#1F4A33] transition-colors hover:text-[#E89B3C]"
                      style={{
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      <span>{item.q}</span>
                      <span className="text-[24px] font-light text-[#E89B3C] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="mt-4 max-w-[600px] text-[14px] leading-[1.65] text-[#4A524C]">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="relative z-2 border-t border-[#1F4A33]/10 bg-[#F5F1E8]">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div
                className="mb-2 text-[24px] text-[#1F4A33]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Matheus Fernandes
              </div>
              <div className="text-[11px] tracking-[0.2em] text-[#4A524C] uppercase">
                Fisioterapeuta Esportivo · CREFITO 3/321383-F
              </div>
            </div>

            <div className="text-left text-[11px] tracking-[0.2em] text-[#4A524C] uppercase md:text-right">
              <div>Local do curso</div>
              <div className="mt-1 text-[#1F4A33]">
                Multfisio · Vila Prado · São Carlos/SP
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#1F4A33]/15 pt-6 text-[11px] tracking-[0.18em] text-[#4A524C] uppercase md:flex-row md:items-center">
            <div>© 2026 Matheus Fernandes · Todos os direitos reservados</div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#E89B3C]"
              >
                WhatsApp · (16) 99116-7474 →
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#E89B3C]"
              >
                @ft.matheusfernandes →
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
