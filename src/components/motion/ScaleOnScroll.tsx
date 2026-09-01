"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ScaleOnScrollProps {
  children: React.ReactNode;
  className?: string;
  from?: number;
  to?: number;
}

/** Imagens expandindo levemente conforme a secao entra e cruza a viewport. */
export function ScaleOnScroll({ children, className, from = 1.15, to = 1 }: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const animation = gsap.fromTo(
      el,
      { scale: from },
      {
        scale: to,
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
  }, [reducedMotion, from, to]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={ref} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
