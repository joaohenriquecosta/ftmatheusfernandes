import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/proposta",
        destination: "/proposta.html",
      },
      {
        source: "/turmas/dry-needling/ebook",
        destination: "/turmas/dry-needling/ebook.html",
      },
      {
        source: "/turmas/dry-needling/slides",
        destination: "/turmas/dry-needling/slides.html",
      },
      {
        source: "/turmas/dry-needling/aula",
        destination: "/turmas/dry-needling/aula.html",
      },
      // Vídeo da aula (HLS criptografado) servido por uma origem externa até 23/11/2026.
      // O caminho na origem é secreto e vem de variável de ambiente (repo público).
      ...(process.env.AULA_ORIGIN_PREFIX
        ? [
            {
              source: "/turmas/dry-needling/aula/v/:file",
              destination: `https://aula.joaohenriquecosta.dev/${process.env.AULA_ORIGIN_PREFIX.trim()}/:file`,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
