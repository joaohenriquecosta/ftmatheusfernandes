import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/proposta",
        destination: "/proposta.html",
      },
    ];
  },
};

export default nextConfig;
