import { WhatsAppIcon } from "@/components/icons";

const WHATSAPP_GENERICO =
  "https://wa.me/5516991167474?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais.";

export function WhatsAppFloating() {
  return (
    <a
      href={WHATSAPP_GENERICO}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed right-5 bottom-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#FAF7F1] shadow-[0_8px_24px_rgba(31,74,51,0.25)] transition-transform hover:scale-105 md:right-8 md:bottom-8 md:h-16 md:w-16"
    >
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
      <span className="pointer-events-none absolute right-full mr-3 hidden translate-y-0 rounded bg-[#1F4A33] px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[#FAF7F1] uppercase whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 md:inline-block">
        Falar no WhatsApp
      </span>
    </a>
  );
}
