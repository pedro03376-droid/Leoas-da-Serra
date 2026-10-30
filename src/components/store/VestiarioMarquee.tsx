const FRASES = [
  "LEOAS DA SERRA",
  "FUTSAL FEMININO · LAGES, SANTA CATARINA",
  "TEMPORADA 2026",
  "LOJA OFICIAL",
];

/** Faixa vermelha em loop continuo, identidade do Vestiario (mesma tecnica do TitlesTicker). */
export function VestiarioMarquee() {
  const items = [...FRASES, ...FRASES];

  return (
    <div className="overflow-hidden bg-red py-3">
      <div className="flex w-max animate-[vestiario-ticker_22s_linear_infinite] gap-10 motion-reduce:animate-none">
        {items.map((frase, index) => (
          <span key={`${frase}-${index}`} className="font-mono-label whitespace-nowrap text-xs text-white">
            {frase} <span className="text-white/50">·</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes vestiario-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
