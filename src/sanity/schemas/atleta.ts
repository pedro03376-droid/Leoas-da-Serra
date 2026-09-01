import { defineField, defineType } from "./defineHelpers";

export const atleta = defineType({
  name: "atleta",
  title: "Atleta",
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
    defineField({ name: "numero", title: "Numero", type: "number", validation: (r) => r.required() }),
    defineField({
      name: "posicao",
      title: "Posicao",
      type: "string",
      options: { list: ["Goleira", "Fixo", "Ala", "Pivo"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "altura", title: "Altura", type: "string" }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Texto alternativo", type: "string" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "bio", title: "Biografia", type: "text" }),
    defineField({
      name: "statsPosicao",
      title: "Estatisticas (por posicao)",
      description: "Ex.: Defesas, Aproveitamento, Gols, Assistencias — livre por posicao.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "valor", title: "Valor", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "midia",
      title: "Galeria de midia",
      type: "array",
      of: [{ type: "image", fields: [{ name: "alt", title: "Texto alternativo", type: "string" }] }],
    }),
  ],
});
