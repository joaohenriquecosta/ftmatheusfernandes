"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Mod, Status } from "./data";

export const PDF_URL = "/turmas/dry-needling/Dry-Needling-Manual-do-Curso.pdf";
const FRAUNCES = "var(--font-fraunces), Georgia, serif";

export type Chapter = { id: string; n: string; title: string };

/* ------------------------------------------------------------------ PDF */

export function PdfButton({ variant = "solid" }: { variant?: "solid" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors";
  const look =
    variant === "solid"
      ? "bg-[#E89B3C] text-[#1F4A33] hover:bg-[#1F4A33] hover:text-[#FAF7F1]"
      : "border border-[#1F4A33]/25 text-[#1F4A33] hover:border-[#1F4A33]";
  return (
    <a href={PDF_URL} download className={`${base} ${look}`}>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13.5h11" />
      </svg>
      Baixar PDF
    </a>
  );
}

/* ------------------------------------------------------- scrollspy + nav */

function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function useProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return p;
}

function go(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

export function EbookNav({ chapters }: { chapters: Chapter[] }) {
  const ids = useMemo(() => chapters.map((c) => c.id), [chapters]);
  const active = useActive(ids);
  const progress = useProgress();
  const [open, setOpen] = useState(false);
  const cur = chapters.find((c) => c.id === active) ?? chapters[0];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const list = (onPick?: () => void) => (
    <ol className="space-y-0.5">
      {chapters.map((c) => {
        const on = c.id === active;
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => {
                onPick?.();
                go(c.id);
              }}
              className={`group flex w-full items-baseline gap-3 py-1.5 text-left text-[13.5px] leading-snug transition-colors ${
                on ? "text-[#1F4A33]" : "text-[#4A524C] hover:text-[#1F4A33]"
              }`}
            >
              <span
                className={`w-6 shrink-0 text-[12px] tabular-nums ${on ? "text-[#E89B3C]" : "text-[#4A524C]/50"}`}
                style={{ fontFamily: FRAUNCES }}
              >
                {c.n}
              </span>
              <span className={on ? "font-semibold" : ""}>{c.title}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* barra de progresso */}
      <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-[#1F4A33]/10">
        <div className="h-full origin-left bg-[#E89B3C]" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* mobile: barra fixa + gaveta */}
      <div className="sticky top-0 z-40 border-b border-[#1F4A33]/10 bg-[#FAF7F1]/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-expanded={open}
            aria-controls="ebook-menu"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center border border-[#1F4A33]/20">
              <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#1F4A33" strokeWidth="1.6" aria-hidden>
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[9.5px] font-semibold tracking-[0.22em] text-[#E89B3C] uppercase">
                Capítulo {cur.n}
              </span>
              <span className="block truncate text-[14px] text-[#1F4A33]" style={{ fontFamily: FRAUNCES }}>
                {cur.title}
              </span>
            </span>
          </button>
          <a
            href={PDF_URL}
            download
            aria-label="Baixar PDF"
            className="grid h-9 w-9 shrink-0 place-items-center bg-[#E89B3C] text-[#1F4A33]"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13.5h11" />
            </svg>
          </a>
        </div>
      </div>

      {open && (
        <div id="ebook-menu" className="fixed inset-0 z-60 flex flex-col bg-[#FAF7F1] lg:hidden" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between border-b border-[#1F4A33]/10 px-4 py-3">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#1F4A33] uppercase">Sumário</span>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center border border-[#1F4A33]/20" aria-label="Fechar">
              <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#1F4A33" strokeWidth="1.6" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{list(() => setOpen(false))}</div>
          <div className="border-t border-[#1F4A33]/10 p-4">
            <PdfButton />
          </div>
        </div>
      )}

      {/* desktop: sumário lateral fixo */}
      <aside className="hidden lg:block">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2 pb-8">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.24em] text-[#E89B3C] uppercase">Sumário</p>
          {list()}
          <div className="mt-6 border-t border-[#1F4A33]/10 pt-6">
            <PdfButton />
            <p className="mt-3 text-[11.5px] leading-relaxed text-[#4A524C]">
              Versão para imprimir, com {chapters.length} capítulos em A4.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ------------------------------------------------------- filtro do atlas */

type Filter = { mod: Mod | "all"; status: Status | "all"; q: string };
const FilterCtx = createContext<Filter>({ mod: "all", status: "all", q: "" });

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const MOD_LABEL: Record<Mod, string> = {
  II: "Módulo II · Superior",
  III: "Módulo III · Lombopélvico",
  IV: "Módulo IV · Face e inferior",
};
const STATUS_LABEL: Record<Status, string> = {
  ensina: "Ensinado na prática",
  ressalva: "Com ressalva",
  demo: "Só demonstração",
};

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`shrink-0 border px-3 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors ${
        on
          ? "border-[#1F4A33] bg-[#1F4A33] text-[#FAF7F1]"
          : "border-[#1F4A33]/20 bg-white text-[#1F4A33] hover:border-[#1F4A33]"
      }`}
    >
      {children}
    </button>
  );
}

type Item = { id: string; mod: Mod; status: Status; name: string };

const matches = (f: Filter, it: Item) =>
  (f.mod === "all" || f.mod === it.mod) &&
  (f.status === "all" || f.status === it.status) &&
  (!f.q || norm(it.name).includes(norm(f.q)));

export function AtlasFilter({ items, children }: { items: Item[]; children: ReactNode }) {
  const [f, setF] = useState<Filter>({ mod: "all", status: "all", q: "" });
  const total = items.length;
  const counts = items.reduce(
    (acc, it) => ({ ...acc, [it.status]: acc[it.status] + 1 }),
    { ensina: 0, ressalva: 0, demo: 0 } as Record<Status, number>,
  );
  const visible = items.filter((it) => matches(f, it)).length;
  return (
    <FilterCtx.Provider value={f}>
      <div className="sticky top-[61px] z-30 -mx-4 mb-8 border-y border-[#1F4A33]/10 bg-[#FAF7F1]/95 px-4 py-3 backdrop-blur lg:top-0 lg:mx-0 lg:border lg:px-4">
        <label className="mb-3 flex items-center gap-2 border border-[#1F4A33]/20 bg-white px-3">
          <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="#4A524C" strokeWidth="1.6" aria-hidden>
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            value={f.q}
            onChange={(e) => setF({ ...f, q: e.target.value })}
            placeholder={`Buscar entre ${total} músculos…`}
            className="w-full bg-transparent py-2.5 text-[15px] outline-none placeholder:text-[#4A524C]/60"
            aria-label="Buscar músculo"
          />
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <Chip on={f.mod === "all" && f.status === "all"} onClick={() => setF({ ...f, mod: "all", status: "all" })}>
            Todos
          </Chip>
          {(Object.keys(MOD_LABEL) as Mod[]).map((m) => (
            <Chip key={m} on={f.mod === m} onClick={() => setF({ ...f, mod: f.mod === m ? "all" : m })}>
              {MOD_LABEL[m]}
            </Chip>
          ))}
          {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
            <Chip key={s} on={f.status === s} onClick={() => setF({ ...f, status: f.status === s ? "all" : s })}>
              {STATUS_LABEL[s]} · {counts[s]}
            </Chip>
          ))}
        </div>
      </div>
      {children}
      {visible === 0 && (
        <p className="border border-dashed border-[#1F4A33]/25 p-6 text-center text-[14px] text-[#4A524C]">
          Nenhum músculo com esse filtro. Músculos sem evidência estão no capítulo “Fora do curso”.
        </p>
      )}
    </FilterCtx.Provider>
  );
}

export function FilterItem({ mod, status, name, id, children }: Item & { children: ReactNode }) {
  const f = useContext(FilterCtx);
  return <div className={matches(f, { id, mod, status, name }) ? "" : "hidden"}>{children}</div>;
}

/* ------------------------------------------------------- abas das figuras */

export function FigureTabs({ a, b, c }: { a: ReactNode; b: ReactNode; c: ReactNode }) {
  const [t, setT] = useState<0 | 1 | 2>(0);
  const tabs = ["Dor referida", "Agulhamento", "Corte"];
  const panes = [a, b, c];
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 border border-[#1F4A33]/20 md:hidden" role="tablist">
        {tabs.map((l, i) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={t === i}
            onClick={() => setT(i as 0 | 1 | 2)}
            className={`py-2.5 text-[10.5px] font-semibold tracking-[0.12em] uppercase transition-colors ${
              t === i ? "bg-[#1F4A33] text-[#FAF7F1]" : "bg-white text-[#1F4A33]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {panes.map((p, i) => (
          <div key={i} className={t === i ? "" : "hidden md:block"}>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
