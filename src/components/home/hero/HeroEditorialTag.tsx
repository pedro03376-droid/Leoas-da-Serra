import { LineDraw } from "@/components/motion";

/**
 * Elemento editorial vertical (so desktop) — reforca a sensacao de revista
 * esportiva, nao de dashboard. Sem numero de rodada inventado: so o
 * rotulo. Vive na propria coluna da grade do hero (ver .hero-grid em
 * globals.css) — nunca precisa de posicionamento absoluto nem offsets em
 * px que quebrariam em alguma largura de tela.
 */
export function HeroEditorialTag({ tagRef }: { tagRef: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={tagRef}
      aria-hidden
      className="hero-tag pointer-events-none hidden flex-col items-center justify-center gap-4 opacity-0 lg:flex"
    >
      <LineDraw orientation="vertical" trigger="immediate" className="h-16 w-px" />
      <span className="font-mono-label whitespace-nowrap text-[11px] text-white/50" style={{ writingMode: "vertical-rl" }}>
        Next Match
      </span>
      <LineDraw orientation="vertical" trigger="immediate" className="h-16 w-px" />
    </div>
  );
}
