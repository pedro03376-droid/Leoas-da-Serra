import { defineField, defineType } from "./defineHelpers";

export const parceiro = defineType({
  name: "parceiro",
  title: "Parceiro",
  type: "document",
  fields: [
    defineField({ name: "nome", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      fields: [{ name: "alt", title: "Texto alternativo", type: "string" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "nivel",
      title: "Nivel",
      type: "string",
      options: { list: ["master", "oficial", "apoio"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "url", title: "URL", type: "url" }),
  ],
});
