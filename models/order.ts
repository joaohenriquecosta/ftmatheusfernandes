import { randomUUID } from "node:crypto";

export type OrderStatus = "pending" | "paid" | "failed";

export type Order = {
  id: string;
  amountCents: number;
  description: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  context?: string;
  providerSlug?: string;
  providerTransactionId?: string;
  paidAmountCents?: number;
  paymentMethod?: string;
  receiptUrl?: string;
};

// Singleton across module re-evaluations (dev hot-reload, RSC ↔ Route Handler
// boundary). Will be replaced by real persistence; until then this keeps orders
// alive within a single Node process.
const globalForStore = globalThis as unknown as {
  __ftmf_order_store?: Map<string, Order>;
};
const store: Map<string, Order> =
  globalForStore.__ftmf_order_store ?? new Map<string, Order>();
globalForStore.__ftmf_order_store = store;

export type CreateOrderInput = {
  amountCents: number;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  context?: string;
};

export function create(input: CreateOrderInput): Order {
  const id = randomUUID();
  const order: Order = {
    id,
    amountCents: input.amountCents,
    description: input.description,
    status: "pending",
    createdAt: new Date().toISOString(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    context: input.context,
  };
  store.set(id, order);
  console.log("[order:create]", id, input.amountCents, input.description);
  return order;
}

export function get(id: string): Order | undefined {
  return store.get(id);
}

export function attachProviderSlug(id: string, slug: string | undefined): void {
  const order = store.get(id);
  if (!order) return;
  order.providerSlug = slug;
}

export type MarkPaidInput = {
  transactionId: string;
  paidAmountCents: number;
  method?: string;
  receiptUrl?: string;
};

export function markPaid(id: string, input: MarkPaidInput): Order | undefined {
  const order = store.get(id);
  if (!order) return undefined;
  order.status = "paid";
  order.paidAt = new Date().toISOString();
  order.providerTransactionId = input.transactionId;
  order.paidAmountCents = input.paidAmountCents;
  order.paymentMethod = input.method;
  order.receiptUrl = input.receiptUrl;
  console.log("[order:paid]", id, input.paidAmountCents, input.method);
  return order;
}
