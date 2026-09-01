import { defineField, defineType } from "./defineHelpers";

export const temporada = defineType({
  name: "temporada",
  title: "Temporada",
  type: "document",
  fields: [
    defineField({ name: "ano", title: "Ano", type: "string", validation: (r) => r.required() }),
    defineField({ name: "vitorias", title: "Vitorias", type: "number", initialValue: 0 }),
    defineField({ name: "empates", title: "Empates", type: "number", initialValue: 0 }),
    defineField({ name: "derrotas", title: "Derrotas", type: "number", initialValue: 0 }),
    defineField({ name: "golsPro", title: "Gols pro", type: "number", initialValue: 0 }),
    defineField({ name: "golsContra", title: "Gols contra", type: "number", initialValue: 0 }),
  ],
});
