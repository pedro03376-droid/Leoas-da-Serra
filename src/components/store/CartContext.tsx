"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ProdutoDestaque } from "@/types/content";

interface CartLine {
  produto: ProdutoDestaque;
  quantidade: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (produto: ProdutoDestaque) => void;
  removeItem: (produtoId: string) => void;
  totalCentavos: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (produto: ProdutoDestaque) => {
    setLines((current) => {
      const existing = current.find((line) => line.produto._id === produto._id);
      if (existing) {
        return current.map((line) =>
          line.produto._id === produto._id ? { ...line, quantidade: line.quantidade + 1 } : line,
        );
      }
      return [...current, { produto, quantidade: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (produtoId: string) => {
    setLines((current) => current.filter((line) => line.produto._id !== produtoId));
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
