export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * CSS object-position a partir do hotspot (ponto focal) definido no Sanity
 * Studio. Sem hotspot (imagem local/placeholder), cai no centro.
 */
export function objectPositionFrom(imagem?: { hotspot?: { x: number; y: number } }): string {
  if (!imagem?.hotspot) return "50% 50%";
  return `${imagem.hotspot.x * 100}% ${imagem.hotspot.y * 100}%`;
}
