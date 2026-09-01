import "server-only";
import { createClient, type SanityClient } from "@sanity/client";
import { isSanityConfigured, SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID, SANITY_READ_TOKEN } from "./env";

/**
 * Cliente Sanity server-side, criado sob demanda. O import "server-only"
 * quebra o build se este modulo for importado por engano num componente
 * client — reforca a regra "site publico e so leitura, chaves nunca no
 * codigo do cliente". Instanciacao preguicosa: sem SANITY_PROJECT_ID
 * configurado (ambiente local/preview antes do CMS existir) o modulo pode
 * ser importado sem quebrar o build — os callers checam isSanityConfigured
 * antes de buscar dados (ver src/lib/content.ts).
 */
let cachedClient: SanityClient | null = null;

function getSanityClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error("Sanity nao configurado: defina SANITY_PROJECT_ID antes de chamar sanityFetch.");
  }
  cachedClient ??= createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    token: SANITY_READ_TOKEN,
    useCdn: true,
    perspective: "published",
  });
  return cachedClient;
}

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return getSanityClient().fetch<T>(query, params);
}
