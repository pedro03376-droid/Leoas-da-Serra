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

// TODO: substituir pelo elenco real vindo do Sanity (schema `atleta`).
export const ELENCO_PLACEHOLDER: Atleta[] = ELENCO_SEED.map((seed) => ({
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
}));

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

// TODO: substituir pelo proximo jogo real vindo do Sanity (schema `jogo`).
export const PROXIMO_JOGO_PLACEHOLDER: Jogo = {
  _id: "placeholder-proximo-jogo",
  slug: "proximo-jogo",
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
