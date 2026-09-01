"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ESCUDO_SRC } from "@/lib/brand";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Jogo } from "@/types/content";
import { HeroBackground } from "./HeroBackground";
import { HeroEditorialTag } from "./HeroEditorialTag";
import { HeroPhoto } from "./HeroPhoto";
import { HeroActions } from "./HeroActions";

gsap.registerPlugin(ScrollTrigger);

const STATUS_LABEL: Record<Jogo["status"], string> = {
  agendado: "Proximo jogo",
  ao_vivo: "Ao vivo agora",
  encerrado: "Ultimo jogo",
};

/**
 * Selo da liga: hoje so temos o vetor da LFF (Liga Feminina de Futsal), por
 * isso o check de nome — quando outras competicoes tiverem selo, isso vira
 * um mapa competicao -> logo (ou um campo no CMS).
 */
const LFF_LOGO_SRC = "/brand/liga-lff-icon.png";
const isLigaFemininaFutsal = (competicao: string) => competicao.startsWith("Liga Feminina de Futsal");

/**
 * Hero da Home: abertura editorial do proximo jogo como evento — composicao,
 * tipografia e fotografia antes de motion. Uma unica timeline coordenada
 * (nao efeitos isolados) e, no scroll, a composicao inteira recua com
 * sutileza para dar lugar a proxima secao.
 */
export function Hero({ jogo }: { jogo: Jogo }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const shieldsRef = useRef<HTMLDivElement>(null);
  const leoasRef = useRef<HTMLHeadingElement>(null);
  const vsRef = useRef<HTMLSpanElement>(null);
  const adversarioRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();

  // timeZone fixo: a data/hora do jogo precisa renderizar igual no servidor
  // e no client, independente do fuso da maquina que fez o SSR.
  const dataFormatada = new Date(jogo.dataHora).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
  const horaFormatada = new Date(jogo.dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  useEffect(() => {
    const elements = [
      bgRef.current,
      tagRef.current,
      kickerRef.current,
      statusRef.current,
      shieldsRef.current,
      leoasRef.current,
      vsRef.current,
      adversarioRef.current,
      dateRef.current,
      photoRef.current,
      actionsRef.current,
    ];
    if (elements.some((el) => !el)) return;

    if (reducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)" });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE_CINEMATIC_GSAP } });

    tl.to(bgRef.current, { opacity: 1, duration: 0.5 }, 0)
      .fromTo(tagRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.3)
      .fromTo(kickerRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.3)
      .fromTo(
        statusRef.current,
        { clipPath: "inset(0 0 100% 0)", opacity: 1 },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5 },
        0.5,
      )
      .fromTo(leoasRef.current, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.6 }, 0.7)
      .fromTo(vsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.9)
      .fromTo(adversarioRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, 1.0)
      .fromTo(
        shieldsRef.current,
        { opacity: 0, scale: 0.85, filter: "blur(10px)", clipPath: "inset(18% 18% 18% 18%)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)", duration: 0.6 },
        1.1,
      )
      .fromTo(dateRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.3)
      .fromTo(
        photoRef.current,
        { opacity: 0, scale: 1.04, clipPath: "inset(0% 0% 6% 0%)" },
        { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
        1.5,
      )
      .fromTo(actionsRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.8);

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !contentRef.current) return;

    const animation = gsap.fromTo(
      contentRef.current,
      { opacity: 1, y: 0, scale: 1 },
      {
        opacity: 0.4,
        y: -32,
        scale: 0.97,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative min-h-[92svh] overflow-hidden sm:min-h-[92vh] lg:min-h-screen">
      <HeroBackground heroRef={bgRef} />

      <div
        ref={contentRef}
        className="hero-grid relative z-10 mx-auto max-w-[1500px] px-5 pb-14 pt-32 sm:px-8 lg:h-full lg:px-10 lg:pb-16 lg:pt-36"
      >
        <HeroEditorialTag tagRef={tagRef} />

        <div className="hero-info flex flex-col justify-center">
          <div ref={kickerRef} className="flex items-center gap-2.5 opacity-0">
            {isLigaFemininaFutsal(jogo.competicao) && (
              <Image src={LFF_LOGO_SRC} alt="" width={51} height={16} className="h-4 w-auto opacity-80" />
            )}
            <p className="font-mono-label text-xs text-white/55">{jogo.competicao}</p>
          </div>
          <p ref={statusRef} className="font-mono-label mt-2 text-sm text-red opacity-0 sm:text-base">
            {STATUS_LABEL[jogo.status]}
          </p>

          <div ref={shieldsRef} className="mt-7 flex items-center gap-5 opacity-0 sm:gap-7">
            <div className="relative h-14 w-14 shrink-0 sm:h-20 sm:w-20">
              <Image src={ESCUDO_SRC} alt="" fill sizes="80px" style={{ objectFit: "contain" }} priority />
            </div>
            <div className="relative h-9 w-9 shrink-0 opacity-60 sm:h-12 sm:w-12">
              <Image src={jogo.escudoAdversario.url} alt="" fill sizes="48px" style={{ objectFit: "contain" }} />
            </div>
          </div>

          <div className="mt-3">
            <h1
              ref={leoasRef}
              className="font-display text-[3.4rem] leading-[0.85] text-white opacity-0 sm:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem]"
            >
              Leoas
            </h1>
            <span ref={vsRef} className="font-display mt-1 block text-xl text-white/35 opacity-0 sm:text-2xl">
              vs
            </span>
            <p
              ref={adversarioRef}
              className="font-display mt-1 text-[2.1rem] leading-[0.9] text-red opacity-0 sm:text-5xl lg:text-6xl"
            >
              {jogo.adversario}
            </p>
          </div>

          <div ref={dateRef} className="mt-8 opacity-0">
            <p className="font-display text-2xl text-white sm:text-3xl">{dataFormatada}</p>
            <p className="font-mono-label mt-2 text-xs text-white/50 sm:text-sm">{jogo.local}</p>
            <p className="font-mono-label mt-1 text-xs text-white/50 sm:text-sm">{horaFormatada}</p>
          </div>
        </div>

        <HeroPhoto photoRef={photoRef} />
        <HeroActions actionsRef={actionsRef} matchCenterHref={`/jogos/${jogo.slug}`} />
      </div>
    </section>
  );
}
