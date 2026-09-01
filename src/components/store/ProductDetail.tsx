"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./CartContext";
import { formatarPreco } from "@/lib/format";
import type { ProdutoDestaque } from "@/types/content";

export function ProductDetail({ produto }: { produto: ProdutoDestaque }) {
  const { addItem, openCart } = useCart();
  const fotos = [produto.imagem, ...(produto.imagensGaleria ?? [])];
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [tamanho, setTamanho] = useState<string | null>(null);

  const precisaTamanho = Boolean(produto.tamanhos && produto.tamanhos.length > 0);
  const tamanhoEscolhido = precisaTamanho ? tamanho : undefined;
  const podeAdicionar = !precisaTamanho || tamanho !== null;

  return (
    <section className="grid grid-cols-1 gap-10 px-5 py-28 sm:px-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-card">
          <Image
            src={fotos[fotoAtiva].url}
            alt={fotos[fotoAtiva].alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {fotos.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {fotos.map((foto, index) => (
              <button
                key={`${foto.url}-${index}`}
                type="button"
                onClick={() => setFotoAtiva(index)}
                aria-label={`Ver foto ${index + 1} de ${fotos.length}`}
                aria-current={index === fotoAtiva}
                className={`relative aspect-[4/5] overflow-hidden rounded-sm bg-card ring-1 transition-colors ${
                  index === fotoAtiva ? "ring-red" : "ring-line hover:ring-white/40"
                }`}
              >
                <Image src={foto.url} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <p className="font-mono-label text-xs text-red">{produto.categoria}</p>
        <h1 className="font-display mt-3 text-3xl text-white sm:text-4xl">{produto.nome}</h1>
        <p className="mt-3 text-lg text-white">{formatarPreco(produto.precoCentavos)}</p>
        {produto.descricao && <p className="mt-6 max-w-md text-sm leading-relaxed text-gray">{produto.descricao}</p>}

        {precisaTamanho && (
          <fieldset className="mt-8">
            <legend className="font-mono-label text-[11px] text-gray">Tamanho</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {produto.tamanhos?.map((variante) => (
                <button
                  key={variante.tamanho}
                  type="button"
                  disabled={variante.disponivel === false}
                  onClick={() => setTamanho(variante.tamanho)}
                  aria-pressed={tamanho === variante.tamanho}
                  className={`font-mono-label min-w-11 rounded-sm border px-3.5 py-2.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    tamanho === variante.tamanho
                      ? "border-red bg-red text-white"
                      : "border-line text-white/80 hover:border-white/50"
                  }`}
                >
                  {variante.tamanho}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <button
          type="button"
          disabled={!podeAdicionar}
          onClick={() => {
            addItem(produto, tamanhoEscolhido ?? undefined);
            openCart();
          }}
          className="font-mono-label mt-8 w-full max-w-xs rounded-full bg-red py-3.5 text-xs text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {precisaTamanho && !tamanho ? "Escolha um tamanho" : "Adicionar a sacola"}
        </button>
      </div>
    </section>
  );
}
