import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a service role key — so pode rodar no servidor
 * (rotas /api ou Server Components), nunca no navegador. A service role
 * ignora Row Level Security, entao qualquer vazamento dessa chave da
 * acesso total ao banco: por isso o import "server-only" acima, que
 * quebra o build se algum client component tentar importar este arquivo.
 */
export function supabaseServidor() {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    throw new Error("Supabase nao configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes).");
  }
  return createClient(url, chave, { auth: { persistSession: false } });
}

export function supabaseConfigurado(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
