/**
 * Modelos de conteudo que espelham os schemas do Sanity (ver src/sanity/schemas).
 * O site consome estes tipos tanto vindos do CMS quanto dos placeholders locais.
 */

export interface SanityImageRef {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Ponto focal definido no Studio (hotspot), fracoes de 0 a 1. Ausente nas imagens locais/placeholder. */
  hotspot?: { x: number; y: number };
}

export type Posicao = "Goleira" | "Fixo" | "Ala" | "Pivo";

export interface StatAtleta {
  label: string;
  valor: string;
}

export interface Atleta {
  _id: string;
  slug: string;
  nome: string;
  numero: number;
  posicao: Posicao;
  altura?: string;
  foto: SanityImageRef;
  bio?: string;
  /** Estatisticas especificas da posicao (ex.: defesas para goleira, gols para pivo). */
  statsPosicao?: StatAtleta[];
  /** Galeria de fotos do perfil, alem da foto principal. */
  midia?: SanityImageRef[];
}

/** Jogadora escalada num jogo — copia leve dos dados de Atleta no momento da partida. */
export interface EscalacaoAtleta {
  atletaId: string;
  slug: string;
  numero: number;
  nome: string;
  posicao: Posicao;
  foto?: SanityImageRef;
  titular: boolean;
}

export type TipoEvento = "gol" | "cartao_amarelo" | "cartao_vermelho" | "substituicao" | "timeout";

export interface EventoJogo {
  minuto: number;
  tipo: TipoEvento;
  time: "leoas" | "adversario";
  descricao: string;
}

export interface StatComparativa {
  label: string;
  leoas: number;
  adversario: number;
}

export interface Jogo {
  _id: string;
  slug: string;
  competicao: string;
  adversario: string;
  escudoAdversario: SanityImageRef;
  dataHora: string; // ISO
  local: string;
  mandante: boolean;
  placarLeoas?: number;
  placarAdversario?: number;
  transmissaoUrl?: string;
  ingressoUrl?: string;
  status: "agendado" | "ao_vivo" | "encerrado";
  /** Match Center: presentes so em jogos com cobertura completa (Fase 2). */
  escalacaoLeoas?: EscalacaoAtleta[];
  eventos?: EventoJogo[];
  statsComparativas?: StatComparativa[];
  fotos?: SanityImageRef[];
  /** PLACEHOLDER: dados provisorios ate virem do CMS. */
  placeholder?: boolean;
}

export interface Noticia {
  _id: string;
  titulo: string;
  resumo: string;
  slug: string;
  capa: SanityImageRef;
  publicadoEm: string; // ISO
  destaque?: boolean;
}

export interface Titulo {
  _id: string;
  competicao: string;
  temporada: string;
  conquistadoEm: string; // ISO
}

export interface Temporada {
  _id: string;
  ano: string;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
}

export interface Parceiro {
  _id: string;
  nome: string;
  logo: SanityImageRef;
  nivel: "master" | "oficial" | "apoio";
  url?: string;
}

export type CategoriaProduto = "camisa" | "acessorio" | "colecao";

/**
 * Cada tamanho e um SKU/variante proprio na Nuvemshop (o normal em qualquer
 * loja real — "Camisa P" e "Camisa M" sao produtos/variantes diferentes,
 * nao o mesmo variantesId com um rotulo de tamanho colado por cima).
 */
export interface VarianteTamanho {
  tamanho: string;
  variantesId: string;
  disponivel?: boolean;
}

export interface ProdutoDestaque {
  _id: string;
  nome: string;
  slug: string;
  precoCentavos: number;
  categoria: CategoriaProduto;
  imagem: SanityImageRef;
  imagensGaleria?: SanityImageRef[];
  descricao?: string;
  /** Referencia ao produto na Nuvemshop — usada direto so quando o produto nao tem tamanhos. */
  variantesId: string;
  /** Ausente = produto sem grade de tamanho (ex.: cachecol). */
  tamanhos?: VarianteTamanho[];
  emCampanha?: boolean;
  /** Peso e dimensoes do pacote (1 unidade), usados so na estimativa de frete. */
  pacote?: PacoteEnvio;
}

export interface PacoteEnvio {
  pesoKg: number;
  alturaCm: number;
  larguraCm: number;
  comprimentoCm: number;
}
