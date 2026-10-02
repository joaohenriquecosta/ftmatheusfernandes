import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

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

// Persistência: Neon Postgres quando DATABASE_URL existe; senão Map em memória
// (dev local sem banco). ponytail: tabela criada on-demand, sem migrations.
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

const globalForStore = globalThis as unknown as {
  __ftmf_order_store?: Map<string, Order>;
  __ftmf_order_schema?: Promise<unknown>;
};
const mem: Map<string, Order> =
  globalForStore.__ftmf_order_store ?? new Map<string, Order>();
globalForStore.__ftmf_order_store = mem;

function ensureSchema(): Promise<unknown> {
  if (!sql) return Promise.resolve();
  globalForStore.__ftmf_order_schema ??= sql`
    CREATE TABLE IF NOT EXISTS orders (
      id text PRIMARY KEY,
      amount_cents integer NOT NULL,
      description text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamptz NOT NULL DEFAULT now(),
      paid_at timestamptz,
      customer_name text,
      customer_email text,
      customer_phone text,
      context text,
      provider_slug text,
      provider_transaction_id text,
      paid_amount_cents integer,
      payment_method text,
      receipt_url text
    )`;
  return globalForStore.__ftmf_order_schema;
}

type Row = Record<string, unknown>;
function fromRow(r: Row): Order {
  const s = (v: unknown) => (v == null ? undefined : String(v));
  const d = (v: unknown) =>
    v == null ? undefined : new Date(v as string).toISOString();
  return {
    id: String(r.id),
    amountCents: Number(r.amount_cents),
    description: String(r.description),
    status: r.status as OrderStatus,
    createdAt: d(r.created_at)!,
    paidAt: d(r.paid_at),
    customerName: s(r.customer_name),
    customerEmail: s(r.customer_email),
    customerPhone: s(r.customer_phone),
    context: s(r.context),
    providerSlug: s(r.provider_slug),
    providerTransactionId: s(r.provider_transaction_id),
    paidAmountCents:
      r.paid_amount_cents == null ? undefined : Number(r.paid_amount_cents),
    paymentMethod: s(r.payment_method),
    receiptUrl: s(r.receipt_url),
  };
}

export type CreateOrderInput = {
  amountCents: number;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  context?: string;
};

export async function create(input: CreateOrderInput): Promise<Order> {
  const order: Order = {
    id: randomUUID(),
    amountCents: input.amountCents,
    description: input.description,
    status: "pending",
    createdAt: new Date().toISOString(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    context: input.context,
  };
  if (sql) {
    await ensureSchema();
    await sql`INSERT INTO orders (id, amount_cents, description, status, created_at, customer_name, customer_email, customer_phone, context)
      VALUES (${order.id}, ${order.amountCents}, ${order.description}, 'pending', ${order.createdAt}, ${order.customerName ?? null}, ${order.customerEmail ?? null}, ${order.customerPhone ?? null}, ${order.context ?? null})`;
  } else {
    mem.set(order.id, order);
  }
  console.log("[order:create]", order.id, input.amountCents, input.description);
  return order;
}

export async function get(id: string): Promise<Order | undefined> {
  if (!sql) return mem.get(id);
  await ensureSchema();
  const rows = (await sql`SELECT * FROM orders WHERE id = ${id}`) as Row[];
  return rows[0] ? fromRow(rows[0]) : undefined;
}

export async function list(context?: string): Promise<Order[]> {
  if (!sql) {
    return [...mem.values()].filter((o) => !context || o.context === context);
  }
  await ensureSchema();
  const rows = (context
    ? await sql`SELECT * FROM orders WHERE context = ${context} ORDER BY created_at DESC`
    : await sql`SELECT * FROM orders ORDER BY created_at DESC`) as Row[];
  return rows.map(fromRow);
}

export async function attachProviderSlug(
  id: string,
  slug: string | undefined,
): Promise<void> {
  if (!sql) {
    const o = mem.get(id);
    if (o) o.providerSlug = slug;
    return;
  }
  await sql`UPDATE orders SET provider_slug = ${slug ?? null} WHERE id = ${id}`;
}

export type MarkPaidInput = {
  transactionId: string;
  paidAmountCents: number;
  method?: string;
  receiptUrl?: string;
};

export async function markPaid(
  id: string,
  input: MarkPaidInput,
): Promise<Order | undefined> {
  const paidAt = new Date().toISOString();
  console.log("[order:paid]", id, input.paidAmountCents, input.method);
  if (!sql) {
    const o = mem.get(id);
    if (!o) return undefined;
    Object.assign(o, {
      status: "paid",
      paidAt,
      providerTransactionId: input.transactionId,
      paidAmountCents: input.paidAmountCents,
      paymentMethod: input.method,
      receiptUrl: input.receiptUrl,
    });
    return o;
  }
  const rows = (await sql`UPDATE orders SET status = 'paid', paid_at = ${paidAt},
      provider_transaction_id = ${input.transactionId}, paid_amount_cents = ${input.paidAmountCents},
      payment_method = ${input.method ?? null}, receipt_url = ${input.receiptUrl ?? null}
    WHERE id = ${id} RETURNING *`) as Row[];
  return rows[0] ? fromRow(rows[0]) : undefined;
}
