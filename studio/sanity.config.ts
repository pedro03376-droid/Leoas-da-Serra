import { defineConfig, type SchemaTypeDefinition } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../src/sanity/schemas";

// Os schemas usam um shim leve de defineField/defineType (ver
// src/sanity/schemas/defineHelpers.ts) pra nao depender do pacote `sanity`
// completo no app Next.js — sao objetos identicos em runtime, so o tipo
// exato do helper diverge do tipo oficial do Sanity, daí o cast abaixo.
const types = schemaTypes as unknown as SchemaTypeDefinition[];

/**
 * Studio real do Sanity. Os schemas vêm direto de `src/sanity/schemas/`
 * (fonte única de verdade, também usada pelo Next.js via
 * src/sanity/queries.ts e src/types/content.ts) — nada é duplicado aqui.
 */
export default defineConfig({
  name: "default",
  title: "Leoas da Serra",

  projectId: "pvg8mwks",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types,
  },
});
