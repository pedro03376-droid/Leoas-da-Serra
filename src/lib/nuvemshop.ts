"use client";

/**
 * Checkout agnostico de provedor. O site nunca implementa carrinho/pagamento
 * proprio — onCheckout() delega para a Nuvemshop, que cuida de estoque,
 * pagamento, nota fiscal e frete (ver 07 CMS e Seguranca no prompt).
 *
 * Formato do link de compra direta da Nuvemshop (confirmado na central de
 * ajuda deles): https://{loja}/comprar/{idVariante}-{quantidade} — adiciona
 * essa variante ao carrinho da sessao do navegador e leva pra pagina do
 * carrinho. Limitacao da propria Nuvemshop: cada link so aceita UMA
 * variante por vez, nao da pra combinar produtos diferentes num unico link.
 * Por isso, com mais de um item na sacola, abrimos um link por item extra
 * numa aba em segundo plano (todos caem no mesmo carrinho, por serem da
 * mesma sessao/cookie da loja) e navegamos a aba principal pro primeiro.
 *
 * TODO: se a Nuvemshop tiver o Buy Button / Checkout API disponivel no
 * plano de voces, trocar por isso resolve a limitacao de multiplos itens
 * de vez — mas exige integrar o SDK deles em vez de um link direto.
 */

const STORE_URL = process.env.NEXT_PUBLIC_NUVEMSHOP_STORE_URL ?? "https://leoasdaserra.lojavirtualnuvem.com.br";

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

function linkComprar(item: CheckoutItem): string {
  return `${STORE_URL}/comprar/${item.variantesId}-${item.quantidade}`;
}

export function onCheckout(items: CheckoutItem[]): void {
  if (items.length === 0) return;

  const [primeiro, ...resto] = items;
  resto.forEach((item) => window.open(linkComprar(item), "_blank"));

  // Navegacao proposital para um dominio externo (Nuvemshop) — nao uma rota interna do Next.js.
  window.location.href = linkComprar(primeiro);
}
