import { Counter, TextReveal } from "@/components/motion";
import type { Temporada } from "@/types/content";

/** Temporada com counters — estatisticas contam de 0 ao valor final ao entrar na viewport. */
export function SeasonCounters({ temporada }: { temporada: Temporada }) {
  const jogos = temporada.vitorias + temporada.empates + temporada.derrotas;
  const saldo = temporada.golsPro - temporada.golsContra;

  const stats = [
    { label: "Jogos", value: jogos },
    { label: "Vitorias", value: temporada.vitorias },
    { label: "Gols pro", value: temporada.golsPro },
    { label: "Saldo", value: saldo, prefix: saldo > 0 ? "+" : "" },
  ];

  return (
    <section className="border-t border-line px-5 py-20 sm:px-8 sm:py-28">
      <TextReveal as="h2" className="font-display text-3xl text-white sm:text-5xl">
        {`Temporada ${temporada.ano}`}
      </TextReveal>

      <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Counter
              value={stat.value}
              prefix={stat.prefix}
              className="font-display text-4xl text-white sm:text-6xl"
            />
            <span className="font-mono-label mt-2 text-xs text-gray">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
