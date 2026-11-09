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
    ];
  },
};

export default nextConfig;
