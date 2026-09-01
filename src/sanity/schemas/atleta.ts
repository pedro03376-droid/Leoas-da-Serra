import { defineField, defineType } from "./defineHelpers";

export const atleta = defineType({
  name: "atleta",
  title: "Atleta",
  type: "document",
  fields: [
    defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
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
  ],
});
