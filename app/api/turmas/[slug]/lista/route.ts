import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";

import { normalizePhone } from "@/models/infinitepay";
import * as lista from "@/models/lista";
import * as turmaModel from "@/models/turma";

// Lista de espera do pré-lançamento. Volta para a página do curso com ?lista=ok|erro.
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const turma = turmaModel.get(slug);
  if (!turma || turma.ativa === false) {
    return NextResponse.json({ error: "turma_not_found" }, { status: 404 });
  }
  const volta = (status: string) => {
    const pagina = turmaModel.paginaInscricao(turma).replace(/\/inscricao$/, "");
    return NextResponse.redirect(new URL(`${pagina}?lista=${status}#investimento`, req.url), 303);
  };

  const form = await req.formData().catch(() => null);
  const field = (k: string) => {
    const v = form?.get(k);
    return typeof v === "string" && v.trim() ? v.trim().slice(0, 140) : undefined;
  };
  // Honeypot: robôs preenchem o campo escondido; finge sucesso sem gravar.
  if (field("site")) return volta("ok");

  const nome = field("nome");
  const email = field("email");
  const whatsapp = normalizePhone(field("whatsapp"));
  const perfil = field("perfil");
  if (
    !nome ||
    !email ||
    !email.includes("@") ||
    !whatsapp ||
    !/^\d{2}9\d{8}$/.test(whatsapp) ||
    (perfil !== "estudante" && perfil !== "profissional")
  ) {
    return volta("erro");
  }

  const item = await lista.add({
    turma: slug,
    nome,
    email,
    whatsapp,
    perfil,
    origem: field("origem")?.slice(0, 60),
  });
  await avisar(turma.nome, item);
  return volta("ok");
}

async function avisar(curso: string, x: lista.Interessado) {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.NOTIFY_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || to.length === 0) return;
  const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
  try {
    const total = (await lista.list(x.turma)).length;
    await new Resend(key).emails.send({
      from: "Inscrições <inscricoes@ftmatheusfernandes.com.br>",
      to,
      subject: `📝 Lista de espera: ${x.nome} · ${curso} (${total} na lista)`,
      html: `<div style="font-family:Inter,Arial,sans-serif;color:#1A1F1B;max-width:560px;padding:24px;border-top:3px solid #1F4A33">
        <p style="font-size:16px"><strong>${esc(x.nome)}</strong> entrou na lista de espera (${x.perfil}).</p>
        <p style="color:#4A524C">${esc(x.email)} · ${esc(x.whatsapp)}${x.origem ? ` · origem: ${esc(x.origem)}` : ""}</p>
        <p style="font-size:12px;color:#4A524C">${total} pessoas na lista. Lista completa em /admin/inscricoes?turma=${esc(x.turma)} (link com token).</p>
      </div>`,
    });
  } catch (err) {
    console.error("[lista:notify] failed", err instanceof Error ? err.message : err);
  }
}
