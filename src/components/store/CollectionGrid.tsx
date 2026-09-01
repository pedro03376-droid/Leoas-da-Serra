"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { CategoriaProduto, ProdutoDestaque } from "@/types/content";

const FILTROS: { label: string; value: CategoriaProduto | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Camisas", value: "camisa" },
  { label: "Acessorios", value: "acessorio" },
  { label: "Colecao", value: "colecao" },
];

/** Colecao curada com filtro por categoria. */
export function CollectionGrid({ produtos }: { produtos: ProdutoDestaque[] }) {
  const [filtro, setFiltro] = useState<CategoriaProduto | "todos">("todos");

  const produtosFiltrados = filtro === "todos" ? produtos : produtos.filter((produto) => produto.categoria === filtro);

  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar colecao por categoria">
        {FILTROS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFiltro(item.value)}
            aria-pressed={filtro === item.value}
            className={`font-mono-label rounded-full border px-4 py-2 text-xs transition-colors ${
              filtro === item.value
                ? "border-red bg-red text-white"
                : "border-line text-white/70 hover:border-red hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {produtosFiltrados.map((produto) => (
          <ProductCard key={produto._id} produto={produto} />
        ))}
      </div>

      {produtosFiltrados.length === 0 && <p className="mt-10 text-sm text-gray">Nenhum produto nesta categoria.</p>}
    </section>
  );
}
