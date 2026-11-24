import { NextResponse, type NextRequest } from "next/server";

import { normalizePhone } from "@/models/infinitepay";
import * as notify from "@/models/notify";
import * as orderModel from "@/models/order";
import * as paymentModel from "@/models/payment";
import * as turmaModel from "@/models/turma";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;

  const turma = turmaModel.get(slug);
  if (!turma) {
    return NextResponse.json(
      { error: "turma_not_found" },
      { status: 404 },
    );
  }

  // Turma desmarcada/sem data prevista: bloqueia o checkout mesmo que algum
  // link/QR antigo aponte pra cá.
  if (turma.ativa === false) {
    return NextResponse.json(
      { error: "turma_inativa" },
      { status: 410 },
    );
  }

  // Pré-lançamento: página no ar só com lista de espera.
  if (turma.vendasAbertas === false) {
    return NextResponse.json(
      { error: "vendas_nao_abertas" },
      { status: 403 },
    );
  }

  // Recalcula o lote vigente no momento do clique — defensivo contra cache da
  // página (revalidate=3600). Se o usuário cliquei perto da virada de lote, o
  // valor cobrado é o atual, não o que estava na UI.
  const lote = turmaModel.getLoteVigente(turma);
  if (!lote) {
    return NextResponse.json(
      { error: "vendas_encerradas" },
      { status: 410 },
    );
  }

  const pagina = turmaModel.paginaInscricao(turma);
  const erro = (codigo: string) =>
    NextResponse.redirect(new URL(`${pagina}?erro=${codigo}`, req.url), 303);

  // Página intermediária (/turmas/[slug]/inscricao) manda nome/email/whats.
  // Botões antigos sem form continuam funcionando (campos vazios).
  const form = await req.formData().catch(() => null);
  const field = (k: string) => {
    const v = form?.get(k);
    return typeof v === "string" && v.trim() ? v.trim().slice(0, 140) : undefined;
  };
  const customer = {
    name: field("nome"),
    email: field("email"),
    phone: normalizePhone(field("whatsapp")),
  };
  if (form && (!customer.name || !customer.email || !customer.phone)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  // Mesma regra do pattern do form: celular BR com DDD (o 9 é inserido se faltar).
  if (form && !/^\d{2}9\d{8}$/.test(customer.phone!)) {
    return erro("whatsapp");
  }

  // Turmas com categoria: estudante (penúltimo ou último ano, com matrícula)
  // ou profissional (com CREFITO). O registro fica no pedido para conferência.
  let categoria: turmaModel.Categoria | undefined;
  let registro: string | undefined;
  if (turma.exigeRegistro) {
    if (!form) return erro("registro");
    const r = lerRegistro(field);
    if (!r) return erro("registro");
    if (field("autorizo") !== "sim") return erro("autorizo");
    categoria = r.categoria;
    registro = r.registro;
  }
  const valorCents = turmaModel.valorDoLote(lote, categoria);

  const cupomCode = field("cupom");
  const cupom = cupomCode
    ? turmaModel.aplicarCupom(turma, { ...lote, valorCents }, cupomCode)
    : null;
  if (cupomCode && !cupom) {
    return erro("cupom");
  }
  const amountCents = cupom?.valorCents ?? valorCents;
  const sinal = !!cupom?.balanceDueAt;
  const description = `${turma.nome} · ${lote.nome}${
    categoria ? ` · ${categoria === "estudante" ? "estudante" : "profissional"}` : ""
  }${sinal ? " · 50% (sinal)" : cupom ? ` · cupom ${cupom.code}` : ""}`;

  const order = await orderModel.create({
    amountCents,
    description,
    context: `turma:${slug}`,
    coupon: cupom?.code,
    fullAmountCents: sinal ? valorCents : undefined,
    balanceDueAt: cupom?.balanceDueAt,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    registro,
  });

  try {
    const link = await paymentModel.create({
      orderId: order.id,
      amountCents,
      description,
      customer,
    });
    await orderModel.attachProviderSlug(order.id, link.providerSlug);
    await notify.orderEvent("clicked", order);
    return NextResponse.redirect(link.url, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    console.error("[turmas/comprar] payment.create failed", message);
    return NextResponse.json(
      { error: "provider_error", message },
      { status: 502 },
    );
  }
}

const ANOS: Record<string, string> = {
  penultimo: "penúltimo ano",
  ultimo: "último ano",
};

function lerRegistro(
  field: (k: string) => string | undefined,
): { categoria: turmaModel.Categoria; registro: string } | null {
  const categoria = field("categoria");
  if (categoria === "estudante") {
    const instituicao = field("instituicao");
    const ano = ANOS[field("ano") ?? ""];
    const matricula = field("matricula");
    if (!instituicao || !ano || !matricula || !/\d/.test(matricula)) return null;
    return {
      categoria,
      registro: `Estudante · ${instituicao} · ${ano} · matrícula ${matricula}`,
    };
  }
  if (categoria === "profissional") {
    const crefito = field("crefito");
    // CREFITO tem região e número (ex.: 3/321383-F); aceita formatos variados com ao menos 4 dígitos.
    if (!crefito || (crefito.match(/\d/g) ?? []).length < 4) return null;
    return { categoria, registro: `Profissional · CREFITO ${crefito}` };
  }
  return null;
}
