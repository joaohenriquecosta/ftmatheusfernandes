import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DevCredit } from "@/components/dev-credit";
import { LockOutline } from "@/components/icons";
import * as turmaModel from "@/models/turma";

export const metadata: Metadata = {
  title: "Inscrição — Curso de Dry Needling · São Carlos",
  robots: { index: false },
};

const FRAUNCES = "var(--font-fraunces), Georgia, serif";
const SLUG = "dry-needling";

export default function InscricaoPage() {
  const turma = turmaModel.get(SLUG);
  const lote = turma && turmaModel.getLoteVigente(turma);
  if (!turma || !lote) notFound();

  const valor = (lote.valorCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <main className="min-h-screen bg-[#FAF7F1] px-6 py-16 text-[#1A1F1B] md:px-12 md:py-24">
      <div className="mx-auto max-w-[640px]">
        <Link
          href={`/turmas/${SLUG}`}
          className="mb-10 inline-block text-[11px] font-medium tracking-[0.18em] text-[#4A524C] uppercase transition-colors hover:text-[#1F4A33]"
        >
          ← Voltar ao curso
        </Link>

        <form
          method="post"
          action={`/api/turmas/${SLUG}/comprar`}
          className="relative border border-[#1F4A33]/15 bg-[#F5F1E8] shadow-[0_2px_0_rgba(31,74,51,0.04),0_24px_60px_-30px_rgba(31,74,51,0.25)]"
        >
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
              Quase{" "}
              <em className="font-light text-[#E89B3C] italic">lá.</em>
            </h1>

            <div className="mb-10 space-y-2 border-y border-[#1F4A33]/15 py-5 text-[13px] text-[#4A524C]">
              <Row label="Curso" value={turma.nome} />
              <Row label="Quando" value={turma.datas} />
              <Row label="Onde" value={`${turma.local} · ${turma.cidade}/${turma.uf}`} />
              <Row label="Valor" value={valor} strong />
            </div>

            <div className="space-y-7">
              <Field label="Nome completo" name="nome" autoComplete="name" />
              <Field
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
              />
              <Field
                label="WhatsApp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(16) 99999-9999"
                pattern="[\d\s()+-]{10,20}"
              />
            </div>

            <button
              type="submit"
              className="group relative mt-10 inline-flex w-full items-center justify-center gap-3 overflow-hidden border border-[#E89B3C] bg-[#E89B3C] px-6 py-5 text-[13px] font-semibold tracking-[0.24em] text-[#1F4A33] uppercase transition-colors hover:border-[#1F4A33]"
            >
              <span className="absolute inset-0 -translate-y-[calc(100%+1px)] bg-[#FAF7F1] transition-transform duration-300 group-hover:translate-y-0" />
              <LockOutline className="relative h-4 w-4" />
              <span className="relative">Ir para o pagamento</span>
            </button>

            <p className="mt-6 text-center text-[11px] leading-[1.6] text-[#4A524C]/80">
              Você será redirecionado ao checkout seguro da InfinitePay. Pix ou
              cartão em até 12x. Seus dados são usados apenas para confirmar a
              inscrição e adicionar você ao grupo da turma.
            </p>
          </div>
        </form>

        <DevCredit />
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[10px] font-semibold tracking-[0.22em] text-[#4A524C]/80 uppercase">
        {label}
      </span>
      <span
        className={`text-right text-[#1F4A33] ${strong ? "text-[18px]" : "text-[13px]"}`}
        style={strong ? { fontFamily: FRAUNCES } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold tracking-[0.28em] text-[#1F4A33] uppercase">
        {label}
      </span>
      <input
        name={name}
        required
        maxLength={140}
        className="w-full border-0 border-b border-[#1F4A33]/25 bg-transparent pb-2 text-[17px] text-[#1F4A33] placeholder:text-[#4A524C]/35 focus:border-[#1F4A33] focus:outline-none"
        style={{ fontFamily: FRAUNCES }}
        {...rest}
      />
    </label>
  );
}
