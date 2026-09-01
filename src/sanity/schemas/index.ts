import { atleta } from "./atleta";
import { jogo } from "./jogo";
import { noticia } from "./noticia";
import { titulo } from "./titulo";
import { temporada } from "./temporada";
import { parceiro } from "./parceiro";
import { produtoDestaque } from "./produtoDestaque";

/**
 * Fonte de verdade dos schemas do CMS. Estes arquivos definem o modelo de
 * conteudo (usado por src/sanity/queries.ts e src/types/content.ts) e devem
 * ser copiados para o `schema.types` de um projeto Sanity Studio real
 * (`npx sanity init`) quando o CMS for provisionado — ver README.md.
 */
export const schemaTypes = [atleta, jogo, noticia, titulo, temporada, parceiro, produtoDestaque];
