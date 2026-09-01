import { TextReveal } from "@/components/motion";
import type { StatComparativa } from "@/types/content";

/** Barras comparativas Leoas x adversario para cada estatistica da partida. */
export function MatchStats({ stats }: { stats: StatComparativa[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="border-b border-line px-5 py-16 sm:px-8">
      <TextReveal as="h2" className="font-display text-2xl text-white sm:text-3xl">
        Estatisticas
      </TextReveal>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-6">
        {stats.map((stat) => {
          const total = stat.leoas + stat.adversario || 1;
          const leoasPct = (stat.leoas / total) * 100;

          return (
            <div key={stat.label}>
              <div className="flex items-center justify-between text-sm text-white">
                <span>{stat.leoas}</span>
                <span className="text-gray">{stat.label}</span>
                <span>{stat.adversario}</span>
              </div>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-card">
                <div className="h-full bg-red" style={{ width: `${leoasPct}%` }} />
                <div className="h-full flex-1 bg-white/20" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
