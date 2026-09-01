import Link from "next/link";
import { ImageReveal } from "@/components/motion";
import type { Atleta } from "@/types/content";

const ASPECTOS = ["aspect-[3/4]", "aspect-[3/5]", "aspect-square", "aspect-[4/5]"];

/**
 * Card editorial do elenco: numero grande + nome + posicao. Alturas
 * variadas (aspecto cicla por indice) quebram a grade uniforme, como um
 * mosaico editorial em vez de uma tabela de fichas.
 */
export function RosterCard({ atleta, index }: { atleta: Atleta; index: number }) {
  const aspecto = ASPECTOS[index % ASPECTOS.length];

  return (
    <Link href={`/elenco/${atleta.slug}`} className="group hover-zoom relative block overflow-hidden rounded-sm bg-card">
      <ImageReveal src={atleta.foto.url} alt={atleta.foto.alt} width={480} height={600} className={`w-full ${aspecto}`} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

      <span className="font-display pointer-events-none absolute left-3 top-2 text-4xl text-white/25 transition-colors group-hover:text-red/50 sm:text-5xl">
        {atleta.numero}
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <p className="font-display text-lg text-white sm:text-xl">{atleta.nome}</p>
        <p className="font-mono-label mt-0.5 text-[11px] text-red">{atleta.posicao}</p>
      </div>
    </Link>
  );
}
