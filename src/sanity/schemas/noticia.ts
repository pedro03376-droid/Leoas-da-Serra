import { defineField, defineType } from "./defineHelpers";

export const noticia = defineType({
  name: "noticia",
  title: "Noticia",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Titulo", type: "string", validation: (r) => r.required() }),
    defineField({ name: "resumo", title: "Resumo", type: "text", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titulo" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "capa",
      title: "Capa",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Texto alternativo", type: "string" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "corpo", title: "Corpo", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "publicadoEm", title: "Publicado em", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "destaque", title: "Destaque na home", type: "boolean", initialValue: false }),
  ],
});
