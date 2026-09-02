import "server-only";
import { sanityFetch } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  atletaPorSlugQuery,
  elencoQuery,
  jogoPorSlugQuery,
  jogosQuery,
  noticiasQuery,
  parceirosQuery,
  produtoPorSlugQuery,
  produtosDestaqueQuery,
  proximoJogoQuery,
  temporadaAtualQuery,
  titulosQuery,
} from "@/sanity/queries";
import type { Atleta, Jogo, Noticia, Parceiro, ProdutoDestaque, Temporada, Titulo } from "@/types/content";
import {
  ELENCO_PLACEHOLDER,
  JOGOS_PLACEHOLDER,
  NOTICIAS_PLACEHOLDER,
  PRODUTOS_PLACEHOLDER,
  PROXIMO_JOGO_PLACEHOLDER,
  TEMPORADA_PLACEHOLDER,
  TITULOS_REAIS,
} from "@/lib/placeholders";

/**
 * Camada de leitura de conteudo: quando o Sanity nao esta configurado
 * (sem SANITY_PROJECT_ID), cai automaticamente nos placeholders locais —
 * o site nunca quebra por falta de CMS, so mostra dados provisorios.
 */

export async function getProximoJogo(): Promise<Jogo> {
  if (!isSanityConfigured) return PROXIMO_JOGO_PLACEHOLDER;
  const jogo = await sanityFetch<Jogo | null>(proximoJogoQuery);
  return jogo ?? PROXIMO_JOGO_PLACEHOLDER;
}

export async function getJogos(): Promise<Jogo[]> {
  if (!isSanityConfigured) return JOGOS_PLACEHOLDER;
  const jogos = await sanityFetch<Jogo[]>(jogosQuery);
  return jogos.length > 0 ? jogos : JOGOS_PLACEHOLDER;
}

export async function getJogoPorSlug(slug: string): Promise<Jogo | null> {
  if (!isSanityConfigured) {
    return JOGOS_PLACEHOLDER.find((jogo) => jogo.slug === slug) ?? null;
  }
  const jogo = await sanityFetch<Jogo | null>(jogoPorSlugQuery, { slug });
  return jogo ?? JOGOS_PLACEHOLDER.find((j) => j.slug === slug) ?? null;
}

export async function getNoticias(): Promise<Noticia[]> {
  if (!isSanityConfigured) return NOTICIAS_PLACEHOLDER;
  const noticias = await sanityFetch<Noticia[]>(noticiasQuery);
  return noticias.length > 0 ? noticias : NOTICIAS_PLACEHOLDER;
}

export async function getTitulos(): Promise<Titulo[]> {
  if (!isSanityConfigured) return TITULOS_REAIS;
  const titulos = await sanityFetch<Titulo[]>(titulosQuery);
  return titulos.length > 0 ? titulos : TITULOS_REAIS;
}

export async function getTemporadaAtual(): Promise<Temporada> {
  if (!isSanityConfigured) return TEMPORADA_PLACEHOLDER;
  const temporada = await sanityFetch<Temporada | null>(temporadaAtualQuery);
  return temporada ?? TEMPORADA_PLACEHOLDER;
}

export async function getElenco(): Promise<Atleta[]> {
  if (!isSanityConfigured) return ELENCO_PLACEHOLDER;
  const elenco = await sanityFetch<Atleta[]>(elencoQuery);
  return elenco.length > 0 ? elenco : ELENCO_PLACEHOLDER;
}

export async function getAtletaPorSlug(slug: string): Promise<Atleta | null> {
  if (!isSanityConfigured) {
    return ELENCO_PLACEHOLDER.find((atleta) => atleta.slug === slug) ?? null;
  }
  const atleta = await sanityFetch<Atleta | null>(atletaPorSlugQuery, { slug });
  return atleta ?? ELENCO_PLACEHOLDER.find((a) => a.slug === slug) ?? null;
}

export async function getParceiros(): Promise<Parceiro[]> {
  if (!isSanityConfigured) return [];
  return sanityFetch<Parceiro[]>(parceirosQuery);
}

export async function getProdutosDestaque(): Promise<ProdutoDestaque[]> {
  if (!isSanityConfigured) return PRODUTOS_PLACEHOLDER;
  const produtos = await sanityFetch<ProdutoDestaque[]>(produtosDestaqueQuery);
  return produtos.length > 0 ? produtos : PRODUTOS_PLACEHOLDER;
}

export async function getProdutoPorSlug(slug: string): Promise<ProdutoDestaque | null> {
  if (!isSanityConfigured) {
    return PRODUTOS_PLACEHOLDER.find((produto) => produto.slug === slug) ?? null;
  }
  const produto = await sanityFetch<ProdutoDestaque | null>(produtoPorSlugQuery, { slug });
  return produto ?? PRODUTOS_PLACEHOLDER.find((p) => p.slug === slug) ?? null;
}
