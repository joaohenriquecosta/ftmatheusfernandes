import type {
  PaymentReference,
  PaymentRequest,
  PaymentStatus,
} from "@/models/payment";

type Config = {
  handle: string;
  apiUrl: string;
  baseUrl: string;
};

function resolveBaseUrl(): string {
  // Em ordem de prioridade:
  // 1. Variável explícita (sempre vence — usada em dev e overrides)
  // 2. Domínio de produção do Vercel (custom domain, ex.: ftmatheusfernandes.com.br)
  // 3. URL do deploy atual no Vercel (preview deploys, etc.)
  // 4. Fallback fixo pro domínio de produção
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://ftmatheusfernandes.com.br";
}

function loadConfig(): Config {
  const handle = process.env.INFINITEPAY_HANDLE;
  const apiUrl =
    process.env.INFINITEPAY_API_URL ?? "https://api.checkout.infinitepay.io";
  const baseUrl = resolveBaseUrl();

  if (!handle) {
    throw new Error("INFINITEPAY_HANDLE is not set");
  }
  return { handle, apiUrl, baseUrl };
}

type LinkRequestBody = {
  handle: string;
  items: Array<{ quantity: number; price: number; description: string }>;
  order_nsu?: string;
  redirect_url?: string;
  webhook_url?: string;
  customer?: { name?: string; email?: string; phone_number?: string };
};

type LinkResponse = {
  url?: string;
  payment_url?: string;
  invoice_slug?: string;
  slug?: string;
  [key: string]: unknown;
};

export async function createLink(
  req: PaymentRequest,
): Promise<{ url: string; slug?: string }> {
  const cfg = loadConfig();

  const body: LinkRequestBody = {
    handle: cfg.handle,
    items: [
      {
        quantity: 1,
        price: req.amountCents,
        description: req.description,
      },
    ],
    order_nsu: req.orderId,
    redirect_url: `${cfg.baseUrl}/inscricao/${req.orderId}/sucesso`,
    webhook_url: `${cfg.baseUrl}/api/webhooks/infinitepay`,
  };

  if (req.customer) {
    body.customer = {
      name: req.customer.name,
      email: req.customer.email,
      phone_number: req.customer.phone,
    };
  }

  const res = await fetch(`${cfg.apiUrl}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(
      `InfinitePay /links failed (${res.status}): ${raw.slice(0, 500)}`,
    );
  }

  let parsed: LinkResponse;
  try {
    parsed = JSON.parse(raw) as LinkResponse;
  } catch {
    throw new Error(`InfinitePay /links returned non-JSON: ${raw.slice(0, 200)}`);
  }

  const url = parsed.url ?? parsed.payment_url;
  if (!url) {
    throw new Error(
      `InfinitePay /links response had no checkout url. Body: ${raw.slice(0, 300)}`,
    );
  }
  return { url, slug: parsed.invoice_slug ?? parsed.slug };
}

type PaymentCheckResponse = {
  success: boolean;
  paid: boolean;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: string;
};

export async function checkPayment(ref: PaymentReference): Promise<PaymentStatus> {
  const cfg = loadConfig();

  const res = await fetch(`${cfg.apiUrl}/payment_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: cfg.handle,
      order_nsu: ref.orderId,
      transaction_nsu: ref.transactionId,
      slug: ref.slug,
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(
      `InfinitePay /payment_check failed (${res.status}): ${raw.slice(0, 500)}`,
    );
  }

  const data = JSON.parse(raw) as PaymentCheckResponse;
  return {
    paid: data.paid === true && data.success === true,
    amountCents: data.amount,
    paidAmountCents: data.paid_amount,
    method: data.capture_method,
    installments: data.installments,
  };
}

export type WebhookPayload = {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: string;
  transaction_nsu: string;
  order_nsu: string;
  receipt_url: string;
  items?: unknown[];
};

export function parseWebhook(payload: unknown): WebhookPayload | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (
    typeof p.invoice_slug !== "string" ||
    typeof p.transaction_nsu !== "string" ||
    typeof p.order_nsu !== "string"
  ) {
    return null;
  }
  return p as unknown as WebhookPayload;
}
