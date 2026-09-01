"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fotos reveladas por clip-path (wipe da esquerda para a direita) —
 * nunca um fade simples.
 */
export function ImageReveal({ className, alt, ...imageProps }: ImageProps & { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { clipPath: "inset(0 0% 0 0)" });
      return;
    }

    gsap.set(el, { clipPath: "inset(0 100% 0 0)" });

    const animation = gsap.to(el, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1.3,
      ease: EASE_CINEMATIC_GSAP,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <Image alt={alt} {...imageProps} />
    </div>
  );
}
