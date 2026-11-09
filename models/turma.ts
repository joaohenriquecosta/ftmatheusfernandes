export type Lote = {
  nome: string;
  prazo: string;
  valorCents: number;
  endsAt: string;
};

export type Turma = {
  slug: string;
  /**
   * Turma aberta a vendas. Ausente = ativa (compatibilidade). Quando `false`,
   * a turma está desmarcada (sem data prevista) e o checkout é bloqueado.
   */
  ativa?: boolean;
  nome: string;
  cidade: string;
  uf: string;
  local: string;
  datas: string;
  cargaHoraria: string;
  vagas: number;
  lotes: Lote[];
};

const TURMAS: Record<string, Turma> = {
  "sao-carlos": {
    slug: "sao-carlos",
    // Desmarcada — sem data prevista. Mantida aqui só pra facilitar a remarcação
    // (reativar = `ativa: true` + atualizar datas/lotes).
    ativa: false,
    nome: "Terapias Manuais Modernas — São Carlos",
    cidade: "São Carlos",
    uf: "SP",
    local: "Multfisio · Vila Prado",
    datas: "20, 21, 27 e 28 de junho de 2026",
    cargaHoraria: "36h",
    vagas: 20,
    lotes: [
      {
        nome: "Lote 1 · promocional",
        prazo: "até 24 de Maio · 23h59",
        valorCents: 69999,
        endsAt: "2026-05-24T23:59:59-03:00",
      },
      {
        nome: "Lote 2",
        prazo: "até 31 de Maio · 23h59",
        valorCents: 79999,
        endsAt: "2026-05-31T23:59:59-03:00",
      },
      {
        nome: "Lote 3",
        prazo: "até 7 de Junho · 23h59",
        valorCents: 89999,
        endsAt: "2026-06-07T23:59:59-03:00",
      },
      {
        nome: "Lote 4",
        prazo: "até 14 de Junho · 23h59",
        valorCents: 99999,
        endsAt: "2026-06-14T23:59:59-03:00",
      },
      {
        nome: "Lote final",
        prazo: "até o início do curso",
        valorCents: 109999,
        endsAt: "2026-06-20T08:00:00-03:00",
      },
    ],
  },
  uberaba: {
    slug: "uberaba",
    nome: "Terapias Manuais Modernas — Uberaba",
    cidade: "Uberaba",
    uf: "MG",
    local: "Centro Educacional · UFTM",
    datas: "16 e 17 de Maio de 2026",
    cargaHoraria: "16h",
    vagas: 30,
    lotes: [
      {
        nome: "Lote 2",
        prazo: "até 30/04 ou até esgotar",
        valorCents: 35000,
        endsAt: "2026-04-30T23:59:59-03:00",
      },
    ],
  },
  "dry-needling": {
    slug: "dry-needling",
    nome: "Curso de Dry Needling — São Carlos",
    cidade: "São Carlos",
    uf: "SP",
    local: "Clínica Aviven · Centro",
    datas: "14 e 15 de Novembro de 2026",
    cargaHoraria: "20h",
    vagas: 0, // vagas limitadas, número não divulgado
    lotes: [
      {
        nome: "Inscrição",
        prazo: "até o início do curso",
        valorCents: 50000,
        endsAt: "2026-11-14T08:00:00-03:00",
      },
    ],
  },
};

export function get(slug: string): Turma | undefined {
  return TURMAS[slug];
}

export function list(): Turma[] {
  return Object.values(TURMAS);
}

export function getLoteVigente(turma: Turma, now: Date = new Date()): Lote | undefined {
  const ts = now.getTime();
  return turma.lotes.find((l) => new Date(l.endsAt).getTime() > ts);
}

// Cupons (secretos, não divulgados na página).
// - METADE: paga 50% agora (até 31/10), saldo até o início do curso.
// - INDICACAO: R$100 de desconto (Dry Needling: R$500 → R$400), pagamento integral.
//   Para quem fez o trabalho de indicação; vale até o início do curso.
type RegraCupom = {
  ate?: string;
  /** Restringe a turmas específicas; ausente = qualquer turma. */
  turmas?: string[];
} & ({ metade: true } | { descontoCents: number });

const CUPONS: Record<string, RegraCupom> = {
  METADE: { ate: "2026-10-31T23:59:59-03:00", metade: true },
  INDICACAO: { turmas: ["dry-needling"], descontoCents: 10000 },
};

/** balanceDueAt presente = pedido é sinal e falta saldo. */
export type Cupom = { code: string; valorCents: number; balanceDueAt?: string };

/** Retorna o valor a cobrar com o cupom, ou null se inválido/expirado. */
export function aplicarCupom(
  turma: Turma,
  lote: Lote,
  code: string,
  now: Date = new Date(),
): Cupom | null {
  const c = code.trim().toUpperCase();
  const regra = CUPONS[c];
  if (!regra) return null;
  if (regra.ate && now.getTime() > new Date(regra.ate).getTime()) return null;
  if (regra.turmas && !regra.turmas.includes(turma.slug)) return null;
  // ponytail: início do curso = endsAt do último lote; criar campo `inicio` se divergir.
  const inicio = turma.lotes[turma.lotes.length - 1].endsAt;
  if ("metade" in regra) {
    return { code: c, valorCents: Math.ceil(lote.valorCents / 2), balanceDueAt: inicio };
  }
  return { code: c, valorCents: Math.max(0, lote.valorCents - regra.descontoCents) };
}
