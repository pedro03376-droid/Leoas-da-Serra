"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Velocidade relativa da camada. 0 = estatico, 1 = acompanha o scroll normal. Use < 1 para fundo, > 1 para primeiro plano. */
  speed?: number;
}

/**
 * Camadas em velocidades diferentes ao scroll (Lenis + ScrollTrigger).
 * Anima apenas transform (GPU-friendly).
 */
export function Parallax({ children, className, speed = 0.3 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const distance = () => el.offsetHeight * speed;

    const animation = gsap.fromTo(
      el,
      { y: () => -distance() / 2 },
      {
        y: () => distance() / 2,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reducedMotion, speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
