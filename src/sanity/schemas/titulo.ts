import { defineField, defineType } from "./defineHelpers";

export const titulo = defineType({
  name: "titulo",
  title: "Titulo conquistado",
  type: "document",
  fields: [
    defineField({ name: "competicao", title: "Competicao", type: "string", validation: (r) => r.required() }),
    defineField({ name: "temporada", title: "Temporada", type: "string", validation: (r) => r.required() }),
    defineField({ name: "conquistadoEm", title: "Conquistado em", type: "date", validation: (r) => r.required() }),
  ],
});
