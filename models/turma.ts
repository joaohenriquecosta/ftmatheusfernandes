export type Lote = {
  nome: string;
  prazo: string;
  valorCents: number;
  endsAt: string;
};

export type Turma = {
  slug: string;
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
