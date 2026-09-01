import type { Titulo } from "@/types/content";

/** Faixa de titulos reais, em loop continuo (CSS puro). */
export function TitlesTicker({ titulos }: { titulos: Titulo[] }) {
  const items = [...titulos, ...titulos];

  return (
    <div className="overflow-hidden border-y border-line bg-ink py-4">
      <div className="flex w-max animate-[ticker_28s_linear_infinite] gap-16 motion-reduce:animate-none">
        {items.map((titulo, index) => (
          <span key={`${titulo._id}-${index}`} className="font-mono-label whitespace-nowrap text-xs text-white/70">
            {titulo.competicao} <span className="text-red">· {titulo.temporada}</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
