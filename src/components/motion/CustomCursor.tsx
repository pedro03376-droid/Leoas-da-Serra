"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const POINTER_QUERY = "(pointer: fine)";

function subscribeFinePointer(callback: () => void) {
  const mediaQuery = window.matchMedia(POINTER_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia(POINTER_QUERY).matches;
}

function getFinePointerServerSnapshot() {
  return false;
}

/**
 * Cursor personalizado apenas em desktop com ponteiro fino (mouse real).
 * Em touch, ou com prefers-reduced-motion, o componente nao renderiza nada
 * e o cursor nativo do sistema permanece — nunca prejudica usabilidade.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const isFinePointer = useSyncExternalStore(subscribeFinePointer, getFinePointerSnapshot, getFinePointerServerSnapshot);
  const reducedMotion = usePrefersReducedMotion();
  const enabled = isFinePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const loop = () => {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 rounded-full bg-red mix-blend-difference"
    />
  );
}
