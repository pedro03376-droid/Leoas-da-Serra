import Image from "next/image";
import { ImageReveal, TextReveal } from "@/components/motion";
import type { Atleta } from "@/types/content";
import { objectPositionFrom } from "@/lib/format";

export function AthleteProfile({ atleta }: { atleta: Atleta }) {
  return (
    <>
      <section className="grid grid-cols-1 gap-10 px-5 py-28 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-card">
          <Image
            src={atleta.foto.url}
            alt={atleta.foto.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            style={{ objectFit: "cover", objectPosition: objectPositionFrom(atleta.foto) }}
            priority
          />
          <span className="font-display absolute left-4 top-2 text-7xl text-white/20 sm:text-8xl">{atleta.numero}</span>
        </div>

        <div className="flex flex-col">
          <p className="font-mono-label text-xs text-red">{atleta.posicao}</p>
          <TextReveal as="h1" className="font-display mt-3 text-4xl text-white sm:text-5xl">
            {atleta.nome}
          </TextReveal>
          {atleta.altura && <p className="mt-3 text-sm text-gray">Altura: {atleta.altura} m</p>}
          {atleta.bio && <p className="mt-6 max-w-md text-sm leading-relaxed text-gray">{atleta.bio}</p>}

          {atleta.statsPosicao && atleta.statsPosicao.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:max-w-sm">
              {atleta.statsPosicao.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-mono-label text-[11px] text-gray">{stat.label}</dt>
                  <dd className="font-display mt-1 text-2xl text-white">{stat.valor}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {atleta.midia && atleta.midia.length > 0 && (
        <section className="px-5 pb-24 sm:px-8">
          <TextReveal as="h2" className="font-display text-2xl text-white sm:text-3xl">
            Midia
          </TextReveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {atleta.midia.map((foto, index) => (
              <ImageReveal
                key={`${foto.url}-${index}`}
                src={foto.url}
                alt={foto.alt}
                width={500}
                height={375}
                className="aspect-[4/3] w-full rounded-sm"
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
