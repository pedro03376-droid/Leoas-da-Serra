import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../src/sanity/schemas";

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
    types: schemaTypes,
  },
});
