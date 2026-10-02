const WHATSAPP_PRE_MESSAGE =
  "Olá João! Vi o site do Matheus Fernandes e queria conversar sobre um projeto.";

const WHATSAPP_URL = `https://wa.me/5516982441889?text=${encodeURIComponent(WHATSAPP_PRE_MESSAGE)}`;

export function DevCredit() {
  return (
    <div className="mt-16 flex justify-center">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Site desenvolvido por João Henrique Costa — falar no WhatsApp"
        className="group inline-flex items-center gap-4 border border-[#1F4A33]/15 bg-[#F5F1E8]/60 py-3 pr-5 pl-3 transition-colors hover:border-[#1F4A33]/40 hover:bg-[#F5F1E8]"
      >
        {/* Marca: prompt de terminal */}
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#1F4A33] font-mono text-[14px] leading-none font-bold text-[#FAF7F1] transition-colors group-hover:bg-[#E89B3C] group-hover:text-[#1F4A33]"
        >
          {">"}
          <span style={{ animation: "terminalBlink 1.06s infinite" }}>_</span>
        </span>

        <span className="flex flex-col gap-0.5 text-left">
          <span className="text-[9px] tracking-[0.26em] text-[#4A524C]/70 uppercase">
            Site desenvolvido por
          </span>
          <span className="text-[13px] font-semibold tracking-[0.16em] text-[#1F4A33] uppercase">
            João Henrique Costa
          </span>
        </span>

        <span className="ml-2 hidden items-center gap-1.5 border-l border-[#1F4A33]/15 pl-4 text-[10px] font-semibold tracking-[0.2em] text-[#E89B3C] uppercase transition-colors group-hover:text-[#1F4A33] sm:inline-flex">
          Quero um site assim
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </a>
    </div>
  );
}
