import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/motion";
import type { EscalacaoAtleta } from "@/types/content";

/** Escalacao das Leoas: numero, nome e posicao, cada uma linkando pro perfil no elenco. */
export function MatchLineup({ escalacao }: { escalacao: EscalacaoAtleta[] }) {
  if (escalacao.length === 0) return null;

  return (
    <section className="border-b border-line px-5 py-16 sm:px-8">
      <TextReveal as="h2" className="font-display text-2xl text-white sm:text-3xl">
        Escalacao
      </TextReveal>

      <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {escalacao.map((jogadora) => (
          <li key={jogadora.atletaId}>
            <Link href={`/elenco/${jogadora.slug}`} className="group flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-card">
                {jogadora.foto && (
                  <Image src={jogadora.foto.url} alt="" fill sizes="44px" style={{ objectFit: "cover" }} />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-white group-hover:text-red">
                  <span className="font-mono text-gray">{jogadora.numero}</span> {jogadora.nome}
                </p>
                <p className="text-xs text-gray">{jogadora.posicao}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
