"use client";

import Link from "next/link";
import { ImageReveal } from "@/components/motion";
import { useCart } from "./CartContext";
import { formatarPreco } from "@/lib/format";
import type { ProdutoDestaque } from "@/types/content";

export function ProductCard({ produto }: { produto: ProdutoDestaque }) {
  const { addItem } = useCart();
  const temTamanhos = Boolean(produto.tamanhos && produto.tamanhos.length > 0);

  return (
    <div className="group">
      <Link href={`/loja/${produto.slug}`} className="hover-zoom block">
        <ImageReveal
          src={produto.imagem.url}
          alt={produto.imagem.alt}
          width={600}
          height={750}
          className="aspect-[4/5] w-full rounded-sm bg-card"
        />
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link href={`/loja/${produto.slug}`} className="text-sm text-white hover:text-red">
            {produto.nome}
          </Link>
          <p className="mt-1 text-sm text-gray">{formatarPreco(produto.precoCentavos)}</p>
        </div>
        {temTamanhos ? (
          // Produto tem grade de tamanho — nunca escolhe por ela, manda pra pagina escolher.
          <Link
            href={`/loja/${produto.slug}`}
            aria-label={`Escolher tamanho de ${produto.nome}`}
            className="font-mono-label shrink-0 rounded-full border border-line px-3 py-2 text-[11px] text-white/80 transition-colors hover:border-red hover:text-white"
          >
            +
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => addItem(produto)}
            aria-label={`Adicionar ${produto.nome} a sacola`}
            className="font-mono-label shrink-0 rounded-full border border-line px-3 py-2 text-[11px] text-white/80 transition-colors hover:border-red hover:text-white"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
