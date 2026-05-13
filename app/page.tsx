import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DevCredit } from "@/components/dev-credit";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Matheus Fernandes — Fisioterapeuta Esportivo",
  description:
    "Fisioterapeuta esportivo em São Carlos/SP. Avaliação, raciocínio clínico baseado em evidência e cursos de terapia manual. CREFITO 3/321383-F.",
  openGraph: {
    title: "Matheus Fernandes — Fisioterapeuta Esportivo",
    description:
      "Fisioterapeuta esportivo em São Carlos/SP. Avaliação, raciocínio clínico baseado em evidência e cursos de terapia manual.",
    type: "website",
    locale: "pt_BR",
  },
};

const INSTAGRAM_URL = "https://www.instagram.com/ft.matheusfernandes/";
const WHATSAPP_AVALIACAO =
  "https://wa.me/5516991167474?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o.";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF7F1] pt-10 text-[#1A1F1B] antialiased">
      {/* Subtle grain texture */}
      <div
        className="pointer-events-none fixed inset-0 z-1 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ====== TOP BANNER · próxima turma (fixed) ====== */}
      <Link
        href="/turmas/sao-carlos"
        className="group fixed inset-x-0 top-0 z-30 block bg-[#1F4A33] text-[#FAF7F1] shadow-[0_1px_0_rgba(31,74,51,0.15)] transition-colors hover:bg-[#163826]"
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-2.5 text-[11px] font-medium tracking-[0.16em] uppercase md:px-12">
          <span className="flex items-center gap-3">
            <span className="relative inline-flex h-2 w-2 shrink-0 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-[recPulse_1.4s_ease-out_infinite] rounded-full bg-[#E89B3C] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#E89B3C]" />
            </span>

            {/* Mobile: 2 linhas (Próxima turma · SC / data) */}
            <span className="flex flex-col leading-tight sm:hidden">
              <span>
                <span className="text-[#F4C690]">Próxima turma</span> · São
                Carlos
              </span>
              <span className="text-[#F4C690]">20, 21, 27 e 28 jun</span>
            </span>

            {/* Desktop: linha única */}
            <span className="hidden items-center gap-3 sm:inline-flex">
              <span className="text-[#F4C690]">Próxima turma</span>
              <span>·</span>
              <span className="hidden md:inline">
                Terapias manuais modernas
              </span>
              <span className="hidden md:inline">·</span>
              <span>São Carlos · 20, 21, 27 e 28 jun</span>
            </span>
          </span>
          <span className="flex items-center gap-2 text-[#F4C690] transition-colors group-hover:text-[#FAF7F1]">
            <span className="hidden md:inline">Saiba mais</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* ====== HEADER ====== */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 pt-8 md:px-12 md:pt-10">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-[#1F4A33] uppercase">
            <div>Matheus Fernandes</div>
            <div className="mt-0.5 text-[10px] text-[#4A524C]/80">
              CREFITO 3/321383-F · São Carlos/SP
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-6 text-[11px] font-medium tracking-[0.2em] text-[#4A524C] uppercase md:gap-8">
            <a
              href="#sobre"
              className="hidden transition-colors hover:text-[#1F4A33] sm:inline"
            >
              Sobre
            </a>
            <a
              href="#turma"
              className="hidden transition-colors hover:text-[#1F4A33] sm:inline"
            >
              Turmas
            </a>
            <a
              href={WHATSAPP_AVALIACAO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#1F4A33]/30 px-4 py-2 text-[#1F4A33] transition-colors hover:border-[#1F4A33] hover:bg-[#1F4A33] hover:text-[#FAF7F1]"
            >
              <span>Contato</span>
            </a>
          </nav>
        </div>
      </header>

      {/* ====== HERO ====== */}
      <section className="relative z-2">
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-24 md:px-12 md:pt-28 md:pb-32">
          <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
            {/* Left: text + CTA */}
            <div className="lg:col-span-7">
              <div className="mb-8 inline-flex animate-[fadeUp_0.8s_ease_0.2s_both] items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
                <span className="h-px w-8 bg-[#E89B3C]" />
                <span>Fisioterapeuta esportivo</span>
              </div>

              <h1
                className="mb-8 animate-[fadeUp_0.9s_ease_0.4s_both] text-[clamp(44px,7vw,88px)] leading-[1.02] tracking-[-0.02em] text-[#1F4A33]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Fisioterapia esportiva,{" "}
                <em className="font-light text-[#E89B3C] italic">
                  raciocínio clínico,
                </em>{" "}
                terapia manual.
              </h1>

              <p
                className="mb-12 max-w-[560px] animate-[fadeUp_0.9s_ease_0.6s_both] text-[19px] leading-[1.55] font-light text-[#4A524C]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Atendimento presencial em São Carlos/SP e cursos de formação em
                terapia manual — conteúdo baseado em evidência científica
                atualizada.
              </p>

              {/* CTAs */}
              <div className="flex animate-[fadeUp_0.9s_ease_0.8s_both] flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  href={WHATSAPP_AVALIACAO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3.5 overflow-hidden border border-[#1F4A33] bg-[#1F4A33] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase transition-colors hover:border-[#E89B3C]"
                >
                  <span className="absolute inset-0 -translate-y-full bg-[#E89B3C] transition-transform duration-300 group-hover:translate-y-0" />
                  <span className="relative">Marcar avaliação</span>
                  <ArrowRight className="relative transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  href="#turma"
                  className="group inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase transition-colors hover:text-[#E89B3C]"
                >
                  <span>Ver próxima turma</span>
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right: card próxima turma */}
            <aside className="lg:col-span-5 lg:pl-8">
              <Link
                href="/turmas/sao-carlos"
                className="group relative block animate-[fadeUp_1s_ease_0.5s_both] border border-[#1F4A33]/15 bg-[#F5F1E8] p-8 transition-colors hover:border-[#1F4A33]/40 md:p-10"
              >
                <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-[#E89B3C] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E89B3C]" />
                  Próxima turma · São Carlos
                </div>

                <div
                  className="mb-2 text-[36px] leading-[1.05] tracking-[-0.01em] text-[#1F4A33]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  Terapias manuais{" "}
                  <em className="font-light text-[#E89B3C] italic">
                    modernas.
                  </em>
                </div>

                <div
                  className="mb-6 text-[15px] font-light text-[#4A524C]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  20, 21, 27 e 28 de junho · 36h · 20 vagas
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#1F4A33]/15 pt-6 text-[11px] tracking-[0.18em] text-[#4A524C] uppercase">
                  <div>
                    <div className="text-[9px] text-[#4A524C]/70">Local</div>
                    <div className="mt-1 text-[#1F4A33]">Multfisio</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#4A524C]/70">
                      A partir de
                    </div>
                    <div
                      className="mt-1 text-[18px] tracking-normal text-[#1F4A33] normal-case"
                      style={{
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                      }}
                    >
                      <span className="text-[11px] text-[#E89B3C] align-top">
                        R$
                      </span>{" "}
                      699,99
                    </div>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase transition-colors group-hover:text-[#E89B3C]">
                  <span>Saber mais</span>
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ====== SOBRE ====== */}
      <section
        id="sobre"
        className="relative z-2 border-t border-[#1F4A33]/10 bg-[#F5F1E8]"
      >
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Photo */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden">
                <Image
                  src="/matheus.jpeg"
                  alt="Matheus Fernandes, fisioterapeuta esportivo"
                  width={800}
                  height={1067}
                  priority
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
                {/* Decorative frame */}
                <div className="pointer-events-none absolute inset-0 border border-[#1F4A33]/10" />
              </div>
              <div className="mt-4 text-[10px] tracking-[0.22em] text-[#4A524C]/70 uppercase">
                Matheus Fernandes · CREFITO 3/321383-F
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
                <span className="h-px w-8 bg-[#E89B3C]" />
                <span>Sobre</span>
              </div>

              <h2
                className="mb-8 text-[clamp(36px,4.8vw,56px)] leading-[1.05] tracking-[-0.015em] text-[#1F4A33]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Avaliação clínica e tratamento{" "}
                <em className="font-light text-[#E89B3C] italic">
                  baseado em evidência.
                </em>
              </h2>

              <p
                className="mb-6 text-[18px] leading-[1.6] font-light text-[#1A1F1B]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Atuação clínica em fisioterapia esportiva, com experiência em
                avaliação, diagnóstico diferencial e reabilitação no esporte,
                do nível amador ao profissional. Atendimento individualizado em
                São Carlos/SP e cursos de formação para fisioterapeutas em todo
                o país.
              </p>

              {/* Formação */}
              <div className="mt-10 grid gap-6 border-t border-[#1F4A33]/15 pt-8 md:grid-cols-[160px_1fr] md:gap-10">
                <div className="text-[11px] font-semibold tracking-[0.3em] text-[#1F4A33] uppercase">
                  Formação
                </div>
                <div
                  className="space-y-2 text-[15px] leading-[1.65] font-light text-[#4A524C]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  <ul className="space-y-2">
                    <li>
                      Pós-graduado em Fisioterapia Traumato-Ortopédica com
                      ênfase em Terapia Manual{" "}
                      <span className="text-[#1F4A33]/70">— Barão de Mauá</span>
                    </li>
                    <li>
                      Pós-graduado em Fisioterapia Esportiva{" "}
                      <span className="text-[#1F4A33]/70">
                        — CETE / UNIFESP
                      </span>
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

              {/* CTA avaliação inline */}
              <div className="mt-10 flex flex-col items-start gap-6 border-t border-[#1F4A33]/15 pt-8 lg:flex-row lg:items-center lg:gap-8">
                <div
                  className="text-[clamp(20px,2.4vw,26px)] leading-tight text-[#1F4A33]"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  <em className="font-light text-[#E89B3C] italic">
                    Agende aqui
                  </em>{" "}
                  sua avaliação.
                </div>
                <a
                  href={WHATSAPP_AVALIACAO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3.5 overflow-hidden border border-[#1F4A33] bg-[#1F4A33] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase transition-colors hover:border-[#25D366]"
                >
                  <span className="absolute inset-0 -translate-y-full bg-[#25D366] transition-transform duration-300 group-hover:translate-y-0" />
                  <WhatsAppIcon className="relative h-5 w-5" />
                  <span className="relative">Falar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PRÓXIMA TURMA — TEASER ====== */}
      <section id="turma" className="relative z-2">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="mb-12 max-w-[720px]">
            <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
              <span className="h-px w-8 bg-[#E89B3C]" />
              <span>Próxima turma · São Carlos 2026</span>
            </div>
            <h2
              className="text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#1F4A33]"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              Terapias manuais modernas,{" "}
              <em className="font-light text-[#E89B3C] italic">
                em dois finais de semana.
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 border-y border-[#1F4A33]/15 md:grid-cols-4">
            {[
              { k: "Quando", v: "20, 21, 27 e 28 de junho de 2026" },
              { k: "Carga", v: "36 horas presenciais" },
              { k: "Onde", v: "Multfisio · Vila Prado · São Carlos/SP" },
              { k: "Turma", v: "Limitada a 20 fisioterapeutas" },
            ].map((it, i) => (
              <div
                key={it.k}
                className={`p-6 md:p-8 ${i < 3 ? "md:border-r md:border-[#1F4A33]/15" : ""} ${i > 0 ? "border-t border-[#1F4A33]/15 md:border-t-0" : ""}`}
              >
                <div className="mb-3 text-[10px] font-semibold tracking-[0.24em] text-[#E89B3C] uppercase">
                  {it.k}
                </div>
                <div
                  className="text-[16px] leading-[1.4] text-[#1F4A33]"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                  }}
                >
                  {it.v}
                </div>
              </div>
            ))}
          </div>

          <p
            className="mt-10 max-w-[640px] text-[17px] leading-[1.6] font-light text-[#4A524C]"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Quatro dias intensivos de prática hands-on com Dry Needling,
            manipulações quiropráticas, Maitland, Mulligan, neurodinâmica,
            crochetagem e Floss Band — aplicados ao ombro, quadril, coluna
            lombar, joelho e tornozelo.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/turmas/sao-carlos"
              className="group relative inline-flex items-center gap-3.5 overflow-hidden border border-[#1F4A33] bg-[#1F4A33] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase transition-colors hover:border-[#E89B3C]"
            >
              <span className="absolute inset-0 -translate-y-full bg-[#E89B3C] transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Ver detalhes da turma</span>
              <ArrowRight className="relative transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-[12px] tracking-[0.18em] text-[#4A524C]/70 uppercase">
              Lote 1 · promocional aberto
            </span>
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
              <div>Atendimento</div>
              <div className="mt-1 text-[#1F4A33]">São Carlos/SP</div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#1F4A33]/15 pt-6 text-[11px] tracking-[0.18em] text-[#4A524C] uppercase md:flex-row md:items-center">
            <div>© 2026 Matheus Fernandes · Todos os direitos reservados</div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
              <a
                href={WHATSAPP_AVALIACAO}
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

          <DevCredit />
        </div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}
