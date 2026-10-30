import Link from "next/link";
import { ImageReveal, TextReveal } from "@/components/motion";
import { formatarPreco, objectPositionFrom } from "@/lib/format";
import type { ProdutoDestaque } from "@/types/content";

/**
 * Hero da Loja: "O Vestiario" — as 3 camisas reais mostradas sobre o
 * cenario de vestiario (gerado por IA, ver public/vestiario), substitui
 * o antigo CampaignHero de produto unico. Mesma linguagem de card do
 * ProductCard (ImageReveal + nome + preco), so que maior e sobre o fundo.
 */
export function VestiarioHero({ produtos }: { produtos: ProdutoDestaque[] }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <ImageReveal
          src="/vestiario/fundo-vestiario.jpg"
          alt=""
          priority
          sizes="100vw"
          className="h-full w-full"
          style={{ objectPosition: "50% 28%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-black/85" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-between px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
        <div>
          <p className="font-mono-label text-xs text-red">O Vestiario</p>
          <TextReveal as="h1" className="font-display mt-3 text-5xl text-white sm:text-7xl lg:text-8xl">
            Leoas da Serra
          </TextReveal>
          <p className="font-mono-label mt-4 text-sm text-white/70">Temporada 2026 · Loja oficial</p>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-3 sm:gap-6">
          {produtos.map((produto) => (
            <Link key={produto._id} href={`/loja/${produto.slug}`} className="hover-zoom group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-card ring-1 ring-white/15 transition-colors group-hover:ring-red">
                <ImageReveal
                  src={produto.imagem.url}
                  alt={produto.imagem.alt}
                  className="h-full w-full"
                  style={{ objectPosition: objectPositionFrom(produto.imagem) }}
                />
              </div>
              <p className="font-display mt-2.5 truncate text-sm text-white sm:text-base">{produto.nome}</p>
              <p className="font-mono-label mt-0.5 text-xs text-white/60">{formatarPreco(produto.precoCentavos)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
