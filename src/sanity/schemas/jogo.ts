import { defineField, defineType } from "./defineHelpers";

export const jogo = defineType({
  name: "jogo",
  title: "Jogo",
  type: "document",
  fields: [
    defineField({ name: "competicao", title: "Competicao", type: "string", validation: (r) => r.required() }),
    defineField({ name: "adversario", title: "Adversario", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Usado na URL do Match Center: /jogos/<slug>",
      type: "slug",
      options: { source: (doc: { adversario?: string; dataHora?: string }) => `${doc.adversario ?? ""}-${doc.dataHora ?? ""}` },
      validation: (r) => r.required(),
    }),
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
    defineField({
      name: "escalacaoLeoas",
      title: "Escalacao (Leoas)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "atleta", title: "Atleta", type: "reference", to: [{ type: "atleta" }] },
            { name: "titular", title: "Titular", type: "boolean", initialValue: true },
          ],
        },
      ],
    }),
    defineField({
      name: "eventos",
      title: "Timeline (eventos da partida)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "minuto", title: "Minuto", type: "number" },
            {
              name: "tipo",
              title: "Tipo",
              type: "string",
              options: { list: ["gol", "cartao_amarelo", "cartao_vermelho", "substituicao", "timeout"] },
            },
            { name: "time", title: "Time", type: "string", options: { list: ["leoas", "adversario"] } },
            { name: "descricao", title: "Descricao", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "statsComparativas",
      title: "Estatisticas comparativas",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "leoas", title: "Leoas", type: "number" },
            { name: "adversario", title: "Adversario", type: "number" },
          ],
        },
      ],
    }),
    defineField({
      name: "fotos",
      title: "Fotos da partida",
      type: "array",
      of: [{ type: "image", fields: [{ name: "alt", title: "Texto alternativo", type: "string" }] }],
    }),
  ],
});
