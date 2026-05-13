import { NextResponse, type NextRequest } from "next/server";

import * as infinitepay from "@/models/infinitepay";
import * as order from "@/models/order";
import * as payment from "@/models/payment";

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return new NextResponse("invalid json", { status: 400 });
  }

  const webhook = infinitepay.parseWebhook(raw);
  if (!webhook) {
    console.warn("[webhook:infinitepay] unrecognized payload", raw);
    return new NextResponse("bad payload", { status: 400 });
  }

  const existing = order.get(webhook.order_nsu);
  if (!existing) {
    console.warn("[webhook:infinitepay] unknown order", webhook.order_nsu);
    return new NextResponse("ok", { status: 200 });
  }

  try {
    const status = await payment.verify({
      orderId: webhook.order_nsu,
      transactionId: webhook.transaction_nsu,
      slug: webhook.invoice_slug,
    });

    if (!status.paid) {
      console.warn("[webhook:infinitepay] verify says not paid", webhook.order_nsu);
      return new NextResponse("ok", { status: 200 });
    }

    order.markPaid(webhook.order_nsu, {
      transactionId: webhook.transaction_nsu,
      paidAmountCents: status.paidAmountCents,
      method: status.method,
      receiptUrl: webhook.receipt_url,
    });

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[webhook:infinitepay] verify failed", message);
    return new NextResponse("error", { status: 500 });
  }
}
