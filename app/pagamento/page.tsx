"use client";

import { useEffect, useRef, useState } from "react";

import { LockOutline } from "@/components/icons";

type ApiResponse =
  | { orderId: string; checkoutUrl: string }
  | { error: string; message?: string };

type Step =
  | { kind: "form" }
  | {
      kind: "link";
      orderId: string;
      checkoutUrl: string;
      amountCents: number;
      description: string;
    };

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatCentsPlain(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function qrCodeUrl(target: string, size = 320): string {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: target,
    margin: "0",
    color: "1F4A33",
    bgcolor: "FAF7F1",
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

const FRAUNCES = "var(--font-fraunces), Georgia, serif";

export default function PagamentoPage() {
  const [step, setStep] = useState<Step>({ kind: "form" });
  const [valorCents, setValorCents] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroDescricao, setErroDescricao] = useState<string | null>(null);
  const [erroValor, setErroValor] = useState<string | null>(null);
  const descricaoRef = useRef<HTMLInputElement>(null);
  const valorRef = useRef<HTMLInputElement>(null);

  // Limpa erros inline assim que o usuário corrige o campo.
  useEffect(() => {
    if (erroDescricao && descricao.trim()) setErroDescricao(null);
  }, [descricao, erroDescricao]);
  useEffect(() => {
    if (erroValor && valorCents >= 100) setErroValor(null);
  }, [valorCents, erroValor]);

  function onValorChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    const cents = digits === "" ? 0 : Number.parseInt(digits, 10);
    setValorCents(cents);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setErroDescricao(null);
    setErroValor(null);

    const valorInvalido = valorCents < 100;
    const description = descricao.trim();
    const descricaoInvalida = !description;

    if (valorInvalido) {
      setErroValor("Valor mínimo: R$ 1,00.");
    }
    if (descricaoInvalida) {
      setErroDescricao(
        "Preencha a descrição da cobrança antes de gerar o link.",
      );
    }
    if (valorInvalido || descricaoInvalida) {
      // Foca o primeiro campo inválido (valor tem prioridade na ordem visual).
      if (valorInvalido) {
        valorRef.current?.focus();
      } else {
        descricaoRef.current?.focus();
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: valorCents,
          description,
        }),
      });

      const data = (await res.json()) as ApiResponse;
      if (!res.ok || !("checkoutUrl" in data)) {
        const msg =
          "message" in data && data.message
            ? data.message
            : "error" in data
              ? data.error
              : "Erro desconhecido.";
        setErro(msg);
        setLoading(false);
        return;
      }
      setStep({
        kind: "link",
        orderId: data.orderId,
        checkoutUrl: data.checkoutUrl,
        amountCents: valorCents,
        description,
      });
      setLoading(false);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro de rede.");
      setLoading(false);
    }
  }

  function resetToForm() {
    setStep({ kind: "form" });
    setErro(null);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF7F1] px-6 py-12 text-[#1A1F1B] antialiased md:px-12 md:py-20">
      <div
        className="pointer-events-none fixed inset-0 z-1 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-2 mx-auto max-w-[640px]">
        {step.kind === "form" ? (
          <ReceiptFormView
            valorCents={valorCents}
            onValorChange={onValorChange}
            valorRef={valorRef}
            erroValor={erroValor}
            descricao={descricao}
            setDescricao={setDescricao}
            descricaoRef={descricaoRef}
            erroDescricao={erroDescricao}
            erro={erro}
            loading={loading}
            onSubmit={onSubmit}
          />
        ) : (
          <LinkView step={step} onBack={resetToForm} />
        )}
      </div>
    </main>
  );
}

function ReceiptFormView({
  valorCents,
  onValorChange,
  valorRef,
  erroValor,
  descricao,
  setDescricao,
  descricaoRef,
  erroDescricao,
  erro,
  loading,
  onSubmit,
}: {
  valorCents: number;
  onValorChange: (raw: string) => void;
  valorRef: React.RefObject<HTMLInputElement | null>;
  erroValor: string | null;
  descricao: string;
  setDescricao: (v: string) => void;
  descricaoRef: React.RefObject<HTMLInputElement | null>;
  erroDescricao: string | null;
  erro: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    setReceiptNumber(
      Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(""),
    );
    setToday(
      new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    );
  }, []);

  const isInvalid = valorCents < 100 || !descricao.trim();

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative border border-[#1F4A33]/15 bg-[#F5F1E8] shadow-[0_2px_0_rgba(31,74,51,0.04),0_24px_60px_-30px_rgba(31,74,51,0.25)]"
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[#1F4A33]" />

      {/* Decorative outline "₿" — fica atrás, sem chamar atenção */}
      <div
        className="pointer-events-none absolute -top-6 right-2 select-none text-[clamp(160px,28vw,260px)] leading-none text-transparent md:right-4"
        style={{
          fontFamily: FRAUNCES,
          WebkitTextStroke: "1px rgba(31, 74, 51, 0.08)",
          fontStyle: "italic",
        }}
        aria-hidden
      >
        $
      </div>

      <div className="relative px-6 pt-9 pb-9 sm:px-7 sm:pt-10 sm:pb-10 md:px-12 md:pt-14 md:pb-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.32em] text-[#E89B3C] uppercase">
              <span className="h-px w-7 bg-[#E89B3C]" />
              <span>Pagamento</span>
            </div>
            <h1
              className="text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-[-0.02em] text-[#1F4A33]"
              style={{ fontFamily: FRAUNCES }}
            >
              Nova{" "}
              <em className="font-light text-[#E89B3C] italic">cobrança.</em>
            </h1>
          </div>

          <div className="shrink-0 text-left text-[10px] tracking-[0.2em] text-[#4A524C]/70 uppercase sm:text-right">
            <div>Nº {receiptNumber}</div>
            <div className="mt-1 text-[#1F4A33]">{today}</div>
          </div>
        </div>

        {/* Emissor */}
        <div className="mb-8 flex flex-col gap-1 text-[10px] tracking-[0.22em] text-[#4A524C]/80 uppercase sm:mb-10 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <span className="text-[#4A524C]/60">Emissor</span>
            <span className="ml-2 text-[#1F4A33]">Matheus Fernandes</span>
          </div>
          <div className="text-[#4A524C]/70">CREFITO 3/321383-F</div>
        </div>

        {/* Descrição row */}
        <Row label="Descrição">
          <input
            ref={descricaoRef}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            maxLength={140}
            disabled={loading}
            aria-invalid={!!erroDescricao}
            aria-describedby={erroDescricao ? "erro-descricao" : undefined}
            placeholder="Ex: avaliação fisioterapêutica · 1 sessão"
            className={`w-full min-w-0 border-0 border-b bg-transparent pb-2 text-left text-[16px] text-[#1F4A33] placeholder:text-[#4A524C]/35 focus:outline-none disabled:opacity-50 sm:text-right sm:text-[17px] ${
              erroDescricao
                ? "border-red-400 focus:border-red-500"
                : "border-[#1F4A33]/15 focus:border-[#1F4A33]/50 sm:border-transparent"
            }`}
            style={{ fontFamily: FRAUNCES }}
          />
          {erroDescricao && (
            <div
              id="erro-descricao"
              role="alert"
              className="mt-2 text-[12px] text-red-700 sm:text-right"
            >
              {erroDescricao}
            </div>
          )}
        </Row>

        <Divider />

        {/* Valor row — destaque */}
        <div className="grid grid-cols-1 items-baseline gap-3 py-6 sm:grid-cols-[110px_1fr] sm:gap-4 sm:py-8 md:grid-cols-[160px_1fr]">
          <div className="text-[10px] font-semibold tracking-[0.28em] text-[#1F4A33] uppercase">
            Valor
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline justify-end gap-2 sm:gap-3">
              <span
                className={`text-[18px] sm:text-[22px] ${
                  erroValor ? "text-red-500" : "text-[#E89B3C]/90"
                }`}
                style={{ fontFamily: FRAUNCES }}
              >
                R$
              </span>
              <input
                ref={valorRef}
                value={valorCents === 0 ? "" : formatCentsPlain(valorCents)}
                onChange={(e) => onValorChange(e.target.value)}
                onFocus={(e) => e.target.select()}
                inputMode="decimal"
                disabled={loading}
                placeholder="0,00"
                aria-label="Valor da cobrança"
                aria-invalid={!!erroValor}
                aria-describedby={erroValor ? "erro-valor" : undefined}
                className={`min-w-0 flex-1 border-0 bg-transparent text-right text-[clamp(36px,11vw,72px)] leading-none tracking-[-0.02em] tabular-nums placeholder:text-[#4A524C]/25 focus:outline-none disabled:opacity-50 ${
                  erroValor ? "text-red-700" : "text-[#1F4A33]"
                }`}
                style={{ fontFamily: FRAUNCES }}
              />
            </div>
            {erroValor && (
              <div
                id="erro-valor"
                role="alert"
                className="mt-2 text-right text-[12px] text-red-700"
              >
                {erroValor}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-right text-[10px] tracking-[0.2em] text-[#4A524C]/60 uppercase">
          no PIX ou cartão até 12x
        </div>

        {erro && (
          <div
            role="alert"
            className="mt-2 border-l-2 border-red-400 bg-red-50/60 px-4 py-3 text-[13px] text-red-800"
          >
            {erro}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`group relative mt-10 inline-flex w-full items-center justify-center gap-3 overflow-hidden border border-[#E89B3C] bg-[#E89B3C] px-6 py-5 text-[13px] font-semibold tracking-[0.24em] text-[#1F4A33] uppercase transition-colors disabled:cursor-wait disabled:opacity-50 ${
            isInvalid ? "opacity-50" : "hover:border-[#1F4A33]"
          }`}
        >
          {!isInvalid && (
            <span className="absolute inset-0 -translate-y-[calc(100%+1px)] bg-[#FAF7F1] transition-transform duration-300 group-hover:translate-y-0 group-disabled:-translate-y-[calc(100%+1px)]" />
          )}
          <LockOutline className="relative h-4 w-4" />
          <span className="relative">
            {loading ? "Gerando link…" : "Checkout seguro"}
          </span>
        </button>

        {/* Footer fine print */}
        <div className="mt-8 text-center text-[9px] tracking-[0.24em] text-[#4A524C]/60 uppercase">
          Processado por InfinitePay
        </div>
      </div>
    </form>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-baseline gap-2 py-5 sm:grid-cols-[110px_1fr] sm:gap-4 sm:py-6 md:grid-cols-[160px_1fr]">
      <div className="text-[10px] font-semibold tracking-[0.28em] text-[#1F4A33] uppercase">
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full bg-[#1F4A33]/15"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(31,74,51,0.25) 0%, rgba(31,74,51,0.25) 50%, transparent 50%, transparent 100%)",
        backgroundSize: "8px 1px",
        backgroundRepeat: "repeat-x",
        backgroundColor: "transparent",
      }}
      aria-hidden
    />
  );
}

function LinkView({
  step,
  onBack,
}: {
  step: Extract<Step, { kind: "link" }>;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(step.checkoutUrl);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  const whatsappText = `Olá! Segue o link de pagamento de ${formatCents(step.amountCents)} — ${step.description}.\n\n${step.checkoutUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="relative border border-[#1F4A33]/15 bg-[#F5F1E8] shadow-[0_2px_0_rgba(31,74,51,0.04),0_24px_60px_-30px_rgba(31,74,51,0.25)]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[#1F4A33]" />

      <div className="relative px-7 pt-10 pb-10 md:px-12 md:pt-14 md:pb-12">
        <div className="mb-3 inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.32em] text-[#E89B3C] uppercase">
          <span className="h-px w-7 bg-[#E89B3C]" />
          <span>Link gerado</span>
        </div>

        <h1
          className="mb-3 text-[clamp(32px,5vw,48px)] leading-[1.02] tracking-[-0.02em] text-[#1F4A33]"
          style={{ fontFamily: FRAUNCES }}
        >
          Pronto pra{" "}
          <em className="font-light text-[#E89B3C] italic">enviar.</em>
        </h1>

        <p
          className="mb-10 text-[15px] leading-[1.55] text-[#4A524C]"
          style={{ fontFamily: FRAUNCES }}
        >
          Cobrança de{" "}
          <strong className="font-medium text-[#1F4A33]">
            {formatCents(step.amountCents)}
          </strong>{" "}
          · {step.description}
        </p>

        <div className="flex flex-col items-center gap-7 border-t border-b border-[#1F4A33]/15 bg-white/60 px-6 py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeUrl(step.checkoutUrl)}
            width={240}
            height={240}
            alt="QR Code do link de pagamento"
            className="h-60 w-60"
          />

          <div className="w-full">
            <div className="mb-2 text-[9px] font-semibold tracking-[0.28em] text-[#4A524C]/80 uppercase">
              Link do checkout
            </div>
            <div className="flex items-stretch border border-[#1F4A33]/25">
              <code className="flex-1 truncate bg-[#F5F1E8] px-3 py-2.5 font-mono text-[12px] text-[#1F4A33]">
                {step.checkoutUrl}
              </code>
              <button
                type="button"
                onClick={onCopy}
                className="border-l border-[#1F4A33]/25 bg-white px-4 text-[10px] font-semibold tracking-[0.22em] text-[#1F4A33] uppercase transition-colors hover:bg-[#1F4A33] hover:text-[#FAF7F1]"
              >
                {copied ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] px-6 py-4 text-[12px] font-semibold tracking-[0.22em] text-white uppercase transition-colors hover:border-[#1ea957] hover:bg-[#1ea957]"
          >
            Compartilhar no WhatsApp
          </a>
          <a
            href={step.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#1F4A33] bg-[#1F4A33] px-6 py-4 text-[12px] font-semibold tracking-[0.22em] text-[#FAF7F1] uppercase transition-colors hover:border-[#E89B3C] hover:bg-[#163826]"
          >
            Abrir checkout →
          </a>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[#1F4A33]/15 pt-6 text-[11px] tracking-[0.22em] text-[#4A524C] uppercase">
          <button
            type="button"
            onClick={onBack}
            className="font-semibold text-[#1F4A33] transition-colors hover:text-[#E89B3C]"
          >
            ← Gerar outra cobrança
          </button>
          <span className="font-mono text-[10px] normal-case text-[#4A524C]/70">
            {step.orderId.slice(0, 8)}…
          </span>
        </div>
      </div>
    </div>
  );
}
