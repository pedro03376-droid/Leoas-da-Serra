"use client";

import Image from "next/image";
import { useCart } from "./CartContext";
import { formatarPreco } from "@/lib/format";
import type { ProdutoDestaque } from "@/types/content";

export function ProductDetail({ produto }: { produto: ProdutoDestaque }) {
  const { addItem, openCart } = useCart();

  return (
    <section className="grid grid-cols-1 gap-10 px-5 py-28 sm:px-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-card">
        <Image src={produto.imagem.url} alt={produto.imagem.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" style={{ objectFit: "cover" }} priority />
      </div>

      <div className="flex flex-col">
        <p className="font-mono-label text-xs text-red">{produto.categoria}</p>
        <h1 className="font-display mt-3 text-3xl text-white sm:text-4xl">{produto.nome}</h1>
        <p className="mt-3 text-lg text-white">{formatarPreco(produto.precoCentavos)}</p>
        {produto.descricao && <p className="mt-6 max-w-md text-sm leading-relaxed text-gray">{produto.descricao}</p>}

        <button
          type="button"
          onClick={() => {
            addItem(produto);
            openCart();
          }}
          className="font-mono-label mt-8 w-full max-w-xs rounded-full bg-red py-3.5 text-xs text-white transition-colors hover:bg-red-dark"
        >
          Adicionar a sacola
        </button>
      </div>
    </section>
  );
}
