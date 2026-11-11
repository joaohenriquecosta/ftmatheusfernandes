// Gera os certificados do Curso de Dry Needling a partir de dry-needling.csv
//
//   node scripts/certificados/gerar.mjs
//
// CSV (sem vírgulas dentro dos campos): codigo,nome,crefito,emissao
//   codigo  — deixe vazio que o script sorteia um (DN26-XXXXX) e grava de volta no CSV
//   crefito — opcional (ex.: 3/123456-F)
//   emissao — data ISO (padrão 2026-11-15)
//
// Saída:
//   public/certificados/dry-needling/<codigo>/certificado.pdf  (A4 digital frente+verso, LinkedIn)
//   public/certificados/dry-needling/<codigo>/verso.png / verso.jpg (conteúdo programático)
//   public/certificados/dry-needling/<codigo>/certificado.png  (3508×2480, 300 dpi)
//   public/certificados/dry-needling/<codigo>/og.jpg           (1200 px, prévia de link)
//   app/certificados/dry-needling/dados.ts                     (lista usada pelas páginas)
//   ~/dry-needling-out/certificados/<codigo>-<nome>.pdf        (impressão frente+verso — NÃO vai pro site)
//
// Requisitos: Playwright + Chromium (usa os do ~/dev/hubos-verifica por padrão; sobrescreva com PLAYWRIGHT/CHROME).
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { randomInt } from "node:crypto";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const SITE = "https://ftmatheusfernandes.com.br";
const BASE_PATH = "/certificados/dry-needling";
const CSV = join(HERE, "dry-needling.csv");
const IMPRESSAO = join(homedir(), "dry-needling-out/certificados");

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT ?? join(homedir(), "dev/hubos-verifica/node_modules/playwright"));
const CHROME = process.env.CHROME ?? join(homedir(), ".cache/ms-playwright/chromium-1243/chrome-linux64/chrome");

// ---------- CSV ----------
// Cabeçalho fixo: só estas 4 colunas vão para o repo (público). E-mail/telefone ficam no Forms.
const COLUNAS = ["codigo", "nome", "crefito", "emissao"];
const linhas = readFileSync(CSV, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/);
const cab = linhas[0].split(",").map((s) => s.trim());
if (cab.join(",") !== COLUNAS.join(","))
  throw new Error(`cabeçalho do CSV deve ser exatamente "${COLUNAS.join(",")}" (separador vírgula), veio "${linhas[0]}"`);
const alunos = linhas
  .slice(1)
  .filter((l) => l.trim())
  .map((l, n) => {
    const v = l.split(",");
    if (v.length !== COLUNAS.length) throw new Error(`linha ${n + 2} tem ${v.length} campos (esperado ${COLUNAS.length}): ${l}`);
    return Object.fromEntries(v.map((x, i) => [COLUNAS[i], x.trim()]));
  });

const ALFA = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford: sem I, L, O, U
for (const a of alunos) {
  a.codigo = a.codigo.toUpperCase();
  if (a.codigo && !/^[A-Z0-9-]+$/.test(a.codigo)) throw new Error(`código inválido: ${a.codigo}`);
}
const usados = new Set();
for (const a of alunos) if (a.codigo) {
  if (usados.has(a.codigo)) throw new Error(`código repetido: ${a.codigo}`);
  usados.add(a.codigo);
}
for (const a of alunos) {
  if (!a.nome) throw new Error("linha sem nome no CSV");
  if (!a.codigo) {
    do a.codigo = "DN26-" + Array.from({ length: 5 }, () => ALFA[randomInt(ALFA.length)]).join("");
    while (usados.has(a.codigo));
    usados.add(a.codigo);
  }
  a.emissao ||= "2026-11-15";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.emissao)) throw new Error(`emissao inválida: ${a.emissao}`);
  a.crefito = (a.crefito || "").replace(/^crefito\s*/i, "");
}
writeFileSync(CSV, [COLUNAS.join(","), ...alunos.map((a) => COLUNAS.map((c) => a[c] ?? "").join(","))].join("\n") + "\n");

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const porExtenso = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
};
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---------- render ----------
const template = pathToFileURL(join(HERE, "certificado.html")).href;
mkdirSync(IMPRESSAO, { recursive: true });
const b = await chromium.launch({ executablePath: CHROME });
// A4 paisagem a 96 dpi ≈ 1123×794 px; ×3.125 → 3508×2480 (300 dpi)
const p = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 3.125 });
const og = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 1200 / 1123 });
for (const pg of [p, og]) await pg.emulateMedia({ media: "print" });

for (const a of alunos) {
  const pasta = a.codigo.toLowerCase();
  const dir = join(ROOT, "public", BASE_PATH, pasta);
  mkdirSync(dir, { recursive: true });
  const qs = new URLSearchParams({
    nome: a.nome,
    id: a.codigo,
    crefito: a.crefito,
    emissao: porExtenso(a.emissao),
    url: `${SITE}${BASE_PATH}/${pasta}`,
  });
  const abre = async (pg, modo, verso) => {
    await pg.goto(`${template}?${qs}&modo=${modo}&verso=${verso}`, { waitUntil: "networkidle" });
    await pg.waitForSelector("body[data-pronto='1']");
    if (!(await pg.evaluate(() => !!document.querySelector("#qr svg"))))
      throw new Error("QR code não foi gerado (CDN do qrcode-generator fora?) — abortando");
  };

  await abre(p, "digital", "1");
  await p.pdf({ path: join(dir, "certificado.pdf"), preferCSSPageSize: true, printBackground: true });
  await p.locator("section.frente").screenshot({ path: join(dir, "certificado.png") });
  await p.locator("section.verso").screenshot({ path: join(dir, "verso.png") });
  await abre(og, "digital", "1");
  await og.locator("section.verso").screenshot({ path: join(dir, "verso.jpg"), type: "jpeg", quality: 85 });
  await abre(og, "digital", "0");
  await og.locator("section.frente").screenshot({ path: join(dir, "og.jpg"), type: "jpeg", quality: 85 });
  await abre(p, "print", "1");
  await p.pdf({ path: join(IMPRESSAO, `${a.codigo}-${slug(a.nome)}.pdf`), preferCSSPageSize: true, printBackground: true });
  console.log("ok", a.codigo, a.nome);
}
await b.close();

// ---------- dados.ts ----------
const dados = alunos.map((a) => ({ codigo: a.codigo, nome: a.nome, crefito: a.crefito || null, emissao: a.emissao }));
writeFileSync(
  join(ROOT, "app/certificados/dry-needling/dados.ts"),
  `// GERADO por scripts/certificados/gerar.mjs a partir de dry-needling.csv — não editar à mão.\n` +
    `export type Certificado = { codigo: string; nome: string; crefito: string | null; emissao: string };\n\n` +
    `export const CERTIFICADOS: Certificado[] = ${JSON.stringify(dados, null, 2)};\n`
);
console.log(`${alunos.length} certificado(s) → public${BASE_PATH}/ · impressão em ${IMPRESSAO}`);
