const WHATSAPP_PRE_MESSAGE =
  "Olá João! Vi seu trabalho no site do Matheus Fernandes e queria conversar.";

const WHATSAPP_URL = `https://wa.me/5516982441889?text=${encodeURIComponent(WHATSAPP_PRE_MESSAGE)}`;

export function DevCredit() {
  return (
    <div className="mt-16 text-center">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] tracking-[0.24em] text-[#4A524C]/70 uppercase transition-colors group-hover:text-[#4A524C]">
          Desenvolvido por
        </span>
        <span className="inline-flex items-baseline gap-1 text-[13px] font-semibold tracking-[0.18em] text-[#E89B3C] uppercase transition-colors group-hover:text-[#1F4A33]">
          João Henrique Costa
          <span
            aria-hidden
            className="ml-1 font-mono text-[15px] leading-none normal-case"
          >
            <span className="text-[#1F4A33]/80 group-hover:text-[#E89B3C]">
              {">"}
            </span>
            <span
              className="ml-px inline-block font-bold"
              style={{ animation: "terminalBlink 1.06s infinite" }}
            >
              _
            </span>
          </span>
        </span>
      </a>
    </div>
  );
}
