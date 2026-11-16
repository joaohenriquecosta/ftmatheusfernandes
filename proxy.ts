import { NextResponse, type NextRequest } from "next/server";

import { AULA_COOKIE, aulaToken, iguais } from "@/lib/aula-acesso";

// Só a gravação da aula passa por aqui: página (com e sem .html) e o vídeo em /aula/v/*.
export async function proxy(request: NextRequest) {
  const token = await aulaToken();
  const cookie = request.cookies.get(AULA_COOKIE)?.value ?? "";
  if (token && iguais(cookie, token)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/turmas/dry-needling/aula/v/")) {
    return new NextResponse("unauthorized", { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/turmas/dry-needling/aula-senha.html";
  const res = NextResponse.rewrite(url);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/turmas/dry-needling/aula", "/turmas/dry-needling/aula.html", "/turmas/dry-needling/aula/v/:file"],
};
