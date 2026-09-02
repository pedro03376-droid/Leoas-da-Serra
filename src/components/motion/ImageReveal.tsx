"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
  /** So para pedir uma resolucao adequada ao otimizador — o box real vem do wrapper (fill). */
  width?: number;
  height?: number;
}

/**
 * Fotos reveladas por clip-path (wipe da esquerda para a direita) —
 * nunca um fade simples. Preenche sempre o wrapper (fill + cover), nunca
 * um tamanho fixo — quem controla a proporcao e a classe do wrapper
 * (aspect-[4/5] etc.), nao o width/height da imagem.
 */
export function ImageReveal({
  className,
  alt,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- so pra excluir do spread (fill nao aceita width/height)
  width,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- so pra excluir do spread (fill nao aceita width/height)
  height,
  style,
  sizes,
  ...imageProps
}: ImageRevealProps) {
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
      <Image
        alt={alt}
        fill
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        style={{ objectFit: "cover", ...style }}
        {...imageProps}
      />
    </div>
  );
}
