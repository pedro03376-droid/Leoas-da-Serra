import type {
  Atleta,
  EscalacaoAtleta,
  EventoJogo,
  Jogo,
  Noticia,
  Posicao,
  ProdutoDestaque,
  StatComparativa,
  Temporada,
  Titulo,
} from "@/types/content";

/**
 * Dados de fallback usados enquanto o Sanity nao esta configurado
 * (isSanityConfigured === false) ou enquanto um schema ainda nao tem
 * conteudo publicado. Titulos e competicoes abaixo sao REAIS; placares,
 * escalacoes, elenco e datas de jogo sao PROVISORIOS — TODO: substituir por
 * dados do CMS assim que disponiveis.
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

const FOTO_ATLETA_PLACEHOLDER = { url: "/placeholders/atleta.svg", alt: "", width: 480, height: 600 };

interface ElencoSeed {
  numero: number;
  posicao: Posicao;
  altura: string;
  stats: [string, string][];
}

// TODO: substituir pelo elenco real vindo do Sanity (schema `atleta`). Nomes,
// numeros e stats abaixo sao inventados so para preencher o layout editorial.
const ELENCO_SEED: ElencoSeed[] = [
  { numero: 1, posicao: "Goleira", altura: "1,68", stats: [["Defesas", "-"], ["Aproveitamento", "-"]] },
  { numero: 4, posicao: "Fixo", altura: "1,64", stats: [["Desarmes", "-"], ["Passes certos", "-"]] },
  { numero: 5, posicao: "Fixo", altura: "1,70", stats: [["Desarmes", "-"], ["Passes certos", "-"]] },
  { numero: 7, posicao: "Ala", altura: "1,60", stats: [["Gols", "-"], ["Assistencias", "-"]] },
  { numero: 8, posicao: "Ala", altura: "1,62", stats: [["Gols", "-"], ["Assistencias", "-"]] },
  { numero: 9, posicao: "Pivo", altura: "1,72", stats: [["Gols", "-"], ["Finalizacoes", "-"]] },
  { numero: 10, posicao: "Ala", altura: "1,58", stats: [["Gols", "-"], ["Assistencias", "-"]] },
  { numero: 11, posicao: "Pivo", altura: "1,75", stats: [["Gols", "-"], ["Finalizacoes", "-"]] },
  { numero: 12, posicao: "Goleira", altura: "1,71", stats: [["Defesas", "-"], ["Aproveitamento", "-"]] },
  { numero: 13, posicao: "Fixo", altura: "1,66", stats: [["Desarmes", "-"], ["Passes certos", "-"]] },
];

// Atleta real (nome, numero e posicao confirmados) — foto real ja usada na
// galeria do Uniforme 2. TODO: bio e stats reais quando disponiveis.
const LUIZA_BORTOLINI: Atleta = {
  _id: "atleta-luiza-bortolini",
  slug: "luiza-bortolini",
  nome: "Luiza Bortolini",
  numero: 98,
  posicao: "Fixo",
  foto: {
    url: "/products/uniforme-2/03-acao2.jpg",
    alt: "Luiza Bortolini, numero 98, fixo das Leoas da Serra",
    width: 1200,
    height: 1500,
  },
  bio: "TODO: biografia da atleta vinda do CMS.",
  midia: [
    {
      url: "/products/uniforme-2/03-acao2.jpg",
      alt: "Luiza Bortolini, numero 98, fixo das Leoas da Serra",
      width: 1200,
      height: 1500,
    },
  ],
};

// TODO: substituir pelo elenco real vindo do Sanity (schema `atleta`).
export const ELENCO_PLACEHOLDER: Atleta[] = [
  LUIZA_BORTOLINI,
  ...ELENCO_SEED.map((seed) => ({
    _id: `placeholder-atleta-${seed.numero}`,
    slug: `atleta-${seed.numero}`,
    nome: `Atleta ${String(seed.numero).padStart(2, "0")}`,
    numero: seed.numero,
    posicao: seed.posicao,
    altura: seed.altura,
    foto: FOTO_ATLETA_PLACEHOLDER,
    bio: "TODO: biografia da atleta vinda do CMS.",
    statsPosicao: seed.stats.map(([label, valor]) => ({ label, valor })),
    midia: [FOTO_ATLETA_PLACEHOLDER],
  })),
];

function escalacaoDe(numeros: number[]): EscalacaoAtleta[] {
  return ELENCO_PLACEHOLDER.filter((atleta) => numeros.includes(atleta.numero)).map((atleta) => ({
    atletaId: atleta._id,
    slug: atleta.slug,
    numero: atleta.numero,
    nome: atleta.nome,
    posicao: atleta.posicao,
    foto: atleta.foto,
    titular: true,
  }));
}

// Proximo jogo real: Leoas da Serra x Female Futsal, quartas de final da
// LFF 2026, no Ginasio Jones Minosso (Lages - SC). TODO: escalacao, stats
// e fotos do Match Center ainda dependem do CMS.
export const PROXIMO_JOGO_PLACEHOLDER: Jogo = {
  _id: "leoas-x-female-futsal-quartas-lff-2026",
  slug: "leoas-x-female-futsal-quartas-lff-2026",
  competicao: "Liga Feminina de Futsal · Quartas de Final",
  adversario: "Female Futsal",
  escudoAdversario: { url: "/brand/escudo-female-futsal.png", alt: "Escudo do Female Futsal", width: 423, height: 541 },
  dataHora: "2026-09-02T20:00:00-03:00",
  local: "Ginasio Jones Minosso, Lages - SC",
  mandante: true,
  ingressoUrl: undefined,
  transmissaoUrl: undefined,
  status: "agendado",
  placeholder: false,
};

const EVENTOS_PLACEHOLDER: EventoJogo[] = [
  { minuto: 8, tipo: "gol", time: "leoas", descricao: "TODO: autora do gol" },
  { minuto: 15, tipo: "cartao_amarelo", time: "adversario", descricao: "TODO: jogadora advertida" },
  { minuto: 27, tipo: "gol", time: "adversario", descricao: "TODO: autora do gol" },
  { minuto: 33, tipo: "gol", time: "leoas", descricao: "TODO: autora do gol" },
  { minuto: 38, tipo: "substituicao", time: "leoas", descricao: "TODO: jogadoras da substituicao" },
];

const STATS_COMPARATIVAS_PLACEHOLDER: StatComparativa[] = [
  { label: "Posse de bola", leoas: 58, adversario: 42 },
  { label: "Finalizacoes", leoas: 14, adversario: 9 },
  { label: "Finalizacoes certas", leoas: 8, adversario: 4 },
  { label: "Faltas", leoas: 6, adversario: 10 },
];

// TODO: substituir pelos jogos reais vindos do Sanity (schema `jogo`), com
// escalacao, timeline, stats e fotos vindos do Match Center de cada partida.
export const JOGOS_PLACEHOLDER: Jogo[] = [
  PROXIMO_JOGO_PLACEHOLDER,
  {
    _id: "placeholder-jogo-encerrado-1",
    slug: "leoas-x-adversario-1",
    competicao: "Liga Feminina de Futsal",
    adversario: "Adversario 1",
    escudoAdversario: { url: "/placeholders/escudo-adversario.svg", alt: "", width: 96, height: 96 },
    dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    local: "Ginasio Municipal, Lages - SC",
    mandante: true,
    placarLeoas: 4,
    placarAdversario: 2,
    status: "encerrado",
    escalacaoLeoas: escalacaoDe([1, 4, 5, 7, 9, 10, 11, 13]),
    eventos: EVENTOS_PLACEHOLDER,
    statsComparativas: STATS_COMPARATIVAS_PLACEHOLDER,
    fotos: [FOTO_ATLETA_PLACEHOLDER, FOTO_ATLETA_PLACEHOLDER, FOTO_ATLETA_PLACEHOLDER],
    placeholder: true,
  },
  {
    _id: "placeholder-jogo-encerrado-2",
    slug: "leoas-x-adversario-2",
    competicao: "Catarinense Serie Ouro",
    adversario: "Adversario 2",
    escudoAdversario: { url: "/placeholders/escudo-adversario.svg", alt: "", width: 96, height: 96 },
    dataHora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    local: "Ginasio Adversario 2",
    mandante: false,
    placarLeoas: 3,
    placarAdversario: 3,
    status: "encerrado",
    escalacaoLeoas: escalacaoDe([1, 4, 5, 8, 9, 10, 11, 12]),
    eventos: EVENTOS_PLACEHOLDER,
    statsComparativas: STATS_COMPARATIVAS_PLACEHOLDER,
    fotos: [FOTO_ATLETA_PLACEHOLDER, FOTO_ATLETA_PLACEHOLDER],
    placeholder: true,
  },
];

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

// Tamanhos reais da camisa oficial (levantados na planilha de pedidos do
// clube): unissex, "baby look" (corte feminino, prefixo BL) e infantil.
// TODO: variantesId de cada tamanho ainda depende da Nuvemshop conectada.
const TAMANHOS_CAMISA_OFICIAL = ["P", "M", "G", "GG", "XG", "BLG", "BLGG", "BLXG", "Infantil 12"].map((tamanho) => ({
  tamanho,
  variantesId: `TODO-nuvemshop-variant-camisa-oficial-${tamanho}`,
  disponivel: true,
}));

// Tamanhos reais do Uniforme 2 (planilha de pedidos do clube, pedidos +
// extras): unissex, "baby look" (prefixo BL) e infantil.
// TODO: variantesId de cada tamanho ainda depende da Nuvemshop conectada.
const TAMANHOS_UNIFORME_2 = [
  "P",
  "M",
  "G",
  "GG",
  "XG",
  "XGG",
  "BLM",
  "BLG",
  "BLP",
  "Infantil 10",
  "Infantil 14",
].map((tamanho) => ({
  tamanho,
  variantesId: `TODO-nuvemshop-variant-uniforme-2-${tamanho}`,
  disponivel: true,
}));

// Tamanhos reais do Uniforme 3 (planilha de pedidos do clube). Nuvemshop
// ja conectada: variantesId real confirmado por tamanho (testado no
// checkout), TODO nos que ainda faltam.
const TAMANHOS_UNIFORME_3 = [
  { tamanho: "M", variantesId: "1592194535" },
  { tamanho: "G", variantesId: "TODO-nuvemshop-variant-uniforme-3-G" },
  { tamanho: "GG", variantesId: "TODO-nuvemshop-variant-uniforme-3-GG" },
  { tamanho: "XG", variantesId: "TODO-nuvemshop-variant-uniforme-3-XG" },
  { tamanho: "XGG", variantesId: "TODO-nuvemshop-variant-uniforme-3-XGG" },
  { tamanho: "BLG", variantesId: "TODO-nuvemshop-variant-uniforme-3-BLG" },
].map((item) => ({ ...item, disponivel: true }));

// TODO: substituir pelos produtos reais da Nuvemshop/Sanity (schema
// `produtoDestaque`) — nome, preco, descricao, tamanhos e as 4-5 fotos de
// cada camisa (imagensGaleria) assim que estiverem prontos.
export const PRODUTOS_PLACEHOLDER: ProdutoDestaque[] = [
  {
    _id: "camisa-oficial-leoas-2026",
    nome: "Camisa Oficial Leoas da Serra",
    slug: "camisa-oficial",
    precoCentavos: 9900,
    categoria: "camisa",
    imagem: {
      url: "/products/camisa-oficial/01-frente.png",
      alt: "Camisa oficial Leoas da Serra, vista de frente",
      width: 1200,
      height: 1500,
    },
    imagensGaleria: [
      {
        url: "/products/camisa-oficial/02-dupla.jpg",
        alt: "Duas atletas das Leoas da Serra usando a camisa oficial em quadra",
        width: 1200,
        height: 1500,
      },
      {
        url: "/products/camisa-oficial/03-costas.jpg",
        alt: "Camisa oficial Leoas da Serra, vista de costas, com numero e nome",
        width: 1200,
        height: 1500,
      },
      {
        url: "/products/camisa-oficial/04-acao.jpg",
        alt: "Atleta das Leoas da Serra usando a camisa oficial durante jogo",
        width: 1200,
        height: 1500,
      },
    ],
    // TODO: descricao real do produto (tecido, patrocinadores, uniforme de jogo x replica etc.)
    descricao: "Camisa oficial das Leoas da Serra, usada em quadra pelo elenco na temporada 2026.",
    variantesId: "TODO-nuvemshop-product-id",
    tamanhos: TAMANHOS_CAMISA_OFICIAL,
    emCampanha: true,
  },
  {
    _id: "uniforme-2-leoas-2026",
    nome: "Uniforme 2 Leoas da Serra",
    slug: "uniforme-2",
    precoCentavos: 9900,
    categoria: "camisa",
    imagem: {
      url: "/products/uniforme-2/01-frente.png",
      alt: "Uniforme 2 (branco e vermelho) das Leoas da Serra, vista de frente",
      width: 1200,
      height: 1500,
    },
    imagensGaleria: [
      {
        url: "/products/uniforme-2/02-acao1.jpg",
        alt: "Atleta das Leoas da Serra usando o Uniforme 2 durante jogo",
        width: 1200,
        height: 1500,
      },
      {
        url: "/products/uniforme-2/03-acao2.jpg",
        alt: "Atleta das Leoas da Serra usando o Uniforme 2 em quadra",
        width: 1200,
        height: 1500,
      },
      {
        url: "/products/uniforme-2/04-costas.jpg",
        alt: "Uniforme 2 Leoas da Serra, vista de costas, com numero e nome",
        width: 1200,
        height: 1500,
      },
    ],
    // TODO: descricao real do produto (tecido, patrocinadores, uniforme de jogo x replica etc.)
    descricao: "Segundo uniforme das Leoas da Serra, usado em quadra pelo elenco na temporada 2026.",
    variantesId: "TODO-nuvemshop-product-id-uniforme-2",
    tamanhos: TAMANHOS_UNIFORME_2,
    emCampanha: true,
  },
  {
    _id: "uniforme-3-leoas-2026",
    nome: "Uniforme 3 Leoas da Serra",
    slug: "uniforme-3",
    precoCentavos: 9900,
    categoria: "camisa",
    imagem: {
      url: "/products/uniforme-3/01-frente.png",
      alt: "Uniforme 3 (amarelo e verde) das Leoas da Serra, vista de frente",
      width: 1200,
      height: 1500,
    },
    imagensGaleria: [
      {
        url: "/products/uniforme-3/02-acao1.jpg",
        alt: "Atleta das Leoas da Serra usando o Uniforme 3 durante jogo",
        width: 1200,
        height: 1500,
      },
      {
        url: "/products/uniforme-3/03-costas.jpg",
        alt: "Uniforme 3 Leoas da Serra, vista de costas, com numero e nome",
        width: 1200,
        height: 1500,
      },
      {
        url: "/products/uniforme-3/04-acao2.jpg",
        alt: "Atleta das Leoas da Serra usando o Uniforme 3 em quadra",
        width: 1200,
        height: 1500,
      },
    ],
    descricao: "Terceiro uniforme das Leoas da Serra, usado em quadra pelo elenco na temporada 2026.",
    variantesId: "TODO-nuvemshop-product-id-uniforme-3",
    tamanhos: TAMANHOS_UNIFORME_3,
  },
  // Camisa de Treino e Cachecol saem da loja ate ter foto real (hoje usam
  // o SVG generico /placeholders/camisa.svg) — volta quando tiver fotos.
];
