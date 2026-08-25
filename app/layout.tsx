import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { site } from "@/data/site.config";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} ${site.sufixo} | ${site.slogan}`,
    template: `%s | ${site.nome}`,
  },
  description: site.descricao,
  openGraph: {
    title: `${site.nome} ${site.sufixo} | ${site.slogan}`,
    description: site.descricao,
    url: site.url,
    siteName: `${site.nome} ${site.sufixo}`,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/fotos/camiseta-verde-militar.png",
        width: 1170,
        height: 936,
        alt: "Camiseta Essential LEGADO na cor verde militar",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0d0d0c" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
