"use client";

import { useEffect } from "react";

/**
 * Quando a página carrega com `#hash` na URL, o browser nativo "salta" direto
 * pra âncora — perdendo o contexto do conteúdo acima. Este componente força
 * um scroll suave do topo até a âncora pra dar uma sensação de "passagem"
 * pelo restante do site.
 */
export function SmoothScrollOnHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    let target: Element | null = null;
    try {
      target = document.querySelector(hash);
    } catch {
      // Hash inválido como seletor (ex.: caracteres especiais).
      return;
    }
    if (!target) return;

    // Cancela o salto nativo: volta pro topo instantaneamente…
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    // …e na próxima frame, scrolla suavemente até a âncora.
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return null;
}
