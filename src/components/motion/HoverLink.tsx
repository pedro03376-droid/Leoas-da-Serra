"use client";

import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";

interface HoverLinkProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> {
  children: ReactNode;
  className?: string;
}

/**
 * Hover sutil: linha crescendo da esquerda para a direita sob o texto.
 * Puramente CSS (transform), sem JS — GPU-friendly por padrao.
 */
export function HoverLink({ children, className, ...linkProps }: HoverLinkProps) {
  return (
    <Link
      {...linkProps}
      className={`group relative inline-block w-fit ${className ?? ""}`}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
    </Link>
  );
}
