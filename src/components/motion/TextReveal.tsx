"use client";

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** Anima cada linha com um delay progressivo (padrao: true). */
  stagger?: boolean;
  /** Dispara ao entrar na viewport (padrao) ou imediatamente ao montar. */
  trigger?: "viewport" | "immediate";
}

/**
 * Titulos revelados por mascara (clip-path), linha a linha, com
 * deslocamento vertical sutil — nunca um fade simples.
 */
export function TextReveal({
  children,
  as: Tag = "div",
  className,
  stagger = true,
  trigger = "viewport",
}: TextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const lines = containerRef.current?.querySelectorAll<HTMLElement>("[data-reveal-line]");
    if (!lines || lines.length === 0) return;

    if (reducedMotion) {
      gsap.set(lines, { clipPath: "inset(0 0 0% 0)", yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(lines, { clipPath: "inset(0 0 100% 0)", yPercent: 30 });

    const animation = gsap.to(lines, {
      clipPath: "inset(0 0 0% 0)",
      yPercent: 0,
      duration: 1.1,
      ease: EASE_CINEMATIC_GSAP,
      stagger: stagger ? 0.08 : 0,
      scrollTrigger:
        trigger === "viewport"
          ? {
              trigger: containerRef.current,
              start: "top 85%",
              once: true,
            }
          : undefined,
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reducedMotion, stagger, trigger]);

  const lines = children.split("\n");

  return (
    <Tag className={className}>
      <span ref={containerRef} className="contents">
        {lines.map((line, index) => (
          <span key={`${line}-${index}`} className="block overflow-hidden">
            <span data-reveal-line className="block">
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
