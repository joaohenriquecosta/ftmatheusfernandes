// @ts-nocheck -- run: node --experimental-strip-types scripts/cupom.check.ts
import assert from "node:assert";
import * as t from "../models/turma.ts";
const turma = t.get("dry-needling")!, lote = turma.lotes[0];
const c = t.aplicarCupom(turma, lote, " metade ", new Date("2026-10-31T23:00:00-03:00"))!;
assert.equal(c.valorCents, 25000); assert.equal(c.balanceDueAt, "2026-11-14T08:00:00-03:00");
assert.equal(t.aplicarCupom(turma, lote, "METADE", new Date("2026-11-01T00:00:01-03:00")), null);
assert.equal(t.aplicarCupom(turma, lote, "OUTRO"), null);
console.log("ok");
const o = await import("../models/order.ts");
const ord = await o.create({ amountCents: 25000, description: "x", fullAmountCents: 50000 });
assert.equal(o.balanceCents(ord), 0);
await o.markPaid(ord.id, { transactionId: "t", paidAmountCents: 27000 }); // c/ juros
assert.equal(o.balanceCents((await o.get(ord.id))!), 25000);
console.log("ok saldo");
