import { Archivo, Inter, JetBrains_Mono } from "next/font/google";

/**
 * Fontes self-hosted via next/font (baixadas em build-time, servidas localmente —
 * sem requisicao externa em runtime, conforme requisito de performance).
 */
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
