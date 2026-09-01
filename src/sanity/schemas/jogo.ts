import { defineField, defineType } from "./defineHelpers";

export const jogo = defineType({
  name: "jogo",
  title: "Jogo",
  type: "document",
  fields: [
    defineField({ name: "competicao", title: "Competicao", type: "string", validation: (r) => r.required() }),
    defineField({ name: "adversario", title: "Adversario", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "escudoAdversario",
      title: "Escudo do adversario",
      type: "image",
      fields: [{ name: "alt", title: "Texto alternativo", type: "string" }],
    }),
    defineField({ name: "dataHora", title: "Data e hora", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "local", title: "Local", type: "string", validation: (r) => r.required() }),
    defineField({ name: "mandante", title: "Leoas manda o jogo", type: "boolean", initialValue: true }),
    defineField({ name: "placarLeoas", title: "Placar Leoas", type: "number" }),
    defineField({ name: "placarAdversario", title: "Placar adversario", type: "number" }),
    defineField({ name: "transmissaoUrl", title: "URL de transmissao", type: "url" }),
    defineField({ name: "ingressoUrl", title: "URL de ingressos", type: "url" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["agendado", "ao_vivo", "encerrado"] },
      initialValue: "agendado",
    }),
  ],
});
