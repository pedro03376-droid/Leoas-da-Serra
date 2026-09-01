"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Efeito magnetico muito sutil: o elemento acompanha o cursor por poucos
 * pixels dentro dos proprios limites e volta ao lugar ao sair. So ativa em
 * ponteiro fino (mouse) e nunca com prefers-reduced-motion.
 */
export function useMagneticHover<T extends HTMLElement>(strength = 10): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translate3d(${relX * strength}px, ${relY * strength}px, 0)`;
    };

    const onLeave = () => {
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, strength]);

  return ref;
}
