import * as infinitepay from "@/models/infinitepay";

export type PaymentCustomer = {
  name?: string;
  email?: string;
  phone?: string;
};

export type PaymentRequest = {
  orderId: string;
  amountCents: number;
  description: string;
  customer?: PaymentCustomer;
};

export type PaymentLink = {
  url: string;
  provider: "infinitepay";
  providerSlug?: string;
};

export type PaymentStatus = {
  paid: boolean;
  amountCents: number;
  paidAmountCents: number;
  method?: "credit_card" | "pix" | string;
  installments?: number;
};

export type PaymentReference = {
  orderId: string;
  transactionId: string;
  slug: string;
};

export async function create(request: PaymentRequest): Promise<PaymentLink> {
  const link = await infinitepay.createLink(request);
  return { url: link.url, provider: "infinitepay", providerSlug: link.slug };
}

export async function verify(ref: PaymentReference): Promise<PaymentStatus> {
  return infinitepay.checkPayment(ref);
}
