import Link from "next/link";
import { ImageReveal } from "@/components/motion";
import { formatarPreco, objectPositionFrom } from "@/lib/format";
import type { ProdutoDestaque } from "@/types/content";

/**
 * Vitrine da loja ao lado das informacoes do jogo: as camisas reais em
 * evidencia (frente + nome + preco, cada uma linkando pro produto), no
 * mesmo slot onde antes ficava o placeholder de campanha da atleta.
 */
export function HeroPhoto({
  photoRef,
  produtos,
}: {
  photoRef: React.Ref<HTMLDivElement>;
  produtos: ProdutoDestaque[];
}) {
  return (
    <div
      ref={photoRef}
      className="hero-photo-slot mt-10 flex aspect-[4/5] w-full flex-col opacity-0 lg:mt-0 lg:h-full lg:aspect-auto"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono-label text-[10px] text-white/50">Loja oficial</span>
        <Link href="/loja" className="font-mono-label text-[10px] text-white/50 transition-colors hover:text-white">
          Ver tudo →
        </Link>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        {produtos.map((produto) => (
          <Link
            key={produto._id}
            href={`/loja/${produto.slug}`}
            className="hover-zoom group relative block flex-1 overflow-hidden rounded-sm bg-card"
          >
            <ImageReveal
              src={produto.imagem.url}
              alt={produto.imagem.alt}
              className="h-full w-full"
              style={{ objectPosition: objectPositionFrom(produto.imagem) }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
              <span className="font-display text-base leading-none text-white sm:text-lg">{produto.nome}</span>
              <span className="font-mono-label shrink-0 text-xs text-white/80">
                {formatarPreco(produto.precoCentavos)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
