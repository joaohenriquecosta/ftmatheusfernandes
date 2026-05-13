import { NextResponse, type NextRequest } from "next/server";

import * as order from "@/models/order";
import * as payment from "@/models/payment";

type Body = {
  amountCents?: number;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  context?: string;
};

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const amountCents = Number(body.amountCents);
  const description = (body.description ?? "").trim();

  if (!Number.isFinite(amountCents) || amountCents < 100) {
    return NextResponse.json(
      { error: "amount_too_low", message: "Mínimo R$ 1,00." },
      { status: 400 },
    );
  }
  if (!description) {
    return NextResponse.json(
      { error: "missing_description" },
      { status: 400 },
    );
  }

  const created = order.create({
    amountCents,
    description,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    context: body.context,
  });

  try {
    const link = await payment.create({
      orderId: created.id,
      amountCents,
      description,
      customer: {
        name: body.customerName,
        email: body.customerEmail,
        phone: body.customerPhone,
      },
    });
    order.attachProviderSlug(created.id, link.providerSlug);
    return NextResponse.json({
      orderId: created.id,
      checkoutUrl: link.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    console.error("[checkout:create] failed", message);
    return NextResponse.json(
      { error: "provider_error", message },
      { status: 502 },
    );
  }
}
