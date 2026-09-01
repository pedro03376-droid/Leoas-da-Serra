import { TextReveal } from "@/components/motion";
import type { EventoJogo, TipoEvento } from "@/types/content";

const LABEL_EVENTO: Record<TipoEvento, string> = {
  gol: "Gol",
  cartao_amarelo: "Cartao amarelo",
  cartao_vermelho: "Cartao vermelho",
  substituicao: "Substituicao",
  timeout: "Timeout",
};

const COR_EVENTO: Record<TipoEvento, string> = {
  gol: "bg-red",
  cartao_amarelo: "bg-yellow-400",
  cartao_vermelho: "bg-red-dark",
  substituicao: "bg-white/40",
  timeout: "bg-white/40",
};

/** Linha do tempo da partida, minuto a minuto, marcando de qual lado veio o evento. */
export function MatchTimeline({ eventos }: { eventos: EventoJogo[] }) {
  if (eventos.length === 0) return null;

  const ordenados = [...eventos].sort((a, b) => a.minuto - b.minuto);

  return (
    <section className="border-b border-line px-5 py-16 sm:px-8">
      <TextReveal as="h2" className="font-display text-2xl text-white sm:text-3xl">
        Timeline
      </TextReveal>

      <ol className="mx-auto mt-8 flex max-w-2xl flex-col gap-4">
        {ordenados.map((evento, index) => (
          <li
            key={`${evento.minuto}-${index}`}
            className={`flex items-center gap-4 ${evento.time === "adversario" ? "flex-row-reverse text-right" : ""}`}
          >
            <span className="font-mono w-8 shrink-0 text-xs tabular-nums text-gray">{evento.minuto}&apos;</span>
            <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${COR_EVENTO[evento.tipo]}`} />
            <span className="flex-1 text-sm text-white/90">
              <span className="font-mono-label mr-2 text-[10px] text-gray">{LABEL_EVENTO[evento.tipo]}</span>
              {evento.descricao}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
