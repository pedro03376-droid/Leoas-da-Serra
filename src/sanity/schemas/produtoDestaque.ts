import { defineField, defineType } from "./defineHelpers";

/**
 * Espelha, para fins de vitrine/curadoria editorial, um produto que existe
 * de fato na Nuvemshop (estoque, preco e checkout ficam la — ver
 * src/lib/nuvemshop). "variantesId" e a chave de ligacao entre os dois.
 */
export const produtoDestaque = defineType({
  name: "produtoDestaque",
  title: "Produto em destaque (Loja)",
  type: "document",
  fields: [
    defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nome" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "precoCentavos", title: "Preco (centavos)", type: "number", validation: (r) => r.required() }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "string",
      options: { list: ["camisa", "acessorio", "colecao"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "imagem",
      title: "Imagem principal",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Texto alternativo", type: "string" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "imagensGaleria",
      title: "Galeria",
      type: "array",
      of: [{ type: "image", fields: [{ name: "alt", title: "Texto alternativo", type: "string" }] }],
    }),
    defineField({ name: "descricao", title: "Descricao", type: "text" }),
    defineField({
      name: "variantesId",
      title: "ID do produto na Nuvemshop",
      description: "Usado direto so quando o produto NAO tem grade de tamanho (ver campo Tamanhos).",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tamanhos",
      title: "Tamanhos",
      description: "Deixe vazio para produtos sem grade (ex.: cachecol). Cada tamanho e uma variante/SKU propria na Nuvemshop.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "tamanho", title: "Tamanho (P, M, G, GG...)", type: "string" },
            { name: "variantesId", title: "ID da variante na Nuvemshop", type: "string" },
            { name: "disponivel", title: "Disponivel", type: "boolean", initialValue: true },
          ],
        },
      ],
    }),
    defineField({ name: "emCampanha", title: "Destaque de campanha (hero)", type: "boolean", initialValue: false }),
  ],
});
