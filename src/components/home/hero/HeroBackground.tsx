/**
 * Camada de fundo do hero: preto/grafite profundo, granulacao cinematografica
 * muito discreta, linhas geometricas quase invisiveis e uma luz radial suave
 * atras da composicao. Puramente decorativo — nunca captura interacao.
 */

// Ruido estatico (feTurbulence) embutido como data-URI: gerado uma vez, sem
// custo de render por frame — so uma textura de fundo com opacidade baixa.
const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#n)"/>
    </svg>`,
  );

export function HeroBackground({ heroRef }: { heroRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={heroRef} className="absolute inset-0 -z-10 opacity-0">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-black to-black" />

      {/* luz radial suave, atras da composicao central */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[38%] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(closest-side, var(--red), transparent 70%)" }}
      />

      {/* linhas geometricas quase invisiveis */}
      <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.05]" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="1" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="1" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="white" strokeWidth="1" />
      </svg>

      {/* granulacao cinematografica */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_DATA_URI}")` }}
      />
    </div>
  );
}
