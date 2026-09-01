/**
 * Variaveis de ambiente do Sanity. Lidas SO no servidor — nunca expostas ao
 * cliente sem o prefixo NEXT_PUBLIC_, e mesmo o projectId/dataset (que sao
 * publicos por natureza no Sanity) ficam centralizados aqui para nunca
 * serem hardcoded em componentes.
 */
export const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID ?? "";
export const SANITY_DATASET = process.env.SANITY_DATASET ?? "production";
export const SANITY_API_VERSION = "2024-01-01";

/** Token com permissao de leitura, usado apenas em fetch server-side. */
export const SANITY_READ_TOKEN = process.env.SANITY_READ_TOKEN;

export const isSanityConfigured = Boolean(SANITY_PROJECT_ID);
