import { ImageReveal, TextReveal } from "@/components/motion";
import type { SanityImageRef } from "@/types/content";

export function MatchGallery({ fotos }: { fotos: SanityImageRef[] }) {
  if (fotos.length === 0) return null;

  return (
    <section className="px-5 py-16 sm:px-8">
      <TextReveal as="h2" className="font-display text-2xl text-white sm:text-3xl">
        Fotos
      </TextReveal>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fotos.map((foto, index) => (
          <ImageReveal
            key={`${foto.url}-${index}`}
            src={foto.url}
            alt={foto.alt}
            width={500}
            height={375}
            className="aspect-[4/3] w-full rounded-sm"
          />
        ))}
      </div>
    </section>
  );
}
