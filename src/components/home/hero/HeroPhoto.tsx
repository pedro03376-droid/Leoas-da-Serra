"use client";

import Image from "next/image";
import { Parallax } from "@/components/motion";
import { useMagneticHover } from "@/hooks/useMagneticHover";

/**
 * Painel de fotografia da campanha. Ainda sem foto oficial da atleta —
 * estrutura pronta para receber (troque HERO_CAMPANHA_SRC), com um
 * placeholder editorial (luz, grafite, grao) em vez de uma foto inventada.
 * A borda esquerda esmaece pro preto do fundo, entao nunca parece um card.
 */
const HERO_CAMPANHA_SRC = "/placeholders/hero-campanha.svg";

export function HeroPhoto({ photoRef }: { photoRef: React.Ref<HTMLDivElement> }) {
  const hoverRef = useMagneticHover<HTMLDivElement>(6);

  return (
    <div
      ref={photoRef}
      className="hero-photo-slot relative mt-10 aspect-[4/5] w-full opacity-0 lg:mt-0 lg:h-full lg:aspect-auto"
    >
      <Parallax speed={0.06} className="h-full w-full">
        <div
          ref={hoverRef}
          className="relative h-full w-full transition-transform duration-500 ease-out will-change-transform"
        >
          <Image
            src={HERO_CAMPANHA_SRC}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          {/* esmaece a borda esquerda da foto no fundo — nunca um card com corte reto */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent lg:block hidden" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      </Parallax>

      <span className="font-mono-label absolute bottom-4 left-4 text-[10px] text-white/35 lg:bottom-6 lg:left-6">
        Campanha oficial em breve
      </span>
    </div>
  );
}
