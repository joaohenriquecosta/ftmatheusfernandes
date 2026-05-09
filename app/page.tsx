import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matheus Fernandes — Fisioterapeuta Esportivo",
  description:
    "Fisioterapeuta esportivo. Terapias manuais modernas, raciocínio clínico baseado em evidência. CREFITO 3/321383-F.",
  openGraph: {
    title: "Matheus Fernandes — Fisioterapeuta Esportivo",
    description:
      "Fisioterapeuta esportivo. Terapias manuais modernas, raciocínio clínico baseado em evidência.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF7F1] text-[#1A1F1B] antialiased">
      {/* Subtle grain texture */}
      <div
        className="pointer-events-none fixed inset-0 z-1 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-[#1F4A33]" />

      <div className="relative z-2 mx-auto flex min-h-screen max-w-[880px] flex-col px-6 md:px-12">
        {/* Header */}
        <header className="flex items-start justify-between pt-12 text-[11px] font-medium tracking-[0.18em] text-[#4A524C] uppercase md:pt-16">
          <div>Matheus Fernandes</div>
          <div className="text-right">
            <div>CREFITO 3/321383-F</div>
            <div className="mt-1">São Carlos · SP</div>
          </div>
        </header>

        {/* Center content */}
        <div className="flex flex-1 flex-col justify-center py-20">
          {/* Eyebrow */}
          <div className="mb-8 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
            <span className="h-px w-8 bg-[#E89B3C]" />
            <span>Em breve</span>
          </div>

          {/* Title */}
          <h1
            className="mb-8 text-[clamp(44px,7vw,88px)] leading-[1.02] tracking-[-0.02em] text-[#1F4A33]"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Fisioterapia esportiva,{" "}
            <em className="font-light text-[#E89B3C] italic">
              raciocínio clínico,
            </em>{" "}
            terapia manual.
          </h1>

          {/* Sub */}
          <p
            className="max-w-[540px] text-[19px] leading-[1.55] font-light text-[#4A524C]"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Atendimento presencial, cursos de formação e conteúdo técnico
            baseado em evidência. Site em construção — em breve, novidades.
          </p>

          {/* Formação */}
          <div className="mt-16 grid gap-8 border-t border-[#1F4A33]/10 pt-10 md:mt-20 md:grid-cols-[160px_1fr] md:gap-14">
            <div className="text-[11px] font-semibold tracking-[0.3em] text-[#1F4A33] uppercase">
              Formação
            </div>
            <div
              className="space-y-8 text-[16px] leading-[1.6] font-light text-[#4A524C]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              <p>Formação 2020.</p>

              <div>
                <div
                  className="mb-3 text-[11px] font-semibold tracking-[0.3em] text-[#4A524C] uppercase"
                  style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
                >
                  Formação complementar
                </div>
                <ul className="space-y-3">
                  <li>
                    Pós-graduado em Fisioterapia Traumato-Ortopédica com ênfase
                    em Terapia Manual{" "}
                    <span className="text-[#1F4A33]/70">— Barão de Mauá</span>
                  </li>
                  <li>
                    Pós-graduado em Fisioterapia Esportiva{" "}
                    <span className="text-[#1F4A33]/70">— CETE / UNIFESP</span>
                  </li>
                  <li>
                    Pós-graduando em Ciência do Treinamento de Força{" "}
                    <span className="text-[#1F4A33]/70">
                      — Musculab / UFSCAR
                    </span>
                  </li>
                  <li>Certificado em Quiropraxia Clínica.</li>
                  <li>Certificado em Dinamometria Manual Isométrica.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <footer className="flex flex-col items-start justify-between gap-4 border-t border-[#1F4A33]/10 pt-7 pb-10 md:flex-row md:items-end md:gap-10 md:pb-14">
          <a
            href="https://www.instagram.com/ft.matheusfernandes/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase transition-colors hover:text-[#E89B3C]"
          >
            <span>Instagram · @ft.matheusfernandes</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:translate-x-1"
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
          <div className="text-left text-[11px] tracking-[0.2em] text-[#4A524C] uppercase md:text-right">
            <div>© 2026 Matheus Fernandes</div>
            <div className="mt-1">Todos os direitos reservados</div>
          </div>
        </footer>
      </div>
    </main>
  );
}
