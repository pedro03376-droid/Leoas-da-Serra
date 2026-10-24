"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
        {FILTROS.map((item) => {
          const ativo = filtro === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFiltro(item.value)}
              aria-pressed={ativo}
              className={`font-mono-label relative rounded-full border px-4 py-2 text-xs transition-colors ${
                ativo ? "border-red text-white" : "border-line text-white/70 hover:border-red hover:text-white"
              }`}
            >
              {ativo && (
                <motion.span
                  layoutId="filtro-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-red"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filtro}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
        >
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto._id} produto={produto} />
          ))}
        </motion.div>
      </AnimatePresence>

      {produtosFiltrados.length === 0 && <p className="mt-10 text-sm text-gray">Nenhum produto nesta categoria.</p>}
    </section>
  );
}
