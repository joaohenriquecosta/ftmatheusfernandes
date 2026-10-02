import { NextResponse, type NextRequest } from "next/server";

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

  const description = `${turma.nome} · ${lote.nome}`;

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
    phone: field("whatsapp")?.replace(/\D/g, ""),
  };
  if (form && (!customer.name || !customer.email || !customer.phone)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const order = await orderModel.create({
    amountCents: lote.valorCents,
    description,
    context: `turma:${slug}`,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
  });

  try {
    const link = await paymentModel.create({
      orderId: order.id,
      amountCents: lote.valorCents,
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
