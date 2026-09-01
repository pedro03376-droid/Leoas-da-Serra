"use client";

const INTRO_FLAG_KEY = "leoas-intro-seen";
const listeners = new Set<() => void>();

function readFlag(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * So mostrar a intro na primeira visita da sessao (flag em sessionStorage).
 * O snapshot do servidor sempre assume "ja visto" (ver getIntroSeenServerSnapshot);
 * o microtask forca uma re-leitura assim que monta no client, para o valor
 * real do sessionStorage substituir esse placeholder sem exigir um segundo evento externo.
 */
export function subscribeIntroSeen(callback: () => void): () => void {
  listeners.add(callback);
  queueMicrotask(callback);
  return () => listeners.delete(callback);
}

export function getIntroSeenSnapshot(): boolean {
  return readFlag();
}

/** No servidor (e na primeira pintura do client) assume "ja visto" — a intro nunca aparece no SSR. */
export function getIntroSeenServerSnapshot(): boolean {
  return true;
}

export function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(INTRO_FLAG_KEY, "1");
  } catch {
    // sessionStorage indisponivel (modo privado etc.) — segue sem persistir, intro pode rodar de novo.
  }
  listeners.forEach((listener) => listener());
}
