"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { CalcularFrete } from "./CalcularFrete";
import { useCart } from "./CartContext";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatarPreco, objectPositionFrom } from "@/lib/format";
import type { ProdutoDestaque } from "@/types/content";

export function ProductDetail({ produto }: { produto: ProdutoDestaque }) {
  const { addItem, openCart } = useCart();
  const fotos = [produto.imagem, ...(produto.imagensGaleria ?? [])];
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [adicionado, setAdicionado] = useState(false);

  const precisaTamanho = Boolean(produto.tamanhos && produto.tamanhos.length > 0);
  const tamanhoEscolhido = precisaTamanho ? tamanho : undefined;
  const podeAdicionar = !precisaTamanho || tamanho !== null;

  const reducedMotion = usePrefersReducedMotion();
  const fotoRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const categoriaRef = useRef<HTMLParagraphElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const precoRef = useRef<HTMLParagraphElement>(null);
  const descricaoRef = useRef<HTMLParagraphElement>(null);
  const tamanhoRef = useRef<HTMLFieldSetElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Entrada escalonada: a pagina de produto nunca e so um salto de corte,
  // segue a mesma linguagem editorial do resto do site (fade + leve subida,
  // em cascata), disparada ja ao montar -- tudo aqui sempre esta acima da
  // dobra, nao precisa de scroll trigger.
  useEffect(() => {
    const elementos = [
      fotoRef.current,
      thumbsRef.current,
      categoriaRef.current,
      tituloRef.current,
      precoRef.current,
      descricaoRef.current,
      tamanhoRef.current,
      ctaRef.current,
    ].filter(Boolean) as HTMLElement[];
    if (elementos.length === 0) return;

    if (reducedMotion) {
      gsap.set(elementos, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(fotoRef.current, { opacity: 0, scale: 1.04 });
    gsap.set([thumbsRef.current, categoriaRef.current, tituloRef.current, precoRef.current, descricaoRef.current, tamanhoRef.current, ctaRef.current], {
      opacity: 0,
      y: 16,
    });

    const tl = gsap.timeline({ defaults: { ease: EASE_CINEMATIC_GSAP } });
    tl.to(fotoRef.current, { opacity: 1, scale: 1, duration: 0.9 }, 0)
      .to(categoriaRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.15)
      .to(tituloRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.25)
      .to(precoRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.38)
      .to(descricaoRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.46)
      .to(tamanhoRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.54)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.62)
      .to(thumbsRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.4);

    return () => {
      tl.kill();
    };
    // produto.slug muda a cada navegacao entre produtos (Link do Next so
    // troca o conteudo, nao remonta o componente) -- refaz a entrada.
  }, [reducedMotion, produto.slug]);

  return (
    <section className="grid grid-cols-1 gap-10 px-5 py-28 sm:px-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <div ref={fotoRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-card">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={fotoAtiva}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={fotos[fotoAtiva].url}
                alt={fotos[fotoAtiva].alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                style={{ objectFit: "cover", objectPosition: objectPositionFrom(fotos[fotoAtiva]) }}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {fotos.length > 1 && (
          <div ref={thumbsRef} className="mt-3 grid grid-cols-5 gap-2">
            {fotos.map((foto, index) => (
              <button
                key={`${foto.url}-${index}`}
                type="button"
                onClick={() => setFotoAtiva(index)}
                aria-label={`Ver foto ${index + 1} de ${fotos.length}`}
                aria-current={index === fotoAtiva}
                className={`group relative aspect-[4/5] overflow-hidden rounded-sm bg-card ring-1 transition-colors ${
                  index === fotoAtiva ? "ring-red" : "ring-line hover:ring-white/40"
                }`}
              >
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover", objectPosition: objectPositionFrom(foto) }}
                  className="transition-transform duration-300 ease-out group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <p ref={categoriaRef} className="font-mono-label text-xs text-red">
          {produto.categoria}
        </p>
        <h1 ref={tituloRef} className="font-display mt-3 text-3xl text-white sm:text-4xl">
          {produto.nome}
        </h1>
        <p ref={precoRef} className="mt-3 text-lg text-white">
          {formatarPreco(produto.precoCentavos)}
        </p>
        {produto.descricao && (
          <p ref={descricaoRef} className="mt-6 max-w-md text-sm leading-relaxed text-gray">
            {produto.descricao}
          </p>
        )}

        {precisaTamanho && (
          <fieldset ref={tamanhoRef} className="mt-8">
            <legend className="font-mono-label text-[11px] text-gray">Tamanho</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {produto.tamanhos?.map((variante) => (
                <button
                  key={variante.tamanho}
                  type="button"
                  disabled={variante.disponivel === false}
                  onClick={() => setTamanho(variante.tamanho)}
                  aria-pressed={tamanho === variante.tamanho}
                  className={`font-mono-label min-w-11 rounded-sm border px-3.5 py-2.5 text-xs transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 ${
                    tamanho === variante.tamanho
                      ? "border-red bg-red text-white scale-105"
                      : "border-line text-white/80 hover:border-white/50 hover:scale-105"
                  }`}
                >
                  {variante.tamanho}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div ref={ctaRef}>
          <button
            type="button"
            disabled={!podeAdicionar}
            onClick={() => {
              addItem(produto, tamanhoEscolhido ?? undefined);
              openCart();
              setAdicionado(true);
              window.setTimeout(() => setAdicionado(false), 1500);
            }}
            className={`font-mono-label mt-8 w-full max-w-xs rounded-full bg-red py-3.5 text-xs text-white transition-all duration-300 hover:bg-red-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/50 ${
              adicionado ? "scale-[1.03]" : ""
            }`}
          >
            {adicionado ? "Adicionado ✓" : precisaTamanho && !tamanho ? "Escolha um tamanho" : "Adicionar a sacola"}
          </button>

          <CalcularFrete pacote={produto.pacote} precoCentavos={produto.precoCentavos} />
        </div>
      </div>
    </section>
  );
}
