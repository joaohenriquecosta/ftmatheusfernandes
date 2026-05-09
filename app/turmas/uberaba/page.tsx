import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terapias Manuais Modernas — Uberaba · 16 e 17 de Maio",
  description:
    "Curso presencial de Terapias Manuais Modernas com Matheus Fernandes. Diagnóstico diferencial, raciocínio clínico e técnicas baseadas em evidência. Uberaba, MG · 16 e 17 de Maio de 2026.",
  robots: { index: false, follow: false },
};

const INSTAGRAM_URL = "https://www.instagram.com/ft.matheusfernandes/";

export default function TurmaUberaba() {
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
          className="text-[11px] font-medium tracking-[0.18em] text-[#4A524C] uppercase transition-colors hover:text-[#1F4A33]"
        >
          ← Matheus Fernandes
        </Link>
        <div className="hidden text-[11px] tracking-[0.18em] text-[#4A524C] uppercase md:block">
          Turma · Uberaba 2026
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <header className="relative z-2 mx-auto max-w-[1200px] px-6 pt-20 pb-32 md:px-12 md:pt-28 md:pb-40">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
          {/* Left: text */}
          <div className="lg:col-span-7">
            <div className="mb-10 inline-flex animate-[fadeUp_0.8s_ease_0.2s_both] items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
              <span className="h-px w-8 bg-[#E89B3C]" />
              <span>Curso presencial · 16h</span>
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
              Dois dias intensivos de prática hands-on. Diagnóstico diferencial,
              raciocínio clínico e técnicas com respaldo científico — Mulligan,
              Mckenzie, neurodinâmica, soltura miofascial, bandagem funcional.
            </p>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex animate-[fadeUp_0.9s_ease_0.8s_both] items-center gap-3.5 overflow-hidden border border-[#1F4A33] bg-[#1F4A33] px-8 py-4 text-[12px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase transition-colors hover:border-[#E89B3C]"
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
              {/* Decorative outline date */}
              <div
                className="absolute -top-12 -right-4 text-[clamp(140px,18vw,240px)] leading-none font-light text-transparent select-none lg:right-0"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  WebkitTextStroke: "1px rgba(31, 74, 51, 0.12)",
                  fontStyle: "italic",
                }}
              >
                16
              </div>

              <div className="relative border-l-[3px] border-[#E89B3C] py-2 pl-8">
                <div className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-[#E89B3C] uppercase">
                  Sábado e Domingo
                </div>
                <div
                  className="text-[clamp(48px,7vw,80px)] leading-none tracking-[-0.02em] text-[#1F4A33]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  16 <em className="font-light text-[#E89B3C] italic">&amp;</em>{" "}
                  17
                </div>
                <div
                  className="text-[24px] font-light text-[#4A524C]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Maio de 2026
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
                    Centro Educacional
                    <br />
                    UFTM · Uberaba/MG
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
                    Limitadas a 30
                    <br />
                    Últimas disponíveis
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
                evidência científica atualizada.
              </p>
              <p className="text-[14px] leading-[1.7] text-[#4A524C]">
                Referências do conteúdo:{" "}
                <span className="text-[#1F4A33]">Hegedus et al. (2012)</span>{" "}
                para shoulder tests,{" "}
                <span className="text-[#1F4A33]">Shacklock (2005)</span> em
                neurodinâmica,{" "}
                <span className="text-[#1F4A33]">May & Cina (2011)</span> para o
                método McKenzie,{" "}
                <span className="text-[#1F4A33]">Vicenzino et al. (2007)</span>{" "}
                em mobilização com movimento, e{" "}
                <span className="text-[#1F4A33]">Simons & Travell</span> em
                pontos-gatilho miofasciais.
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
              <span>Programa · 4 módulos</span>
            </div>
            <h2
              className="text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#1F4A33]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              O corpo todo,{" "}
              <em className="font-light text-[#E89B3C] italic">
                articulação por articulação.
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 border-t border-[#1F4A33]">
            {[
              {
                num: "i",
                title: "Complexo do Ombro e Cintura Escapular",
                topics: [
                  "Diagnóstico diferencial: articular, muscular ou neural",
                  "Testes de Neer, Hawkins-Kennedy, Jobe, Patte, O'Brien, Gerber",
                  "Avaliação neurodinâmica (ULNT 1, 2b, 3) — mediano, radial e ulnar",
                  "Mobilização escapular, decoaptação, liberação miofascial",
                ],
              },
              {
                num: "ii",
                title: "Cotovelo, Punho e Mão",
                topics: [
                  "Raciocínio clínico para epicondilalgias e síndromes compressivas",
                  "Avaliação de tendinopatia (Cozen, Mill) e diferenciação neural",
                  "Técnica de Mulligan (MWM) para ganho de força de preensão",
                  "Testes de túnel do carpo e mobilização de ossos do carpo",
                ],
              },
              {
                num: "iii",
                title: "Coluna Vertebral Completa",
                topics: [
                  "Método McKenzie (MDT): centralização vs. periferização",
                  "Neurodinâmica de membros inferiores: Slump, Lasègue, femoral",
                  "Tratamento de dores inespecíficas: quadrado lombar, psoas",
                  "Liberação miofascial profunda e compressão isquêmica",
                ],
              },
              {
                num: "iv",
                title: "Joelho e Tornozelo",
                topics: [
                  "Pontos-gatilho: vasto medial, vasto lateral, poplíteo",
                  "Mobilização patelar, técnica de McConnell, kinesio em Y",
                  "Bandagem funcional clássica e bandagem para sindesmose",
                  "Low-Dye taping para fascite plantar, deslizamento talar",
                ],
              },
            ].map((mod) => (
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
              <span>Investimento</span>
            </div>
            <h2
              className="text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#FAF7F1]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Dois lotes,{" "}
              <em className="font-light text-[#F4C690] italic">
                vagas limitadas.
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {/* Lote 1 */}
            <div className="border border-[#FAF7F1]/15 p-10">
              <div className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-[#F4C690] uppercase">
                Lote 1 · Esgotado
              </div>
              <div
                className="mb-3 text-[14px] text-[#FAF7F1]/50 line-through"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                R$ 280
              </div>
              <p className="text-[13px] leading-[1.6] text-[#FAF7F1]/60">
                Disponível até 22/03 — encerrado.
              </p>
            </div>

            {/* Lote 2 - destacado */}
            <div className="border border-[#E89B3C] bg-[#E89B3C]/8 p-10 md:-my-2">
              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] text-[#E89B3C] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E89B3C]" />
                Lote 2 · Atual
              </div>
              <div
                className="mb-1 text-[56px] leading-none text-[#FAF7F1]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                <span className="text-[24px] align-top text-[#F4C690]">R$</span>{" "}
                350
              </div>
              <div
                className="mb-6 text-[14px] font-light text-[#F4C690] italic"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                ou Pix em até 3x
              </div>
              <p className="mb-6 text-[13px] leading-[1.6] text-[#FAF7F1]/70">
                Inscrição individual. Disponível até 30/04 ou enquanto houver
                vagas.
              </p>
              <div className="border-t border-[#FAF7F1]/15 pt-4 text-[12px] leading-normal text-[#FAF7F1]/60">
                Inclui certificado, material impresso e coffee break nos dois
                dias.
              </div>
            </div>

            {/* Dobradinha */}
            <div className="border border-[#FAF7F1]/15 p-10">
              <div className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-[#F4C690] uppercase">
                Dobradinha
              </div>
              <div
                className="mb-1 text-[40px] leading-none text-[#FAF7F1]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                <span className="text-[20px] align-top text-[#F4C690]">R$</span>{" "}
                500
              </div>
              <div
                className="mb-6 text-[13px] font-light text-[#F4C690] italic"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                R$ 250 por pessoa
              </div>
              <p className="text-[13px] leading-[1.6] text-[#FAF7F1]/70">
                Inscreva-se com um colega e divida o valor do primeiro lote.
                Garante a vaga dos dois.
              </p>
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
              <p className="max-w-[480px] text-[14px] leading-[1.6] text-[#FAF7F1]/70">
                Pagamento via Pix ou Pix parcelado em até 3x. Confirmação
                imediata por email e adição ao grupo de WhatsApp da turma.
              </p>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex shrink-0 items-center gap-3.5 overflow-hidden border border-[#E89B3C] bg-[#E89B3C] px-8 py-4 text-[12px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase"
            >
              <span className="absolute inset-0 -translate-y-full bg-[#FAF7F1] transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Inscrever-se agora</span>
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
                    a: "Estudantes de fisioterapia a partir do 6º período, recém-formados e profissionais que querem atualizar suas técnicas com respaldo científico.",
                  },
                  {
                    q: "Tem certificado?",
                    a: "Sim — certificado de 16 horas, emitido em PDF e enviado por email após a conclusão dos dois dias.",
                  },
                  {
                    q: "Política de cancelamento?",
                    a: "Conforme o Código de Defesa do Consumidor, você tem 7 dias após a inscrição para solicitar reembolso integral. Após esse período, a vaga pode ser transferida para outro participante.",
                  },
                  {
                    q: "Preciso levar algum material?",
                    a: "Roupa confortável para prática hands-on. Todo o material teórico, esparadrapos para bandagem e coffee break estão inclusos.",
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
              <div>Realização em parceria com</div>
              <div className="mt-1 text-[#1F4A33]">
                Liga Acadêmica Ligamento · UFTM
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-[#1F4A33]/15 pt-6 text-[11px] tracking-[0.18em] text-[#4A524C] uppercase md:flex-row md:items-center">
            <div>© 2026 Matheus Fernandes · Todos os direitos reservados</div>
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
