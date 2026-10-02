import { Resend } from "resend";

import type { Order } from "@/models/order";
import * as order from "@/models/order";

// E-mail pro Matheus a cada evento (clique no checkout / pagamento confirmado)
// com a lista atualizada de inscritos da turma. Falha silenciosa: notificação
// nunca derruba o fluxo de pagamento.
const FROM = "Inscrições <inscricoes@ftmatheusfernandes.com.br>";
const TO = (process.env.NOTIFY_TO ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const brl = (c: number) =>
  (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dt = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export async function orderEvent(
  kind: "clicked" | "paid",
  o: Order,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || TO.length === 0 || !o.context) return;
  try {
    const all = await order.list(o.context);
    const paid = all.filter((x) => x.status === "paid");
    const total = paid.reduce((s, x) => s + (x.paidAmountCents ?? x.amountCents), 0);
    const curso = o.description.split(" · ")[0];

    const subject =
      kind === "paid"
        ? `✅ Pagamento confirmado: ${o.customerName ?? "—"} · ${curso} (${paid.length} pagos)`
        : `👀 Novo clique no checkout: ${o.customerName ?? "—"} · ${curso}`;

    await new Resend(key).emails.send({
      from: FROM,
      to: TO,
      subject,
      html: html(kind, o, all, paid.length, total, curso),
    });
  } catch (err) {
    console.error("[notify] failed", err instanceof Error ? err.message : err);
  }
}

function esc(s: string | undefined): string {
  return (s ?? "—").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
}

function html(
  kind: "clicked" | "paid",
  o: Order,
  all: Order[],
  paidCount: number,
  totalCents: number,
  curso: string,
): string {
  const rows = all
    .map(
      (x) => `<tr style="border-bottom:1px solid #e5e2da">
        <td style="padding:8px 10px;color:${x.status === "paid" ? "#15803d" : "#E89B3C"};font-weight:600">${x.status === "paid" ? "PAGO" : "clicou"}</td>
        <td style="padding:8px 10px">${esc(x.customerName)}</td>
        <td style="padding:8px 10px">${esc(x.customerEmail)}</td>
        <td style="padding:8px 10px;white-space:nowrap">${esc(x.customerPhone)}</td>
        <td style="padding:8px 10px;white-space:nowrap">${esc(x.paymentMethod)}</td>
        <td style="padding:8px 10px;white-space:nowrap">${dt(x.paidAt ?? x.createdAt)}</td>
      </tr>`,
    )
    .join("");

  const headline =
    kind === "paid"
      ? `<strong style="color:#15803d">${esc(o.customerName)}</strong> pagou ${brl(o.paidAmountCents ?? o.amountCents)}${o.paymentMethod ? ` via ${esc(o.paymentMethod)}` : ""}.`
      : `<strong>${esc(o.customerName)}</strong> preencheu a inscrição e foi pro checkout (${brl(o.amountCents)}). Ainda não pagou.`;

  return `<div style="font-family:Inter,Arial,sans-serif;color:#1A1F1B;max-width:720px;margin:0 auto;padding:24px">
    <div style="border-top:3px solid #1F4A33;padding-top:16px">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#E89B3C;font-weight:600">${esc(curso)}</div>
      <p style="font-size:17px;line-height:1.5;margin:12px 0 20px">${headline}</p>
      <div style="display:flex;gap:24px;font-size:13px;color:#4A524C;margin-bottom:20px">
        <div><div style="font-size:26px;color:#1F4A33;font-family:Georgia,serif">${paidCount}</div>pagos</div>
        <div><div style="font-size:26px;color:#1F4A33;font-family:Georgia,serif">${all.length}</div>cliques</div>
        <div><div style="font-size:26px;color:#1F4A33;font-family:Georgia,serif">${brl(totalCents)}</div>recebido</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="text-align:left;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#4A524C;border-bottom:2px solid #1F4A33">
          <th style="padding:8px 10px">Status</th><th style="padding:8px 10px">Nome</th><th style="padding:8px 10px">E-mail</th><th style="padding:8px 10px">WhatsApp</th><th style="padding:8px 10px">Método</th><th style="padding:8px 10px">Quando</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:11px;color:#4A524C;margin-top:24px">Lista completa sempre em <a href="https://ftmatheusfernandes.com.br/admin/inscricoes" style="color:#1F4A33">ftmatheusfernandes.com.br/admin/inscricoes</a> (link com token). Pedido ${o.id}.</p>
    </div>
  </div>`;
}
