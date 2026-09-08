"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ProdutoDestaque } from "@/types/content";

export interface CartLine {
  produto: ProdutoDestaque;
  quantidade: number;
  /** Ausente para produtos sem grade de tamanho. */
  tamanho?: string;
}

/** Duas linhas do mesmo produto so sao "a mesma linha" se o tamanho tambem bater. */
function mesmaLinha(a: { produtoId: string; tamanho?: string }, b: { produtoId: string; tamanho?: string }) {
  return a.produtoId === b.produtoId && a.tamanho === b.tamanho;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (produto: ProdutoDestaque, tamanho?: string) => void;
  removeItem: (produtoId: string, tamanho?: string) => void;
  clearCart: () => void;
  totalCentavos: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (produto: ProdutoDestaque, tamanho?: string) => {
    setLines((current) => {
      const alvo = { produtoId: produto._id, tamanho };
      const existing = current.find((line) => mesmaLinha({ produtoId: line.produto._id, tamanho: line.tamanho }, alvo));
      if (existing) {
        return current.map((line) =>
          mesmaLinha({ produtoId: line.produto._id, tamanho: line.tamanho }, alvo)
            ? { ...line, quantidade: line.quantidade + 1 }
            : line,
        );
      }
      return [...current, { produto, quantidade: 1, tamanho }];
    });
    setIsOpen(true);
  };

  const removeItem = (produtoId: string, tamanho?: string) => {
    const alvo = { produtoId, tamanho };
    setLines((current) => current.filter((line) => !mesmaLinha({ produtoId: line.produto._id, tamanho: line.tamanho }, alvo)));
  };

  const totalCentavos = useMemo(
    () => lines.reduce((total, line) => total + line.produto.precoCentavos * line.quantidade, 0),
    [lines],
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        clearCart: () => setLines([]),
        totalCentavos,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return context;
}
