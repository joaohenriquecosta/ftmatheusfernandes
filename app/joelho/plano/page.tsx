import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PLANO_COOKIE, autorizado, decifrar } from "@/lib/plano-acesso";

import { PLANO_CIFRADO } from "./conteudo";
import { PlanoView } from "./plano-view";

export const metadata: Metadata = {
  title: "Plano de lançamento · Curso de joelho",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const FRAUNCES = "var(--font-fraunces), Georgia, serif";

export default async function PlanoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const jar = await cookies();
  const ok = await autorizado(jar.get(PLANO_COOKIE)?.value);
  const html = ok ? decifrar(PLANO_CIFRADO) : null;

  if (ok && html) return <PlanoView html={html} />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F1] px-6 text-[#1A1F1B]">
      <form
        method="post"
        action="/api/joelho/plano/entrar"
        className="relative w-full max-w-[420px] border border-[#1F4A33]/15 bg-[#F5F1E8] px-8 py-12"
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[#1F4A33]" />
        <div className="mb-3 inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.32em] text-[#A9650F] uppercase">
          <span className="h-px w-7 bg-[#E89B3C]" />
          <span>Documento interno</span>
        </div>
        <h1 className="mb-8 text-[38px] leading-none text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
          Plano do curso de <em className="font-light text-[#A9650F] italic">joelho.</em>
        </h1>
        {ok && !html && (
          <p role="alert" className="mb-6 text-[13px] text-red-700">
            O plano não pôde ser aberto agora. Avise o João.
          </p>
        )}
        <label className="block">
          <span className="mb-2 block text-[10px] font-semibold tracking-[0.28em] text-[#1F4A33] uppercase">
            Senha
          </span>
          <input
            name="senha"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? "senha-erro" : undefined}
            className="w-full border-0 border-b border-[#1F4A33]/25 bg-transparent pb-2 text-[18px] text-[#1F4A33] focus:border-[#1F4A33] focus:outline-none aria-invalid:border-red-700"
          />
        </label>
        {erro && (
          <p id="senha-erro" role="alert" className="mt-3 text-[12px] text-red-700">
            Senha incorreta.
          </p>
        )}
        <button
          type="submit"
          className="mt-10 w-full border border-[#1F4A33] bg-[#1F4A33] px-6 py-4 text-[13px] font-semibold tracking-[0.24em] text-[#FAF7F1] uppercase transition-colors hover:bg-[#163826]"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
