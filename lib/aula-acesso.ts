// Acesso à gravação da aula de sábado (Dry Needling), protegida por senha até 23/11/2026.
// A senha fica em AULA_PASSWORD (env da Vercel, só produção); o repo é público.

export const AULA_COOKIE = "aula_dn";
export const AULA_PATH = "/turmas/dry-needling/aula";
export const AULA_EXPIRA_MS = 1795489199000; // 23/11/2026 23:59:59 (-03)

async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Valor do cookie de acesso; null se a senha não estiver configurada (fecha tudo). */
export async function aulaToken(): Promise<string | null> {
  const senha = process.env.AULA_PASSWORD?.trim();
  if (!senha) return null;
  return sha256Hex(`aula:${senha}:${process.env.AULA_ORIGIN_PREFIX?.trim() ?? ""}`);
}

export function iguais(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
