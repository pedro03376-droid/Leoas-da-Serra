import Link from "next/link";
import { ImageReveal, TextReveal } from "@/components/motion";
import type { ProdutoDestaque } from "@/types/content";
import { formatarPreco, objectPositionFrom } from "@/lib/format";

/** Hero-campanha da camisa oficial (ou do produto marcado emCampanha). */
export function CampaignHero({ produto }: { produto: ProdutoDestaque }) {
  return (
    <section className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden px-5 pb-16 pt-32 sm:px-8">
      <div className="absolute inset-0 -z-10">
        <ImageReveal
          src={produto.imagem.url}
          alt={produto.imagem.alt}
          fill
          priority
          sizes="100vw"
          className="h-full w-full"
          style={{ objectFit: "cover", objectPosition: objectPositionFrom(produto.imagem) }}
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <p className="font-mono-label text-xs text-red">Loja oficial</p>
      <TextReveal as="h1" className="font-display mt-3 max-w-2xl text-4xl text-white sm:text-6xl">
        {produto.nome}
      </TextReveal>
      <p className="font-mono-label mt-4 text-sm text-white">{formatarPreco(produto.precoCentavos)}</p>

      <Link
        href={`/loja/${produto.slug}`}
        className="font-mono-label mt-6 w-fit rounded-full bg-red px-6 py-3 text-xs text-white transition-colors hover:bg-red-dark"
      >
        Ver produto
      </Link>
    </section>
  );
}
