"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __pendingHash?: string;
  }
}

/**
 * Recupera o hash que foi removido da URL pelo script síncrono no <body>
 * e faz scroll suave do topo até a âncora. Restaura o hash na URL no fim
 * pra manter compartilhamento de link funcionando.
 */
export function SmoothScrollOnHash() {
  useEffect(() => {
    const hash = window.__pendingHash;
    if (!hash) return;
    window.__pendingHash = undefined;

    let target: Element | null = null;
    try {
      target = document.querySelector(hash);
    } catch {
      return;
    }
    if (!target) return;

    // Próxima frame pra garantir que o layout terminou.
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search + hash,
      );
    });
  }, []);

  return null;
}
