import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DevCredit } from "@/components/dev-credit";
import * as turmaModel from "@/models/turma";

import { FormInscricao } from "./form";

export const metadata: Metadata = {
  title: "Inscrição — Curso Joelho no Esporte · São Carlos",
  robots: { index: false },
};

const FRAUNCES = "var(--font-fraunces), Georgia, serif";
const SLUG = "joelho";

export default async function InscricaoJoelhoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const turma = turmaModel.get(SLUG);
  if (!turma) notFound();
  if (turma.vendasAbertas === false) redirect("/joelho#investimento");
  const lote = turmaModel.getLoteVigente(turma);
  if (!lote) notFound();

  const brl = (c: number) =>
    (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <main className="min-h-screen bg-[#FAF7F1] px-6 py-16 text-[#1A1F1B] md:px-12 md:py-24">
      <div className="mx-auto max-w-[640px]">
        <Link
          href="/joelho"
          className="mb-10 inline-block text-[11px] font-medium tracking-[0.18em] text-[#4A524C] uppercase transition-colors hover:text-[#1F4A33]"
        >
          ← Voltar ao curso
        </Link>
        <div className="relative border border-[#1F4A33]/15 bg-[#F5F1E8] shadow-[0_2px_0_rgba(31,74,51,0.04),0_24px_60px_-30px_rgba(31,74,51,0.25)]">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-[#1F4A33]" />
          <div className="px-7 pt-10 pb-10 md:px-12 md:pt-14 md:pb-12">
            <div className="mb-3 inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.32em] text-[#E89B3C] uppercase">
              <span className="h-px w-7 bg-[#E89B3C]" />
              <span>Inscrição</span>
            </div>
            <h1
              className="mb-8 text-[clamp(32px,5vw,52px)] leading-[0.98] tracking-[-0.02em] text-[#1F4A33]"
              style={{ fontFamily: FRAUNCES }}
            >
              Quase <em className="font-light text-[#E89B3C] italic">lá.</em>
            </h1>
            <FormInscricao
              action={`/api/turmas/${SLUG}/comprar`}
              erro={erro}
              curso={turma.nome}
              datas={turma.datas}
              onde={`${turma.local} · ${turma.cidade}/${turma.uf}`}
              lote={lote.nome}
              valorEstudante={brl(turmaModel.valorDoLote(lote, "estudante"))}
              valorProfissional={brl(turmaModel.valorDoLote(lote, "profissional"))}
            />
          </div>
        </div>
        <DevCredit />
      </div>
    </main>
  );
}
