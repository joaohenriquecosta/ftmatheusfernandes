import { NextResponse, type NextRequest } from "next/server";

import { AULA_COOKIE, AULA_EXPIRA_MS, AULA_PATH, aulaToken, iguais } from "@/lib/aula-acesso";

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const senha = String(form?.get("senha") ?? "").trim().toLowerCase();
  const esperada = process.env.AULA_PASSWORD?.trim().toLowerCase() ?? "";
  const token = await aulaToken();

  const destino = new URL(AULA_PATH, request.url);
  if (!token || !esperada || !iguais(senha, esperada)) {
    destino.searchParams.set("erro", "1");
    return NextResponse.redirect(destino, 303);
  }

  const res = NextResponse.redirect(destino, 303);
  res.cookies.set(AULA_COOKIE, token, {
    path: AULA_PATH,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(AULA_EXPIRA_MS),
  });
  return res;
}
