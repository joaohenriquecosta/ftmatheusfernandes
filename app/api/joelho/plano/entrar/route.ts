import { NextResponse, type NextRequest } from "next/server";

import { PLANO_COOKIE, PLANO_MAX_AGE, PLANO_PATH, iguais, planoToken } from "@/lib/plano-acesso";

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const senha = String(form?.get("senha") ?? "").trim().toLowerCase();
  const esperada = process.env.JOELHO_PLANO_SENHA?.trim().toLowerCase() ?? "";
  const token = await planoToken();

  const destino = new URL(PLANO_PATH, request.url);
  if (!token || !esperada || !iguais(senha, esperada)) {
    // Atrasa cada tentativa errada para encarecer chute automático da senha.
    await new Promise((r) => setTimeout(r, 800));
    destino.searchParams.set("erro", "1");
    return NextResponse.redirect(destino, 303);
  }

  const res = NextResponse.redirect(destino, 303);
  res.cookies.set(PLANO_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PLANO_MAX_AGE,
  });
  return res;
}
