import { NextResponse, type NextRequest } from "next/server";

import * as orderModel from "@/models/order";
import * as paymentModel from "@/models/payment";

// Link do e-mail "pagar o restante". O id do pedido (UUID) é o token: só quem
// recebeu o e-mail tem. Gera um pedido-filho com o saldo e manda pra InfinitePay.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parent = await orderModel.get(id);
  if (!parent || parent.parentId) {
    return NextResponse.json({ error: "order_not_found" }, { status: 404 });
  }

  const saldo = orderModel.balanceCents(parent);
  if (!saldo) {
    return NextResponse.redirect(new URL(`/inscricao/${id}/sucesso`, req.url), 303);
  }

  const description = `${parent.description.replace(" · 50% (sinal)", "")} · restante`;
  const child = await orderModel.create({
    amountCents: saldo,
    description,
    context: parent.context,
    customerName: parent.customerName,
    customerEmail: parent.customerEmail,
    customerPhone: parent.customerPhone,
    parentId: parent.id,
  });

  try {
    const link = await paymentModel.create({
      orderId: child.id,
      amountCents: saldo,
      description,
      customer: {
        name: parent.customerName,
        email: parent.customerEmail,
        phone: parent.customerPhone,
      },
    });
    await orderModel.attachProviderSlug(child.id, link.providerSlug);
    return NextResponse.redirect(link.url, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    console.error("[pedidos/saldo] payment.create failed", message);
    return NextResponse.json({ error: "provider_error", message }, { status: 502 });
  }
}
