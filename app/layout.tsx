import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

import { WhatsAppFloating } from "@/components/whatsapp-floating";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Matheus Fernandes — Fisioterapeuta Esportivo",
  description:
    "Fisioterapeuta esportivo. Terapias manuais modernas, raciocínio clínico baseado em evidência.",
  metadataBase: new URL("https://ftmatheusfernandes.com.br"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        {/* Roda síncrono ANTES do browser tentar pular pra âncora.
         * Salva o hash, limpa da URL → smooth-scroll-on-hash recupera depois. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var h=window.location.hash;if(h&&h.length>1){window.__pendingHash=h;window.history.replaceState(null,'',window.location.pathname+window.location.search);}})();",
          }}
        />
        {children}
        <WhatsAppFloating />
      </body>
    </html>
  );
}
