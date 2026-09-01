"use client";

/**
 * Checkout agnostico de provedor. O site nunca implementa carrinho/pagamento
 * proprio — onCheckout() delega para a Nuvemshop, que cuida de estoque,
 * pagamento, nota fiscal e frete (ver 07 CMS e Seguranca no prompt).
 *
 * TODO: trocar STORE_URL pelo dominio real da loja Nuvemshop e, se a
 * integracao usar o Nuvemshop Buy Button / Checkout API em vez de um link
 * direto, substituir o corpo desta funcao mantendo a mesma assinatura.
 */

const STORE_URL = process.env.NEXT_PUBLIC_NUVEMSHOP_STORE_URL ?? "https://TODO.lojavirtualnuvem.com.br";

export interface CheckoutItem {
  variantesId: string;
  quantidade: number;
}

/**
 * Resolve o variantesId certo pra mandar no checkout: se a jogadora
 * escolheu um tamanho, e a variante daquele tamanho (cada tamanho e um
 * SKU proprio na Nuvemshop); senao, o variantesId do produto em si
 * (produtos sem grade, como o cachecol).
 */
export function resolverVariantesId(produto: { variantesId: string; tamanhos?: { tamanho: string; variantesId: string }[] }, tamanho?: string): string {
  if (!tamanho) return produto.variantesId;
  return produto.tamanhos?.find((v) => v.tamanho === tamanho)?.variantesId ?? produto.variantesId;
}

export function onCheckout(items: CheckoutItem[]): void {
  if (items.length === 0) return;

  const params = new URLSearchParams();
  items.forEach((item) => params.append("add", `${item.variantesId}:${item.quantidade}`));

  // Navegacao proposital para um dominio externo (Nuvemshop) — nao uma rota interna do Next.js.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `${STORE_URL}/checkout?${params.toString()}`;
}
