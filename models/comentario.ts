import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

// Comentários do plano de lançamento (/joelho/plano), um fio por seção.
export type Comentario = {
  id: string;
  pagina: string;
  secao: string;
  autor: string;
  texto: string;
  resolvido: boolean;
  createdAt: string;
};

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

const g = globalThis as unknown as {
  __ftmf_coment?: Map<string, Comentario>;
  __ftmf_coment_schema?: Promise<unknown>;
};
const mem = (g.__ftmf_coment ??= new Map<string, Comentario>());

function ensureSchema(): Promise<unknown> {
  if (!sql) return Promise.resolve();
  g.__ftmf_coment_schema ??= sql`
    CREATE TABLE IF NOT EXISTS comentarios (
      id text PRIMARY KEY,
      pagina text NOT NULL,
      secao text NOT NULL,
      autor text NOT NULL,
      texto text NOT NULL,
      resolvido boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  return g.__ftmf_coment_schema;
}

type Row = Record<string, unknown>;
const fromRow = (r: Row): Comentario => ({
  id: String(r.id),
  pagina: String(r.pagina),
  secao: String(r.secao),
  autor: String(r.autor),
  texto: String(r.texto),
  resolvido: r.resolvido === true,
  createdAt: new Date(r.created_at as string).toISOString(),
});

export async function list(pagina: string): Promise<Comentario[]> {
  if (!sql) return [...mem.values()].filter((c) => c.pagina === pagina);
  await ensureSchema();
  const rows = (await sql`SELECT * FROM comentarios WHERE pagina = ${pagina} ORDER BY created_at ASC`) as Row[];
  return rows.map(fromRow);
}

export async function add(
  input: Pick<Comentario, "pagina" | "secao" | "autor" | "texto">,
): Promise<Comentario> {
  const c: Comentario = { ...input, id: randomUUID(), resolvido: false, createdAt: new Date().toISOString() };
  if (!sql) {
    mem.set(c.id, c);
    return c;
  }
  await ensureSchema();
  await sql`INSERT INTO comentarios (id, pagina, secao, autor, texto, resolvido, created_at)
    VALUES (${c.id}, ${c.pagina}, ${c.secao}, ${c.autor}, ${c.texto}, false, ${c.createdAt})`;
  return c;
}

export async function setResolvido(id: string, pagina: string, resolvido: boolean): Promise<boolean> {
  if (!sql) {
    const c = mem.get(id);
    if (!c || c.pagina !== pagina) return false;
    c.resolvido = resolvido;
    return true;
  }
  await ensureSchema();
  const rows = (await sql`UPDATE comentarios SET resolvido = ${resolvido} WHERE id = ${id} AND pagina = ${pagina} RETURNING id`) as Row[];
  return rows.length > 0;
}
