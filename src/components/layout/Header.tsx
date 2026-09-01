"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HoverLink } from "@/components/motion";
import { useCart } from "@/components/store/CartContext";

const MENU_LINKS = [
  { href: "/temporada", label: "Temporada" },
  { href: "/historia", label: "Historia" },
  { href: "/palmares", label: "Palmares" },
  { href: "/leoas-play", label: "Leoas Play" },
  { href: "/escola-de-leoas", label: "Escola de Leoas" },
  { href: "/parceiros", label: "Parceiros" },
];

/**
 * Header fixo com blur no scroll. Topo enxuto: so os CTAs que geram receita
 * (ingressos, loja) ficam sempre visiveis — o resto vive no menu
 * (inspiracao Real Madrid: rigor institucional, hierarquia limpa).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Leoas da Serra, pagina inicial">
          <Image src="/placeholders/escudo-leoas.svg" alt="" width={36} height={40} />
          <span className="font-display text-lg text-white">Leoas da Serra</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegacao principal">
          {MENU_LINKS.slice(0, 3).map((link) => (
            <HoverLink key={link.href} href={link.href} className="font-mono-label text-xs text-white/80">
              {link.label}
            </HoverLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/loja"
            className="font-mono-label hidden rounded-full border border-line px-4 py-2 text-xs text-white transition-colors hover:border-red sm:inline-block"
          >
            Loja
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir sacola${itemCount > 0 ? `, ${itemCount} itens` : ""}`}
            className="font-mono-label relative rounded-full border border-line px-4 py-2 text-xs text-white/80 transition-colors hover:border-red hover:text-white"
          >
            Sacola
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </button>
          <Link
            href="/ingressos"
            className="font-mono-label rounded-full bg-red px-4 py-2 text-xs text-white transition-colors hover:bg-red-dark"
          >
            Ingressos
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-completo"
            className="font-mono-label rounded-full border border-line px-4 py-2 text-xs text-white/80 transition-colors hover:border-red hover:text-white"
          >
            {menuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="menu-completo"
          aria-label="Menu completo"
          className="border-t border-line bg-black/95 px-5 py-6 backdrop-blur-md sm:px-8"
        >
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {MENU_LINKS.map((link) => (
              <li key={link.href}>
                <HoverLink
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-2xl text-white"
                >
                  {link.label}
                </HoverLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
