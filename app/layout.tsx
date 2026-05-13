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
        {children}
        <WhatsAppFloating />
      </body>
    </html>
  );
}
