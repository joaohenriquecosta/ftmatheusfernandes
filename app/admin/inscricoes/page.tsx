import type { Metadata } from "next";
import { timingSafeEqual } from "node:crypto";
import { notFound } from "next/navigation";

import * as order from "@/models/order";

export const metadata: Metadata = {
  title: "Inscrições",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

function authorized(token: string | undefined): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function InscricoesPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; turma?: string }>;
}) {
  const { token, turma } = await searchParams;
  if (!authorized(token)) notFound();

  const rows = await order.list(turma ? `turma:${turma}` : undefined);
  const paid = rows.filter((o) => o.status === "paid");
  const brl = (c: number) =>
    (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const dt = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "—";

  return (
    <main className="min-h-screen bg-[#FAF7F1] px-6 py-12 font-mono text-[12px] text-[#1A1F1B]">
      <h1 className="mb-1 text-[20px] text-[#1F4A33]">
        Inscrições {turma ? `· ${turma}` : ""}
      </h1>
      <p className="mb-8 text-[#4A524C]">
        {rows.length} cliques · {paid.length} pagos ·{" "}
        {brl(paid.reduce((s, o) => s + (o.paidAmountCents ?? 0), 0))}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#1F4A33]/30 text-[10px] tracking-[0.2em] text-[#4A524C] uppercase">
              {["Criado", "Status", "Nome", "E-mail", "WhatsApp", "Valor", "Método", "Pago em", "Curso", "Pedido"].map((h) => (
                <th key={h} className="py-2 pr-4 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-[#1F4A33]/10 align-top">
                <td className="py-2 pr-4 whitespace-nowrap">{dt(o.createdAt)}</td>
                <td className={`py-2 pr-4 font-semibold ${o.status === "paid" ? "text-green-700" : "text-[#E89B3C]"}`}>
                  {o.status}
                </td>
                <td className="py-2 pr-4">{o.customerName ?? "—"}</td>
                <td className="py-2 pr-4">{o.customerEmail ?? "—"}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{o.customerPhone ?? "—"}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{brl(o.paidAmountCents ?? o.amountCents)}</td>
                <td className="py-2 pr-4">{o.paymentMethod ?? "—"}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{dt(o.paidAt)}</td>
                <td className="py-2 pr-4">{o.context ?? "—"}</td>
                <td className="py-2 pr-4 text-[10px] text-[#4A524C]">{o.id.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
