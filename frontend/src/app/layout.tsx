import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cardápio ETE",
  description: "Cardápio escolar da ETE.",
};

const scriptInicializacaoTema = `
  (function() {
    try {
      var temaSalvo = localStorage.getItem('cardapio-ete-tema') || 'dark';
      document.documentElement.setAttribute('data-theme', temaSalvo);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${poppins.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptInicializacaoTema }} />
      </head>
      <body className="min-h-full bg-fundo text-texto-principal">{children}</body>
    </html>
  );
}
