"use client";

import { useSyncExternalStore } from "react";
import { Intro } from "./Intro";
import { getIntroSeenServerSnapshot, getIntroSeenSnapshot, markIntroSeen, subscribeIntroSeen } from "./useIntroSeen";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Decide se a intro roda: so na primeira visita da sessao, e nunca com
 * prefers-reduced-motion (pula direto para a Home).
 */
export function IntroGate({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const introSeen = useSyncExternalStore(subscribeIntroSeen, getIntroSeenSnapshot, getIntroSeenServerSnapshot);
  const showIntro = !reducedMotion && !introSeen;

  return (
    <>
      {showIntro && <Intro onComplete={markIntroSeen} />}
      {children}
    </>
  );
}
