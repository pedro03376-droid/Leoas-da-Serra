"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";
import { onCheckout } from "@/lib/nuvemshop";
import { formatarPreco } from "@/lib/format";

/** Sacola lateral: checkout agnostico chamando onCheckout() -> Nuvemshop. */
export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, totalCentavos } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Sacola"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-sm flex-col border-l border-line bg-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-xl text-white">Sacola</h2>
              <button
                type="button"
                onClick={closeCart}
                className="font-mono-label text-xs text-white/70 hover:text-red"
              >
                Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <p className="text-sm text-gray">Sua sacola esta vazia.</p>
              ) : (
                <ul className="space-y-6">
                  {lines.map((line) => (
                    <li key={line.produto._id} className="flex gap-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-card">
                        <Image src={line.produto.imagem.url} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm text-white">{line.produto.nome}</span>
                        <span className="mt-1 text-xs text-gray">Qtd. {line.quantidade}</span>
                        <span className="mt-1 text-sm text-white">{formatarPreco(line.produto.precoCentavos)}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(line.produto._id)}
                          className="font-mono-label mt-2 w-fit text-[11px] text-gray hover:text-red"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-line px-6 py-6">
              <div className="flex items-center justify-between text-sm text-white">
                <span>Total</span>
                <span className="font-display text-xl">{formatarPreco(totalCentavos)}</span>
              </div>
              <button
                type="button"
                disabled={lines.length === 0}
                onClick={() =>
                  onCheckout(lines.map((line) => ({ variantesId: line.produto.variantesId, quantidade: line.quantidade })))
                }
                className="font-mono-label mt-4 w-full rounded-full bg-red py-3 text-xs text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Finalizar compra
              </button>
              <p className="mt-3 text-center text-[11px] text-gray">
                Voce sera redirecionado para o checkout seguro da nossa loja.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
