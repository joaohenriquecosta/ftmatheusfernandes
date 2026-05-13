import { NextResponse, type NextRequest } from "next/server";

import * as orderModel from "@/models/order";
import * as paymentModel from "@/models/payment";
import * as turmaModel from "@/models/turma";

export async function POST(
  _req: NextRequest,
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

  const order = orderModel.create({
    amountCents: lote.valorCents,
    description,
    context: `turma:${slug}`,
  });

  try {
    const link = await paymentModel.create({
      orderId: order.id,
      amountCents: lote.valorCents,
      description,
    });
    orderModel.attachProviderSlug(order.id, link.providerSlug);
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
