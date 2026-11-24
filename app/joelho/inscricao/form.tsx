"use client";

import { useState } from "react";

import { LockOutline } from "@/components/icons";

const FRAUNCES = "var(--font-fraunces), Georgia, serif";

const ERROS: Record<string, string> = {
  whatsapp: "Confira o WhatsApp: celular com DDD e o 9 na frente.",
  registro: "Confira a matrícula (estudante) ou o CREFITO (fisioterapeuta).",
  autorizo: "É preciso autorizar o uso de imagem nas gravações para participar.",
  cupom: "Cupom inválido ou expirado.",
};

export function FormInscricao(props: {
  action: string;
  erro?: string;
  curso: string;
  datas: string;
  onde: string;
  lote: string;
  valorEstudante: string;
  valorProfissional: string;
}) {
  const [categoria, setCategoria] = useState<"estudante" | "profissional" | "">("");
  const valor =
    categoria === "estudante"
      ? props.valorEstudante
      : categoria === "profissional"
        ? props.valorProfissional
        : `${props.valorEstudante} a ${props.valorProfissional}`;
  const msg = props.erro ? ERROS[props.erro] : undefined;

  return (
    <form method="post" action={props.action}>
      <div className="mb-10 space-y-2 border-y border-[#1F4A33]/15 py-5 text-[13px] text-[#4A524C]">
        <Row label="Curso" value={props.curso} />
        <Row label="Quando" value={props.datas} />
        <Row label="Onde" value={props.onde} />
        <Row label={props.lote} value={valor} strong />
      </div>

      {msg && (
        <p role="alert" className="mb-8 border-l-2 border-red-700 pl-3 text-[13px] text-red-700">
          {msg}
        </p>
      )}

      <div className="space-y-7">
        <Field label="Nome completo" name="nome" autoComplete="name" />
        <Field label="E-mail" name="email" type="email" autoComplete="email" />
        <Field
          label="WhatsApp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(16) 99999-9999"
          pattern={String.raw`(\+?55)?[\s\(]*\d{2}[\s\)]*9[\s.\-]*\d{4}[\s.\-]*\d{4}\s*`}
          title="Celular com DDD e o 9 na frente, ex.: (16) 99999-9999"
        />

        <fieldset>
          <legend className="mb-3 block text-[10px] font-semibold tracking-[0.28em] text-[#1F4A33] uppercase">
            Categoria
          </legend>
          <div className="grid gap-2">
            {(
              [
                ["estudante", `Estudante · ${props.valorEstudante}`, "Penúltimo ou último ano de Fisioterapia"],
                ["profissional", `Fisioterapeuta · ${props.valorProfissional}`, "Formado, com CREFITO"],
              ] as const
            ).map(([v, t, d]) => (
              <label
                key={v}
                className="flex min-h-11 cursor-pointer items-start gap-3 border border-[#1F4A33]/20 px-4 py-3 has-checked:border-[#1F4A33] has-checked:bg-[#FAF7F1]"
              >
                <input
                  type="radio"
                  name="categoria"
                  value={v}
                  required
                  checked={categoria === v}
                  onChange={() => setCategoria(v)}
                  className="mt-1 h-4 w-4 accent-[#1F4A33]"
                />
                <span>
                  <span className="block text-[16px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
                    {t}
                  </span>
                  <span className="block text-[12px] text-[#4A524C]">{d}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {categoria === "estudante" && (
          <>
            <Field label="Instituição" name="instituicao" placeholder="Ex.: UFSCar, Unicep" />
            <fieldset>
              <legend className="mb-3 block text-[10px] font-semibold tracking-[0.28em] text-[#1F4A33] uppercase">
                Ano do curso
              </legend>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-[#1F4A33]">
                <label className="inline-flex min-h-11 items-center gap-3">
                  <input type="radio" name="ano" value="penultimo" required className="h-4 w-4 accent-[#1F4A33]" />
                  Penúltimo ano
                </label>
                <label className="inline-flex min-h-11 items-center gap-3">
                  <input type="radio" name="ano" value="ultimo" className="h-4 w-4 accent-[#1F4A33]" />
                  Último ano
                </label>
              </div>
            </fieldset>
            <Field label="Número de matrícula" name="matricula" autoComplete="off" />
          </>
        )}
        {categoria === "profissional" && (
          <Field label="CREFITO" name="crefito" placeholder="Ex.: 3/123456-F" autoComplete="off" />
        )}

        <Field label="Cupom (opcional)" name="cupom" required={false} autoComplete="off" />

        <label className="flex items-start gap-3 text-[13px] leading-[1.55] text-[#4A524C]">
          <input type="checkbox" name="autorizo" value="sim" required className="mt-1 h-4 w-4 shrink-0 accent-[#1F4A33]" />
          <span>
            Autorizo o uso da minha imagem e voz nas gravações do curso, para
            fins educacionais e de divulgação do Matheus Fernandes.
          </span>
        </label>
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
        Você será redirecionado ao checkout seguro da InfinitePay. Pix ou cartão
        em até 12x. Seus dados são usados para confirmar a inscrição, conferir a
        categoria e adicionar você ao grupo da turma.
      </p>
    </form>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[10px] font-semibold tracking-[0.22em] text-[#4A524C]/80 uppercase">{label}</span>
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
        className="w-full border-0 border-b border-[#1F4A33]/25 bg-transparent pb-2 text-[17px] text-[#1F4A33] placeholder:text-[#4A524C]/35 focus:border-[#1F4A33] focus:outline-none [&:user-invalid]:border-red-700"
        style={{ fontFamily: FRAUNCES }}
        {...rest}
      />
    </label>
  );
}
