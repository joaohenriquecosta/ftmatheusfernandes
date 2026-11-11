import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DevCredit } from "@/components/dev-credit";
import { CERTIFICADOS, type Certificado } from "../dados";

const FRAUNCES = "var(--font-fraunces), Georgia, serif";
const SITE = "https://ftmatheusfernandes.com.br";
const BASE = "/certificados/dry-needling";
const CURSO = "Curso de Dry Needling";
const EMISSOR = "Matheus Fernandes · Fisioterapia Esportiva";
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

type Props = { params: Promise<{ codigo: string }> };

// Só existem as páginas dos certificados emitidos; qualquer outro código → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CERTIFICADOS.map((c) => ({ codigo: c.codigo.toLowerCase() }));
}

function busca(codigo: string): Certificado | undefined {
  return CERTIFICADOS.find((c) => c.codigo.toLowerCase() === codigo.toLowerCase());
}

const ehExemplo = (c: Certificado) => c.codigo === "EXEMPLO";

function porExtenso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = busca((await params).codigo);
  if (!c) return {};
  const pasta = `${BASE}/${c.codigo.toLowerCase()}`;
  const title = `${c.nome} — Certificado · ${CURSO}`;
  const description = `${c.nome} concluiu o ${CURSO} (20 horas presenciais) com Matheus Fernandes, Fisioterapeuta Esportivo. Código ${c.codigo}.`;
  return {
    title,
    description,
    alternates: { canonical: pasta },
    // Página pública para verificação, mas fora dos buscadores (nome + CREFITO do aluno).
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: pasta,
      type: "website",
      locale: "pt_BR",
      images: [{ url: `${pasta}/og.jpg`, width: 1200, height: 848, alt: `Certificado de ${c.nome}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${pasta}/og.jpg`] },
  };
}

export default async function CertificadoPage({ params }: Props) {
  const c = busca((await params).codigo);
  if (!c) notFound();

  const pasta = `${BASE}/${c.codigo.toLowerCase()}`;
  const [ano, mes] = c.emissao.split("-").map(Number);
  const linkedin =
    "https://www.linkedin.com/profile/add?" +
    new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: CURSO,
      organizationName: EMISSOR,
      issueYear: String(ano),
      issueMonth: String(mes),
      certUrl: `${SITE}${pasta}`,
      certId: c.codigo,
    });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF7F1] text-[#1A1F1B]">
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-[#1F4A33]" />

      <nav className="relative mx-auto flex max-w-[1100px] items-center justify-between px-6 pt-10 md:px-12">
        <Link
          href="/"
          className="inline-flex flex-col gap-1 text-[11px] font-medium tracking-[0.18em] text-[#4A524C] uppercase transition-colors hover:text-[#1F4A33]"
        >
          <span>← Matheus Fernandes</span>
          <span className="text-[10px] tracking-[0.2em] text-[#4A524C]/60">CREFITO 3/321383-F</span>
        </Link>
        <div className="hidden text-[11px] tracking-[0.18em] text-[#4A524C] uppercase md:block">
          Verificação de certificado
        </div>
      </nav>

      <section className="relative mx-auto max-w-[1100px] px-6 pt-14 pb-10 md:px-12 md:pt-20">
        {ehExemplo(c) ? (
          <div className="mb-6 inline-flex items-center gap-2 border border-[#E89B3C]/50 bg-[#F4C690]/25 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#8a5413] uppercase">
            Modelo de exemplo · não é um certificado emitido
          </div>
        ) : (
          <div className="mb-6 inline-flex items-center gap-2 border border-[#1F4A33]/25 bg-[#1F4A33]/[0.06] px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#1F4A33] uppercase">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
              <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.8 8.2l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Certificado válido
          </div>
        )}

        <h1
          className="text-[clamp(34px,5.5vw,60px)] leading-[1.05] tracking-[-0.015em] text-[#1F4A33]"
          style={{ fontFamily: FRAUNCES }}
        >
          {c.nome}
        </h1>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.6] text-[#4A524C]">
          concluiu o <strong className="font-semibold text-[#1F4A33]">{CURSO}</strong>, com carga horária de 20
          horas presenciais, ministrado por Matheus Fernandes.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#1F4A33] px-5 py-3.5 text-[13px] font-semibold tracking-[0.12em] text-[#FAF7F1] uppercase transition-colors hover:bg-[#173a28]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
            Adicionar ao LinkedIn
          </a>
          <a
            href={`${pasta}/certificado.pdf`}
            download={`Certificado Dry Needling - ${c.nome}.pdf`}
            className="inline-flex items-center border border-[#1F4A33]/30 px-5 py-3.5 text-[13px] font-semibold tracking-[0.12em] text-[#1F4A33] uppercase transition-colors hover:border-[#1F4A33] hover:bg-[#1F4A33]/[0.04]"
          >
            Baixar PDF
          </a>
          <a
            href={`${pasta}/certificado.png`}
            download={`Certificado Dry Needling - ${c.nome}.png`}
            className="inline-flex items-center border border-[#1F4A33]/30 px-5 py-3.5 text-[13px] font-semibold tracking-[0.12em] text-[#1F4A33] uppercase transition-colors hover:border-[#1F4A33] hover:bg-[#1F4A33]/[0.04]"
          >
            Baixar imagem
          </a>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1100px] px-6 md:px-12">
        <a href={`${pasta}/certificado.pdf`} target="_blank" rel="noopener noreferrer" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${pasta}/og.jpg`}
            srcSet={`${pasta}/og.jpg 1200w, ${pasta}/certificado.png 3508w`}
            sizes="(min-width: 1100px) 1000px, 100vw"
            width={1200}
            height={848}
            alt={`Certificado de conclusão do ${CURSO} — ${c.nome}`}
            className="h-auto w-full shadow-[0_2px_30px_rgba(31,74,51,0.14)]"
          />
        </a>
      </section>

      <section className="relative mx-auto max-w-[1100px] px-6 pt-14 pb-10 md:px-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-x-10 border-t border-[#1F4A33]/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Titular">{c.nome}</Info>
          {c.crefito && <Info label="CREFITO">{c.crefito}</Info>}
          <Info label="Curso">{CURSO}</Info>
          <Info label="Carga horária">20 horas presenciais</Info>
          <Info label="Realização">14 e 15 de novembro de 2026</Info>
          <Info label="Local">Clínica Aviven · São Carlos/SP</Info>
          <Info label="Emissor">
            Matheus Fernandes
            <br />
            <span className="text-[#4A524C]">Fisioterapeuta Esportivo · CREFITO 3/321383-F</span>
          </Info>
          <Info label="Emissão">{porExtenso(c.emissao)}</Info>
          <Info label="Código da credencial">
            <span className="font-medium tracking-[0.06em] tabular-nums">{c.codigo}</span>
          </Info>
        </dl>
        <p className="mt-10 max-w-[640px] text-[13px] leading-[1.6] text-[#4A524C]">
          Este é o endereço permanente deste certificado. Ele pode ser usado como URL da credencial no LinkedIn e serve
          para que qualquer pessoa confira a autenticidade do documento.{" "}
          <Link href="/turmas/dry-needling" className="text-[#1F4A33] underline underline-offset-2">
            Sobre o curso
          </Link>
          .
        </p>
        <DevCredit />
      </section>
    </main>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-[#4A524C] uppercase">{label}</dt>
      <dd className="text-[15px] leading-[1.45] text-[#1F4A33]">{children}</dd>
    </div>
  );
}
