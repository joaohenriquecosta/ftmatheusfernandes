import Link from "next/link";
import { notFound } from "next/navigation";

import * as order from "@/models/order";
import * as payment from "@/models/payment";

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function pickFirst(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

type Search = Promise<{ [key: string]: string | string[] | undefined }>;

async function attemptVerifyFromQuery(orderId: string, search: Awaited<Search>) {
  const transactionId = pickFirst(search.transaction_nsu);
  const slug = pickFirst(search.slug);
  const receiptUrl = pickFirst(search.receipt_url);
  if (!transactionId || !slug) return;

  const found = order.get(orderId);
  if (!found || found.status === "paid") return;

  try {
    const status = await payment.verify({ orderId, transactionId, slug });
    if (status.paid) {
      order.markPaid(orderId, {
        transactionId,
        paidAmountCents: status.paidAmountCents,
        method: status.method,
        receiptUrl,
      });
    }
  } catch (err) {
    console.error(
      "[sucesso] payment.verify failed",
      err instanceof Error ? err.message : err,
    );
  }
}

export default async function SucessoPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Search;
}) {
  const [{ orderId }, search] = await Promise.all([params, searchParams]);

  await attemptVerifyFromQuery(orderId, search);

  const found = order.get(orderId);
  if (!found) notFound();

  const paid = found.status === "paid";

  return (
    <main className="min-h-screen bg-[#FAF7F1] px-6 py-16 text-[#1A1F1B] md:px-12 md:py-24">
      <div className="mx-auto max-w-[560px]">
        <div className="mb-3 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-[#E89B3C] uppercase">
          <span className="h-px w-8 bg-[#E89B3C]" />
          <span>
            {paid ? "Pagamento confirmado" : "Pagamento em processamento"}
          </span>
        </div>

        <h1
          className="mb-8 text-[clamp(32px,5vw,48px)] leading-[1.05] tracking-[-0.02em] text-[#1F4A33]"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          {paid ? (
            <>
              Recebemos seu pagamento.{" "}
              <em className="font-light text-[#E89B3C] italic">Obrigado.</em>
            </>
          ) : (
            <>
              Aguardando a confirmação do{" "}
              <em className="font-light text-[#E89B3C] italic">pagamento.</em>
            </>
          )}
        </h1>

        <div className="space-y-4 border-y border-[#1F4A33]/15 py-6 text-[14px]">
          <Row label="Descrição" value={found.description} />
          <Row label="Valor" value={formatCents(found.amountCents)} />
          {found.paidAmountCents != null && (
            <Row label="Pago" value={formatCents(found.paidAmountCents)} />
          )}
          {found.paymentMethod && (
            <Row label="Método" value={prettyMethod(found.paymentMethod)} />
          )}
          <Row label="Pedido" value={found.id} mono />
        </div>

        {!paid && (
          <p className="mt-6 text-[14px] leading-[1.6] text-[#4A524C]">
            Se você acabou de pagar via PIX, a confirmação chega em segundos.
            Atualize a página em instantes.
          </p>
        )}

        {found.receiptUrl && (
          <a
            href={found.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase transition-colors hover:text-[#E89B3C]"
          >
            Ver comprovante →
          </a>
        )}

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-[#1F4A33] uppercase transition-colors hover:text-[#E89B3C]"
          >
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </main>
  );
}

function prettyMethod(m: string): string {
  if (m === "credit_card") return "Cartão de crédito";
  if (m === "pix") return "PIX";
  return m;
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[10px] font-semibold tracking-[0.22em] text-[#4A524C]/80 uppercase">
        {label}
      </span>
      <span
        className={`text-right text-[14px] text-[#1F4A33] ${mono ? "font-mono text-[12px]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
