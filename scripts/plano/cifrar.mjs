// Cifra o plano de lançamento (HTML) para app/joelho/plano/conteudo.ts.
// Uso: node scripts/plano/cifrar.mjs <plano.html> [chave]
// Chave: JOELHO_PLANO_KEY (base64 de 32 bytes), ou o arquivo ~/.config/ftmatheusfernandes/joelho-plano.key.
// A mesma chave precisa estar na env JOELHO_PLANO_KEY da Vercel. O HTML em texto puro nunca entra no repo.
import { createCipheriv, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const [entrada] = process.argv.slice(2);
if (!entrada) {
  console.error("uso: node scripts/plano/cifrar.mjs <plano.html>");
  process.exit(1);
}
const chave = Buffer.from(
  (process.env.JOELHO_PLANO_KEY ?? readFileSync(join(homedir(), ".config/ftmatheusfernandes/joelho-plano.key"), "utf8")).trim(),
  "base64",
);
if (chave.length !== 32) throw new Error("chave precisa ter 32 bytes");
const iv = randomBytes(12);
const c = createCipheriv("aes-256-gcm", chave, iv);
const dados = Buffer.concat([c.update(readFileSync(entrada)), c.final()]);
const b64 = Buffer.concat([iv, c.getAuthTag(), dados]).toString("base64");
const destino = new URL("../../app/joelho/plano/conteudo.ts", import.meta.url);
writeFileSync(
  destino,
  `// Gerado por scripts/plano/cifrar.mjs. Não editar à mão.\nexport const PLANO_CIFRADO =\n  "${b64}";\n`,
);
console.log(`ok: ${dados.length} bytes cifrados →`, destino.pathname);
