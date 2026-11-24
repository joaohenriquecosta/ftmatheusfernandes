import { createDecipheriv } from "node:crypto";

// Plano de lançamento do curso de joelho: protegido por senha e guardado cifrado.
// O repo é público, então o conteúdo vai como AES-256-GCM em app/joelho/plano/conteudo.ts.
// A senha (JOELHO_PLANO_SENHA) e a chave (JOELHO_PLANO_KEY, base64 de 32 bytes) ficam só
// nas envs da Vercel. Para editar o plano: scripts/plano/cifrar.mjs.

export const PLANO_COOKIE = "plano_joelho";
export const PLANO_PATH = "/joelho/plano";
export const PLANO_MAX_AGE = 60 * 60 * 24 * 90; // 90 dias

async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Valor do cookie de acesso; null se senha ou chave não estiverem configuradas (fecha tudo). */
export async function planoToken(): Promise<string | null> {
  const senha = process.env.JOELHO_PLANO_SENHA?.trim();
  const chave = process.env.JOELHO_PLANO_KEY?.trim();
  if (!senha || !chave) return null;
  return sha256Hex(`plano:${senha}:${chave}`);
}

export function iguais(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function autorizado(cookie: string | undefined): Promise<boolean> {
  const token = await planoToken();
  return !!token && !!cookie && iguais(cookie, token);
}

/** Formato: base64(iv[12] | tag[16] | texto cifrado). */
export function decifrar(cifrado: string): string | null {
  const chave = process.env.JOELHO_PLANO_KEY?.trim();
  if (!chave) return null;
  try {
    const buf = Buffer.from(cifrado, "base64");
    const d = createDecipheriv("aes-256-gcm", Buffer.from(chave, "base64"), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString("utf8");
  } catch {
    return null;
  }
}
