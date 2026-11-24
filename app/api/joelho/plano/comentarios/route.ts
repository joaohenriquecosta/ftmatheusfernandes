import { NextResponse, type NextRequest } from "next/server";

import { PLANO_COOKIE, autorizado } from "@/lib/plano-acesso";
import * as comentario from "@/models/comentario";

const PAGINA = "joelho-plano";
const noStore = { "Cache-Control": "no-store" };

async function guard(req: NextRequest) {
  return autorizado(req.cookies.get(PLANO_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  return NextResponse.json(await comentario.list(PAGINA), { headers: noStore });
}

export async function POST(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const str = (k: string, max: number) =>
    typeof body?.[k] === "string" ? (body[k] as string).trim().slice(0, max) : "";
  const secao = str("secao", 60);
  const autor = str("autor", 40);
  const texto = str("texto", 2000);
  if (!/^[a-z0-9-]+$/.test(secao) || !autor || !texto) {
    return NextResponse.json({ error: "invalid" }, { status: 400, headers: noStore });
  }
  const c = await comentario.add({ pagina: PAGINA, secao, autor, texto });
  return NextResponse.json(c, { status: 201, headers: noStore });
}

export async function PATCH(req: NextRequest) {
  if (!(await guard(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  const body = (await req.json().catch(() => null)) as { id?: unknown; resolvido?: unknown } | null;
  if (typeof body?.id !== "string" || typeof body.resolvido !== "boolean") {
    return NextResponse.json({ error: "invalid" }, { status: 400, headers: noStore });
  }
  const ok = await comentario.setResolvido(body.id, PAGINA, body.resolvido);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404, headers: noStore });
}
