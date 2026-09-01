/**
 * Modelos de conteudo que espelham os schemas do Sanity (ver src/sanity/schemas).
 * O site consome estes tipos tanto vindos do CMS quanto dos placeholders locais.
 */

export interface SanityImageRef {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Atleta {
  _id: string;
  nome: string;
  numero: number;
  posicao: "Goleira" | "Fixo" | "Ala" | "Pivo";
  altura?: string;
  foto: SanityImageRef;
  bio?: string;
}

export interface Jogo {
  _id: string;
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

export interface ProdutoDestaque {
  _id: string;
  nome: string;
  slug: string;
  precoCentavos: number;
  categoria: CategoriaProduto;
  imagem: SanityImageRef;
  imagensGaleria?: SanityImageRef[];
  descricao?: string;
  variantesId: string; // referencia ao produto na Nuvemshop
  emCampanha?: boolean;
}
