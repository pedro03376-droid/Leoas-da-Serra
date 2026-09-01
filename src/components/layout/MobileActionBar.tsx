import Link from "next/link";

const ACTIONS = [
  { href: "/ingressos", label: "Ingressos" },
  { href: "/agenda", label: "Agenda" },
  { href: "/loja", label: "Loja" },
];

/**
 * Barra flutuante com acoes-chave sempre a mao no mobile
 * (inspiracao Barcelona: navegacao util, agrupamento claro).
 */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Acoes rapidas"
      className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-1 rounded-full border border-line bg-black/85 p-1.5 backdrop-blur-md lg:hidden"
    >
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex-1 rounded-full px-3 py-2.5 text-center text-xs text-white/85 transition-colors active:bg-red active:text-white"
        >
          {action.label}
        </Link>
      ))}
    </nav>
  );
}
