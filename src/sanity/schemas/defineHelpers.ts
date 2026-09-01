/**
 * Substitutos leves de `defineField`/`defineType` (do pacote `sanity`).
 * Estes arquivos de schema sao a fonte de verdade do modelo de conteudo,
 * mas servem como REFERENCIA para colar num Sanity Studio real — nao
 * rodamos o Studio dentro deste app Next.js. Por isso nao instalamos o
 * pacote `sanity` completo (que traz CLI, codegen etc. e uma arvore de
 * dependencias pesada) so por causa de dois identity-helpers de tipo.
 */

/** Sombra minima da `Rule` do Sanity — o suficiente para tipar `validation: (r) => r.required()`. */
export interface Rule {
  required(): Rule;
}

interface FieldDefinition {
  name: string;
  title?: string;
  type: string;
  validation?: (rule: Rule) => Rule;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function defineField(field: FieldDefinition): FieldDefinition {
  return field;
}

export function defineType(type: FieldDefinition): FieldDefinition {
  return type;
}
