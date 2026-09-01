import Link from "next/link";
import { ImageReveal, TextReveal } from "@/components/motion";
import type { Noticia } from "@/types/content";

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

/** Grade assimetrica: primeira noticia em destaque, demais menores. */
export function NewsGrid({ noticias }: { noticias: Noticia[] }) {
  if (noticias.length === 0) return null;
  const [destaque, ...resto] = noticias;

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <TextReveal as="h2" className="font-display text-3xl text-white sm:text-5xl">
        Noticias
      </TextReveal>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2">
        <Link href={`/noticias/${destaque.slug}`} className="hover-zoom group relative col-span-1 row-span-2 block lg:col-span-2">
          <ImageReveal
            src={destaque.capa.url}
            alt={destaque.capa.alt}
            width={destaque.capa.width || 1200}
            height={destaque.capa.height || 800}
            className="aspect-[4/3] w-full rounded-sm"
          />
          <div className="mt-4">
            <span className="font-mono-label text-xs text-red">{formatarData(destaque.publicadoEm)}</span>
            <h3 className="font-display mt-2 text-2xl text-white sm:text-3xl">{destaque.titulo}</h3>
            <p className="mt-2 max-w-lg text-sm text-gray">{destaque.resumo}</p>
          </div>
        </Link>

        {resto.slice(0, 4).map((noticia) => (
          <Link href={`/noticias/${noticia.slug}`} key={noticia._id} className="hover-zoom group block">
            <ImageReveal
              src={noticia.capa.url}
              alt={noticia.capa.alt}
              width={600}
              height={400}
              className="aspect-video w-full rounded-sm"
            />
            <div className="mt-3">
              <span className="font-mono-label text-[11px] text-red">{formatarData(noticia.publicadoEm)}</span>
              <h3 className="mt-1 text-base font-medium text-white">{noticia.titulo}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
