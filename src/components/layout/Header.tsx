"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/store/CartContext";
import { ESCUDO_SRC } from "@/lib/brand";

/**
 * Header fixo com blur no scroll. So Home e Loja por enquanto — elenco,
 * agenda, temporada, historia, palmares etc. ficam fora da navegacao ate
 * ter conteudo real cadastrado. Traga de volta (nav + menu completo)
 * conforme cada secao for ficando pronta.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { lines, openCart } = useCart();
  const itemCount = lines.reduce((total, line) => total + line.quantidade, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-line bg-black/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Leoas da Serra, pagina inicial">
          <Image src={ESCUDO_SRC} alt="" width={32} height={48} className="h-9 w-auto shrink-0 sm:h-12" />
          <span className="font-display truncate text-base leading-none text-white sm:text-lg">Leoas da Serra</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/loja"
            className="rounded-full border border-line px-4 py-2 text-sm text-white transition-colors hover:border-red"
          >
            Loja
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir sacola${itemCount > 0 ? `, ${itemCount} itens` : ""}`}
            className="relative rounded-full border border-line p-2.5 text-white/80 transition-colors hover:border-red hover:text-white sm:px-4 sm:py-2 sm:text-sm"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 12H7L6 8Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="hidden sm:inline">Sacola</span>
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
