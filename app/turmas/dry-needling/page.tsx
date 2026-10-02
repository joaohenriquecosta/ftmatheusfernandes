import type { Metadata } from "next";
import Link from "next/link";

import { DevCredit } from "@/components/dev-credit";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Curso de Dry Needling — São Carlos · 14 e 15 de Novembro",
  description:
    "20 horas presenciais de Dry Needling com Matheus Fernandes. Prática baseada em evidência, pontos-gatilho e raciocínio clínico. Clínica Aviven, São Carlos/SP.",
};

const FRAUNCES = "var(--font-fraunces), Georgia, serif";
const WHATSAPP_URL =
  "https://wa.me/5516991167474?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20curso%20de%20Dry%20Needling.";
const INSCRICAO_URL = "/turmas/dry-needling/inscricao";

export default function DryNeedlingPage() {
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
          Turma · São Carlos 2026
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
              Dry{" "}
              <em className="font-light text-[#E89B3C] italic">needling.</em>
            </h1>
            <p
              className="mb-14 max-w-[540px] animate-[fadeUp_0.9s_ease_0.6s_both] text-[20px] leading-normal font-light text-[#4A524C]"
              style={{ fontFamily: FRAUNCES }}
            >
              Clinicamente eficaz, abordagem baseada em evidência. Dois dias
              para aprender a identificar e tratar os pontos-gatilho onde a
              clínica funciona — e a literatura confirma.
            </p>
            <a
              href={INSCRICAO_URL}
              className="group relative inline-flex animate-[fadeUp_0.9s_ease_0.8s_both] items-center gap-3.5 overflow-hidden border border-[#1F4A33] bg-[#1F4A33] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#FAF7F1] uppercase transition-colors hover:border-[#E89B3C]"
            >
              <span className="absolute inset-0 -translate-y-full bg-[#E89B3C] transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Garantir minha vaga</span>
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
              >
                14
              </div>
              <div className="relative border-l-[3px] border-[#E89B3C] py-2 pl-8">
                <div className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-[#E89B3C] uppercase">
                  Sábado e Domingo
                </div>
                <div
                  className="text-[clamp(48px,7vw,80px)] leading-none tracking-[-0.02em] text-[#1F4A33]"
                  style={{ fontFamily: FRAUNCES }}
                >
                  14 <em className="font-light text-[#E89B3C] italic">&amp;</em>{" "}
                  15
                </div>
                <div
                  className="text-[24px] font-light text-[#4A524C]"
                  style={{ fontFamily: FRAUNCES }}
                >
                  Novembro de 2026
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#1F4A33]/15 pt-8">
                <Info label="Local">
                  Clínica Aviven
                  <br />
                  Centro · São Carlos/SP
                </Info>
                <Info label="Horário">
                  08h às 20h
                  <br />
                  ambos os dias
                </Info>
                <Info label="Carga horária">20 horas</Info>
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
                Agulha onde{" "}
                <em className="font-light text-[#E89B3C] italic">
                  faz sentido.
                </em>
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p
                className="mb-6 text-[19px] leading-[1.55] font-light text-[#1A1F1B]"
                style={{ fontFamily: FRAUNCES }}
              >
                Nossa abordagem é totalmente baseada em Prática Baseada em
                Evidência. Não vamos ensinar a aplicar agulhamento a seco
                &ldquo;no corpo inteiro&rdquo; de forma indiscriminada.
              </p>
              <p className="text-[14px] leading-[1.7] text-[#4A524C]">
                O foco é ser assertivo: identificar e tratar pontos-gatilho
                onde realmente observamos que a clínica funciona e onde temos
                respaldo de estudos de qualidade — principalmente ensaios
                clínicos que indicam a eficácia da aplicação. Outras áreas
                entram como curiosidade; especialistas, nos tornamos naquilo
                que as evidências mostram trazer resultado real ao paciente.
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
              Da teoria{" "}
              <em className="font-light text-[#E89B3C] italic">à maca.</em>
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

      {/* INVESTIMENTO */}
      <section className="relative z-2 bg-[#1F4A33] text-[#FAF7F1]">
        <div
          className="absolute -top-32 right-0 h-64 w-64 opacity-15"
          style={{
            background: "radial-gradient(circle, #E89B3C 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#F4C690] uppercase">
                <span className="h-px w-8 bg-[#F4C690]" />
                <span>Investimento</span>
              </div>
              <h2
                className="mb-8 text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.02em]"
                style={{ fontFamily: FRAUNCES }}
              >
                Valor{" "}
                <em className="font-light text-[#F4C690] italic">único.</em>
              </h2>
              <p className="max-w-[480px] text-[14px] leading-[1.6] text-[#FAF7F1]/70">
                Pagamento via Pix ou cartão em até 12x. Confirmação imediata
                e adição ao grupo de WhatsApp da turma.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="border-l-[3px] border-[#E89B3C] pl-8">
                <div className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-[#F4C690] uppercase">
                  Inscrição · 20h de curso
                </div>
                <div
                  className="text-[clamp(56px,8vw,96px)] leading-none tracking-[-0.02em]"
                  style={{ fontFamily: FRAUNCES }}
                >
                  <span className="text-[0.4em] text-[#F4C690]">R$ </span>500
                </div>
                <a
                  href={INSCRICAO_URL}
                  className="group relative mt-10 inline-flex items-center gap-3.5 overflow-hidden border border-[#E89B3C] bg-[#E89B3C] px-9 py-5 text-[15px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase"
                >
                  <span className="absolute inset-0 -translate-y-full bg-[#FAF7F1] transition-transform duration-300 group-hover:translate-y-0" />
                  <span className="relative">Inscrever-se agora</span>
                  <ArrowRight className="relative transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-2 border-t border-[#1F4A33]/10">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div
                className="mb-2 text-[28px] text-[#1F4A33]"
                style={{ fontFamily: FRAUNCES }}
              >
                Matheus Fernandes
              </div>
              <div className="text-[11px] tracking-[0.2em] text-[#4A524C] uppercase">
                Fisioterapeuta Esportivo · CREFITO 3/321383-F
              </div>
            </div>
            <div className="text-left text-[11px] tracking-[0.2em] text-[#4A524C] uppercase md:text-right">
              <div>Local</div>
              <div className="mt-1 text-[#1F4A33]">
                Clínica Aviven · São Carlos/SP
              </div>
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
      `}</style>
    </main>
  );
}

const PROGRAMA = [
  {
    num: "i",
    title: "Fundamentos e segurança",
    topics: [
      "Fisiopatologia do ponto-gatilho miofascial e dor referida",
      "Mecanismos de ação do agulhamento a seco: o que a evidência sustenta",
      "Indicações, contraindicações e manejo de intercorrências",
      "Biossegurança, descarte e aspectos legais da prática",
    ],
  },
  {
    num: "ii",
    title: "Avaliação e raciocínio clínico",
    topics: [
      "Palpação e identificação de pontos-gatilho ativos e latentes",
      "Diagnóstico diferencial: quando agulhar — e quando não",
      "Leitura crítica de ensaios clínicos sobre dry needling",
      "Integração com terapia manual e exercício",
    ],
  },
  {
    num: "iii",
    title: "Prática supervisionada",
    topics: [
      "Técnicas de inserção e resposta de contração local",
      "Músculos com melhor respaldo clínico: cervical, ombro, lombar, quadril e MMII",
      "Hands-on em duplas com supervisão individual",
      "Dosagem, progressão e reavaliação do paciente",
    ],
  },
] as const;

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#4A524C] uppercase">
        {label}
      </div>
      <div
        className="text-[15px] leading-[1.4] text-[#1F4A33]"
        style={{ fontFamily: FRAUNCES }}
      >
        {children}
      </div>
    </div>
  );
}
