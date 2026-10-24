"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useCart } from "./CartContext";
import { EASE_CINEMATIC_GSAP } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const CONTEUDO: Record<string, { titulo: string; texto: string; cor: string }> = {
  success: {
    titulo: "Pagamento aprovado!",
    texto: "Recebemos seu pedido e ja vamos preparar o envio. Confirmamos tudo por e-mail.",
    cor: "var(--red)",
  },
  pending: {
    titulo: "Pagamento em analise",
    texto: "Assim que o pagamento for confirmado (ex.: boleto ou Pix ainda processando), avisamos por e-mail.",
    cor: "var(--white)",
  },
  failure: {
    titulo: "Nao foi possivel concluir o pagamento",
    texto: "O pagamento nao foi aprovado. Nenhum valor foi cobrado — pode tentar novamente.",
    cor: "var(--white)",
  },
};

/**
 * Icone-selo por status, desenhado por stroke-dashoffset (mesma tecnica do
 * LineDraw) — o anel e o simbolo "se desenham" em vez de so aparecer.
 * E o momento de maior peso visual do fluxo de compra (o "thesis moment"
 * de uma pagina de confirmacao), por isso ganha mais cuidado que o resto
 * do checkout, que e deliberadamente utilitario.
 */
function SeloStatus({ status, reducedMotion }: { status: string; reducedMotion: boolean }) {
  const anelRef = useRef<SVGCircleElement>(null);
  const simboloRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const anel = anelRef.current;
    const simbolo = simboloRef.current;
    if (!anel || !simbolo) return;

    const comprimentoAnel = anel.getTotalLength();
    const comprimentoSimbolo = simbolo.getTotalLength();

    gsap.set(anel, { strokeDasharray: comprimentoAnel, strokeDashoffset: reducedMotion ? 0 : comprimentoAnel });
    gsap.set(simbolo, { strokeDasharray: comprimentoSimbolo, strokeDashoffset: reducedMotion ? 0 : comprimentoSimbolo });
    gsap.set([anel, simbolo], { opacity: 1 });

    if (reducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: EASE_CINEMATIC_GSAP } });
    tl.to(anel, { strokeDashoffset: 0, duration: 0.7 }, 0).to(simbolo, { strokeDashoffset: 0, duration: 0.5 }, 0.45);

    return () => {
      tl.kill();
    };
  }, [reducedMotion, status]);

  const simbolos: Record<string, string> = {
    success: "M8 16.5l5 5 11-11",
    pending: "M16 9v7l5 3",
    failure: "M11 11l10 10M21 11l-10 10",
  };

  return (
    <svg aria-hidden width="72" height="72" viewBox="0 0 32 32" className="overflow-visible">
      <circle ref={anelRef} cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth={1.4} opacity={0} />
      <path ref={simboloRef} d={simbolos[status] ?? simbolos.pending} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={0} />
    </svg>
  );
}

export function CheckoutRetorno({ status }: { status: string }) {
  const { clearCart } = useCart();
  const info = CONTEUDO[status] ?? CONTEUDO.pending;
  const reducedMotion = usePrefersReducedMotion();

  const seloWrapRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const textoRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") clearCart();
    // Roda so uma vez, ao carregar a pagina de retorno -- clearCart muda de
    // referencia a cada render (nao e memoizado no CartContext).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const elementos = [seloWrapRef.current, tituloRef.current, textoRef.current, ctaRef.current].filter(Boolean) as HTMLElement[];
    if (elementos.length === 0) return;

    if (reducedMotion) {
      gsap.set(elementos, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(seloWrapRef.current, { opacity: 0, scale: 0.7 });
    gsap.set([tituloRef.current, textoRef.current, ctaRef.current], { opacity: 0, y: 14 });

    const tl = gsap.timeline({ defaults: { ease: EASE_CINEMATIC_GSAP } });
    tl.to(seloWrapRef.current, { opacity: 1, scale: 1, duration: 0.6 }, 0)
      .to(tituloRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.3)
      .to(textoRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.42)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.54);

    return () => {
      tl.kill();
    };
  }, [reducedMotion, status]);

  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
        style={{ background: `radial-gradient(closest-side, ${info.cor}, transparent 70%)` }}
      />

      <div className="relative mx-auto max-w-lg text-center">
        <div ref={seloWrapRef} className="mx-auto flex h-[72px] w-[72px] items-center justify-center" style={{ color: info.cor }}>
          <SeloStatus status={status} reducedMotion={reducedMotion} />
        </div>

        <h1 ref={tituloRef} className="font-display mt-6 text-3xl text-white">
          {info.titulo}
        </h1>
        <p ref={textoRef} className="mt-4 text-sm leading-relaxed text-gray">
          {info.texto}
        </p>

        <div ref={ctaRef}>
          <Link
            href="/loja"
            className="font-mono-label mt-8 inline-block rounded-full border border-line px-6 py-3 text-xs text-white/80 transition-colors hover:border-white/50"
          >
            Voltar pra loja
          </Link>
        </div>
      </div>
    </section>
  );
}
