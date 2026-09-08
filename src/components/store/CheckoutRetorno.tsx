"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";

const CONTEUDO: Record<string, { titulo: string; texto: string }> = {
  success: {
    titulo: "Pagamento aprovado!",
    texto: "Recebemos seu pedido e ja vamos preparar o envio. Confirmamos tudo por e-mail.",
  },
  pending: {
    titulo: "Pagamento em analise",
    texto: "Assim que o pagamento for confirmado (ex.: boleto ou Pix ainda processando), avisamos por e-mail.",
  },
  failure: {
    titulo: "Nao foi possivel concluir o pagamento",
    texto: "O pagamento nao foi aprovado. Nenhum valor foi cobrado — pode tentar novamente.",
  },
};

export function CheckoutRetorno({ status }: { status: string }) {
  const { clearCart } = useCart();
  const info = CONTEUDO[status] ?? CONTEUDO.pending;

  useEffect(() => {
    if (status === "success") clearCart();
    // Roda so uma vez, ao carregar a pagina de retorno.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <section className="px-5 py-32 sm:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl text-white">{info.titulo}</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray">{info.texto}</p>
        <Link
          href="/loja"
          className="font-mono-label mt-8 inline-block rounded-full border border-line px-6 py-3 text-xs text-white/80 transition-colors hover:border-white/50"
        >
          Voltar pra loja
        </Link>
      </div>
    </section>
  );
}
