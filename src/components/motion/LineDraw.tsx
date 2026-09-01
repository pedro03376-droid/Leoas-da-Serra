"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface LineDrawProps {
  className?: string;
  /** "horizontal" desenha da esquerda pra direita; "vertical" de cima pra baixo. */
  orientation?: "horizontal" | "vertical";
  trigger?: "viewport" | "immediate";
}

/** Linha desenhada via stroke-dashoffset. Usada em divisores e na geometria da intro. */
export function LineDraw({ className, orientation = "horizontal", trigger = "viewport" }: LineDrawProps) {
  const pathRef = useRef<SVGLineElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = pathRef.current;
    // getTotalLength() lanca excecao em elementos nao renderizados (ex.:
    // dentro de um ancestral com display:none, como esta linha em telas
    // menores que lg) — pula a animacao nesse caso, ela so e decorativa.
    if (!el || el.getClientRects().length === 0) return;

    const length = el.getTotalLength();
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: reducedMotion ? 0 : length });

    if (reducedMotion) return;

    const animation = gsap.to(el, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: EASE_CINEMATIC_GSAP,
      scrollTrigger:
        trigger === "viewport"
          ? {
              trigger: el,
              start: "top 90%",
              once: true,
            }
          : undefined,
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reducedMotion, trigger]);

  const isHorizontal = orientation === "horizontal";

  return (
    <svg
      aria-hidden
      className={className}
      width="100%"
      height={isHorizontal ? 1 : "100%"}
      preserveAspectRatio="none"
    >
      <line
        ref={pathRef}
        x1={isHorizontal ? "0" : "0.5"}
        y1={isHorizontal ? "0.5" : "0"}
        x2={isHorizontal ? "100%" : "0.5"}
        y2={isHorizontal ? "0.5" : "100%"}
        stroke="var(--line)"
        strokeWidth={1}
      />
    </svg>
  );
}
