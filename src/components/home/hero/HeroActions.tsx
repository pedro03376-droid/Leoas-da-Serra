"use client";

import Link from "next/link";
import { HoverLink } from "@/components/motion";
import { useMagneticHover } from "@/hooks/useMagneticHover";

interface HeroActionsProps {
  actionsRef: React.Ref<HTMLDivElement>;
  matchCenterHref: string;
}

/**
 * Dois CTAs, minimalistas: "Ver Match Center" (primario, borda fina + seta
 * que desliza) e "Agenda completa" (secundario, so texto + linha que cresce
 * no hover — o mesmo padrao de HoverLink usado no resto do site).
 */
export function HeroActions({ actionsRef, matchCenterHref }: HeroActionsProps) {
  const magneticRef = useMagneticHover<HTMLAnchorElement>(8);

  return (
    <div ref={actionsRef} className="hero-cta-slot mt-10 flex flex-wrap items-center gap-8 opacity-0 lg:mt-12">
      <Link
        ref={magneticRef}
        href={matchCenterHref}
        className="group flex items-center gap-3 border border-white/25 px-6 py-3 text-sm text-white transition-colors duration-300 hover:border-red"
      >
        Ver Match Center
        <span aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-1">
          →
        </span>
      </Link>

      <HoverLink href="/agenda" className="text-sm text-white/60 transition-colors hover:text-white">
        Agenda completa
      </HoverLink>
    </div>
  );
}
