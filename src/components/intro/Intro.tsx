"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";
import { ESCUDO_SRC } from "@/lib/brand";

interface IntroProps {
  onComplete: () => void;
}

/**
 * Abertura cinematografica sem video (~6s + skip). Sequencia exata:
 * preto -> linha -> LAGES -> SANTA CATARINA -> linha vira geometria de
 * quadra -> linha some -> escudo por mascara -> LEOAS -> DA SERRA ->
 * FUTSAL FEMININO -> composicao se desmonta, escudo reduz, header/home
 * revelados. Mobile usa a MESMA timeline (o CSS responsivo cuida da escala).
 */
export function Intro({ onComplete }: IntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const courtRef = useRef<SVGSVGElement>(null);
  const lagesRef = useRef<HTMLSpanElement>(null);
  const scRef = useRef<HTMLSpanElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const leoasRef = useRef<HTMLSpanElement>(null);
  const daSerraRef = useRef<HTMLSpanElement>(null);
  const futsalRef = useRef<HTMLParagraphElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onComplete();
    };

    const tl = gsap.timeline({ onComplete: finish });

    tl.set(rootRef.current, { autoAlpha: 1 })

      // 2. pequena linha surge lentamente no centro
      .fromTo(lineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.7, ease: EASE_CINEMATIC_GSAP }, 0.2)

      // 3. LAGES aparece
      .to(lagesRef.current, { opacity: 1, y: 0, duration: 0.5, ease: EASE_CINEMATIC_GSAP }, "+=0.15")

      // 4. SANTA CATARINA aparece abaixo
      .to(scRef.current, { opacity: 1, y: 0, duration: 0.5, ease: EASE_CINEMATIC_GSAP }, "-=0.25")

      // 5. a linha se expande e forma a geometria de uma quadra de futsal
      .to(lineRef.current, { scaleX: 2.4, duration: 0.6, ease: EASE_CINEMATIC_GSAP }, "+=0.2")
      .to(courtRef.current, { opacity: 1, duration: 0.5, ease: "power1.out" }, "<")

      // 6. a linha (e a quadra) desaparecem
      .to([lineRef.current, courtRef.current], { opacity: 0, duration: 0.4, ease: "power1.in" }, "+=0.35")
      .to([lagesRef.current, scRef.current], { opacity: 0, y: -12, duration: 0.4, ease: "power1.in" }, "<")

      // 7-8. escudo entra por mascara: scale + opacity + clip-path + blur — nao um fade simples
      .fromTo(
        shieldRef.current,
        { opacity: 0, scale: 0.6, clipPath: "inset(40% 40% 40% 40%)", filter: "blur(14px)" },
        { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", duration: 0.9, ease: EASE_CINEMATIC_GSAP },
        "+=0.1",
      )

      // 9. LEOAS entra (deslocamento vertical)
      .to(leoasRef.current, { opacity: 1, y: 0, duration: 0.6, ease: EASE_CINEMATIC_GSAP }, "-=0.25")

      // 10. DA SERRA entra (deslocamento vertical)
      .to(daSerraRef.current, { opacity: 1, y: 0, duration: 0.6, ease: EASE_CINEMATIC_GSAP }, "-=0.4")

      // 11. FUTSAL FEMININO entra (fade + tracking)
      .fromTo(
        futsalRef.current,
        { opacity: 0, letterSpacing: "0.5em" },
        { opacity: 1, letterSpacing: "0.35em", duration: 0.7, ease: "power1.out" },
        "-=0.2",
      )

      // 12. composicao se desmonta; escudo reduz; header aparece; a Home e revelada
      .to({}, { duration: 0.4 })
      .to(
        [leoasRef.current, daSerraRef.current, futsalRef.current],
        { opacity: 0, y: -16, duration: 0.5, ease: "power2.in" },
        "+=0",
      )
      .to(shieldRef.current, { scale: 0.4, duration: 0.5, ease: "power2.in" }, "<")
      .to(rootRef.current, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "-=0.15");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    gsap.killTweensOf([
      rootRef.current,
      lineRef.current,
      courtRef.current,
      lagesRef.current,
      scRef.current,
      shieldRef.current,
      leoasRef.current,
      daSerraRef.current,
      futsalRef.current,
    ]);
    onComplete();
  };

  return (
    <div
      ref={rootRef}
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black opacity-0"
      style={{ visibility: "hidden" }}
    >
      <button
        type="button"
        onClick={handleSkip}
        className="font-mono-label absolute right-5 top-5 z-10 rounded-full border border-line px-4 py-2 text-xs text-white/70 transition-colors hover:border-red hover:text-white sm:right-8 sm:top-8"
      >
        Pular
      </button>

      <div className="relative flex w-full max-w-md flex-col items-center px-6 text-center sm:max-w-lg">
        <div ref={lineRef} className="h-px w-10 origin-center scale-x-0 bg-red opacity-0" />

        <svg
          ref={courtRef}
          aria-hidden
          className="absolute h-24 w-40 opacity-0 sm:h-32 sm:w-56"
          viewBox="0 0 200 100"
          fill="none"
        >
          <rect x="4" y="4" width="192" height="92" stroke="var(--line)" strokeWidth="1" />
          <line x1="100" y1="4" x2="100" y2="96" stroke="var(--line)" strokeWidth="1" />
          <circle cx="100" cy="50" r="16" stroke="var(--line)" strokeWidth="1" />
        </svg>

        <span
          ref={lagesRef}
          className="font-mono-label mt-6 translate-y-2 text-sm text-white opacity-0 sm:text-base"
        >
          Lages
        </span>
        <span
          ref={scRef}
          className="font-mono-label mt-1 translate-y-2 text-xs text-gray opacity-0 sm:text-sm"
        >
          Santa Catarina
        </span>

        <div ref={shieldRef} className="relative mt-10 h-28 w-20 opacity-0 sm:h-36 sm:w-24">
          <Image src={ESCUDO_SRC} alt="" fill priority sizes="144px" style={{ objectFit: "contain" }} />
        </div>

        <h1 className="font-display mt-8 text-5xl text-white sm:text-6xl">
          <span ref={leoasRef} className="block translate-y-6 opacity-0">
            Leoas
          </span>
          <span ref={daSerraRef} className="block translate-y-6 text-red opacity-0">
            da Serra
          </span>
        </h1>

        <p ref={futsalRef} className="font-mono-label mt-4 text-xs text-gray opacity-0 sm:text-sm">
          Futsal Feminino
        </p>
      </div>
    </div>
  );
}
