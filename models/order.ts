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
  /** Cupom aplicado (ex.: METADE). */
  coupon?: string;
  /** Preço cheio do curso. Se > amountCents, o pedido é um sinal e falta saldo. */
  fullAmountCents?: number;
  /** Prazo para quitar o saldo (início do curso). */
  balanceDueAt?: string;
  /** Quando o saldo foi quitado (pedido-filho pago). */
  balancePaidAt?: string;
  /** Pedido-filho de saldo: aponta pro pedido do sinal. */
  parentId?: string;
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
    )`.then(
    () => sql`ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS coupon text,
      ADD COLUMN IF NOT EXISTS full_amount_cents integer,
      ADD COLUMN IF NOT EXISTS balance_due_at timestamptz,
      ADD COLUMN IF NOT EXISTS balance_paid_at timestamptz,
      ADD COLUMN IF NOT EXISTS parent_id text`,
  );
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
    coupon: s(r.coupon),
    fullAmountCents:
      r.full_amount_cents == null ? undefined : Number(r.full_amount_cents),
    balanceDueAt: d(r.balance_due_at),
    balancePaidAt: d(r.balance_paid_at),
    parentId: s(r.parent_id),
  };
}

export type CreateOrderInput = {
  amountCents: number;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  context?: string;
  coupon?: string;
  fullAmountCents?: number;
  balanceDueAt?: string;
  parentId?: string;
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
    coupon: input.coupon,
    fullAmountCents: input.fullAmountCents,
    balanceDueAt: input.balanceDueAt,
    parentId: input.parentId,
  };
  if (sql) {
    await ensureSchema();
    await sql`INSERT INTO orders (id, amount_cents, description, status, created_at, customer_name, customer_email, customer_phone, context, coupon, full_amount_cents, balance_due_at, parent_id)
      VALUES (${order.id}, ${order.amountCents}, ${order.description}, 'pending', ${order.createdAt}, ${order.customerName ?? null}, ${order.customerEmail ?? null}, ${order.customerPhone ?? null}, ${order.context ?? null}, ${order.coupon ?? null}, ${order.fullAmountCents ?? null}, ${order.balanceDueAt ?? null}, ${order.parentId ?? null})`;
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

/** Saldo devedor em centavos (0 = quitado / sem sinal). */
export function balanceCents(o: Order): number {
  // Só quem pagou o sinal deve saldo. amountCents (não paidAmountCents, que inclui juros).
  if (!o.fullAmountCents || o.status !== "paid" || o.balancePaidAt) return 0;
  return Math.max(0, o.fullAmountCents - o.amountCents);
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

/** Retorna o pedido só pra quem efetivamente o marcou como pago (evita e-mail duplicado). */
export async function markPaid(
  id: string,
  input: MarkPaidInput,
): Promise<Order | undefined> {
  const paidAt = new Date().toISOString();
  console.log("[order:paid]", id, input.paidAmountCents, input.method);
  if (!sql) {
    const o = mem.get(id);
    if (!o || o.status === "paid") return undefined;
    Object.assign(o, {
      status: "paid",
      paidAt,
      providerTransactionId: input.transactionId,
      paidAmountCents: input.paidAmountCents,
      paymentMethod: input.method,
      receiptUrl: input.receiptUrl,
    });
    const parent = o.parentId && mem.get(o.parentId);
    if (parent) parent.balancePaidAt = paidAt;
    return o;
  }
  const rows = (await sql`UPDATE orders SET status = 'paid', paid_at = ${paidAt},
      provider_transaction_id = ${input.transactionId}, paid_amount_cents = ${input.paidAmountCents},
      payment_method = ${input.method ?? null}, receipt_url = ${input.receiptUrl ?? null}
    WHERE id = ${id} AND status <> 'paid' RETURNING *`) as Row[];
  const o = rows[0] ? fromRow(rows[0]) : undefined;
  if (o?.parentId) {
    await sql`UPDATE orders SET balance_paid_at = ${paidAt} WHERE id = ${o.parentId}`;
  }
  return o;
}
