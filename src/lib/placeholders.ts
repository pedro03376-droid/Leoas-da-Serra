import type { Atleta, Jogo, Noticia, ProdutoDestaque, Temporada, Titulo } from "@/types/content";

/**
 * Dados de fallback usados enquanto o Sanity nao esta configurado
 * (isSanityConfigured === false) ou enquanto um schema ainda nao tem
 * conteudo publicado. Titulos e competicoes abaixo sao REAIS; placares,
 * escalacoes e datas de jogo sao PROVISORIOS — TODO: substituir por dados
 * do CMS assim que disponiveis.
 */

export const TITULOS_REAIS: Titulo[] = [
  { _id: "liga-feminina-2025", competicao: "Liga Feminina de Futsal", temporada: "2025", conquistadoEm: "2025-12-01" },
  { _id: "catarinense-ouro-2025", competicao: "Catarinense Serie Ouro", temporada: "2025", conquistadoEm: "2025-10-01" },
  { _id: "copa-do-brasil-2025-vice", competicao: "Copa do Brasil (vice)", temporada: "2025", conquistadoEm: "2025-08-01" },
];

export const COMPETICOES = [
  "Liga Feminina de Futsal",
  "Catarinense Serie Ouro",
  "Copa do Brasil",
  "Supercopa",
  "Taca Brasil",
  "JUCS",
  "JASC",
];

// TODO: substituir pelo proximo jogo real vindo do Sanity (schema `jogo`).
export const PROXIMO_JOGO_PLACEHOLDER: Jogo = {
  _id: "placeholder-proximo-jogo",
  competicao: "Liga Feminina de Futsal",
  adversario: "A definir",
  escudoAdversario: { url: "/placeholders/escudo-adversario.svg", alt: "Escudo do adversario", width: 96, height: 96 },
  dataHora: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  local: "Ginasio Municipal, Lages - SC",
  mandante: true,
  ingressoUrl: undefined,
  transmissaoUrl: undefined,
  status: "agendado",
  placeholder: true,
};

// TODO: substituir pela temporada real vinda do Sanity (schema `temporada`).
export const TEMPORADA_PLACEHOLDER: Temporada = {
  _id: "placeholder-temporada",
  ano: "2026",
  vitorias: 0,
  empates: 0,
  derrotas: 0,
  golsPro: 0,
  golsContra: 0,
};

// TODO: substituir pelas noticias reais vindas do Sanity (schema `noticia`).
export const NOTICIAS_PLACEHOLDER: Noticia[] = Array.from({ length: 5 }).map((_, index) => ({
  _id: `placeholder-noticia-${index}`,
  titulo: "TODO: titulo da noticia",
  resumo: "TODO: resumo da noticia vindo do CMS.",
  slug: `noticia-${index}`,
  capa: { url: "/placeholders/noticia.svg", alt: "", width: 800, height: 600 },
  publicadoEm: new Date().toISOString(),
  destaque: index === 0,
}));

// TODO: substituir pelo elenco real vindo do Sanity (schema `atleta`).
export const ELENCO_PLACEHOLDER: Atleta[] = [];

// TODO: substituir pelos produtos reais da Nuvemshop/Sanity (schema `produtoDestaque`).
export const PRODUTOS_PLACEHOLDER: ProdutoDestaque[] = [
  {
    _id: "placeholder-camisa-oficial",
    nome: "Camisa Oficial Leoas da Serra",
    slug: "camisa-oficial",
    precoCentavos: 24900,
    categoria: "camisa",
    imagem: { url: "/placeholders/camisa.svg", alt: "Camisa oficial Leoas da Serra", width: 800, height: 1000 },
    descricao: "TODO: descricao real do produto vinda da Nuvemshop.",
    variantesId: "TODO-nuvemshop-product-id",
    emCampanha: true,
  },
  {
    _id: "placeholder-camisa-treino",
    nome: "Camisa de Treino",
    slug: "camisa-treino",
    precoCentavos: 15900,
    categoria: "camisa",
    imagem: { url: "/placeholders/camisa.svg", alt: "Camisa de treino Leoas da Serra", width: 800, height: 1000 },
    descricao: "TODO: descricao real do produto vinda da Nuvemshop.",
    variantesId: "TODO-nuvemshop-product-id-2",
  },
  {
    _id: "placeholder-cachecol",
    nome: "Cachecol Leoas da Serra",
    slug: "cachecol",
    precoCentavos: 6900,
    categoria: "acessorio",
    imagem: { url: "/placeholders/camisa.svg", alt: "Cachecol Leoas da Serra", width: 800, height: 1000 },
    descricao: "TODO: descricao real do produto vinda da Nuvemshop.",
    variantesId: "TODO-nuvemshop-product-id-3",
  },
];
