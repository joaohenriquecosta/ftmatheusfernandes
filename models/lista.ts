import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

// Lista de espera do pré-lançamento (antes de abrir as vendas de uma turma).
// Mesmo padrão do models/order.ts: Neon quando DATABASE_URL existe, Map em memória no dev.
export type Perfil = "estudante" | "profissional";

export type Interessado = {
  id: string;
  turma: string;
  nome: string;
  email: string;
  whatsapp: string;
  perfil: Perfil;
  origem?: string;
  createdAt: string;
};

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

const g = globalThis as unknown as {
  __ftmf_lista?: Map<string, Interessado>;
  __ftmf_lista_schema?: Promise<unknown>;
};
const mem = (g.__ftmf_lista ??= new Map<string, Interessado>());

function ensureSchema(): Promise<unknown> {
  if (!sql) return Promise.resolve();
  g.__ftmf_lista_schema ??= sql`
    CREATE TABLE IF NOT EXISTS lista_espera (
      id text PRIMARY KEY,
      turma text NOT NULL,
      nome text NOT NULL,
      email text NOT NULL,
      whatsapp text NOT NULL,
      perfil text NOT NULL,
      origem text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  return g.__ftmf_lista_schema;
}

type Row = Record<string, unknown>;
const fromRow = (r: Row): Interessado => ({
  id: String(r.id),
  turma: String(r.turma),
  nome: String(r.nome),
  email: String(r.email),
  whatsapp: String(r.whatsapp),
  perfil: r.perfil as Perfil,
  origem: r.origem == null ? undefined : String(r.origem),
  createdAt: new Date(r.created_at as string).toISOString(),
});

export async function add(
  input: Omit<Interessado, "id" | "createdAt">,
): Promise<Interessado> {
  const item: Interessado = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  if (!sql) {
    mem.set(item.id, item);
    return item;
  }
  await ensureSchema();
  await sql`INSERT INTO lista_espera (id, turma, nome, email, whatsapp, perfil, origem, created_at)
    VALUES (${item.id}, ${item.turma}, ${item.nome}, ${item.email}, ${item.whatsapp}, ${item.perfil}, ${item.origem ?? null}, ${item.createdAt})`;
  return item;
}

export async function list(turma: string): Promise<Interessado[]> {
  if (!sql) return [...mem.values()].filter((x) => x.turma === turma).reverse();
  await ensureSchema();
  const rows = (await sql`SELECT * FROM lista_espera WHERE turma = ${turma} ORDER BY created_at DESC`) as Row[];
  return rows.map(fromRow);
}
