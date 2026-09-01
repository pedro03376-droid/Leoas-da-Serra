import type { Metadata } from "next";
import "./globals.css";
import { archivo, inter, jetbrainsMono } from "@/lib/fonts";
import { SmoothScrollProvider, CustomCursor } from "@/components/motion";
import { IntroGate } from "@/components/intro/IntroGate";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { CartProvider } from "@/components/store/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";

export const metadata: Metadata = {
  title: "Leoas da Serra · Futsal Feminino de Lages",
  description:
    "Site oficial das Leoas da Serra, equipe de futsal feminino de Lages, Santa Catarina. Jogos, elenco, temporada e loja oficial.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black text-white">
        <SmoothScrollProvider>
          <CartProvider>
            <IntroGate>
              <CustomCursor />
              <Header />
              <main className="flex-1">{children}</main>
              <MobileActionBar />
              <Footer />
              <CartDrawer />
            </IntroGate>
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
