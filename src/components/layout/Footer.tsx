import Image from "next/image";
import Link from "next/link";
import { COMPETICOES } from "@/lib/placeholders";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="flex items-start gap-3">
          <Image src="/placeholders/escudo-leoas.svg" alt="" width={40} height={44} />
          <div>
            <p className="font-display text-xl text-white">Leoas da Serra</p>
            <p className="mt-1 text-sm text-gray">Futsal feminino · Lages, Santa Catarina</p>
            <a
              href="https://instagram.com/leoasdaserra"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-label mt-3 inline-block text-xs text-white/70 hover:text-red"
            >
              @leoasdaserra
            </a>
          </div>
        </div>

        <div>
          <p className="font-mono-label text-xs text-gray">Competicoes</p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/80">
            {COMPETICOES.map((competicao) => (
              <li key={competicao}>{competicao}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono-label text-xs text-gray">Institucional</p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/80">
            <li>
              <Link href="/historia" className="hover:text-red">
                Historia
              </Link>
            </li>
            <li>
              <Link href="/palmares" className="hover:text-red">
                Palmares
              </Link>
            </li>
            <li>
              <Link href="/parceiros" className="hover:text-red">
                Parceiros
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-7xl text-xs text-gray">
        © {new Date().getFullYear()} Leoas da Serra. Todos os direitos reservados.
      </p>
    </footer>
  );
}
