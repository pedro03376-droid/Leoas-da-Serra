"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Jogo } from "@/types/content";
import { ESCUDO_SRC } from "@/lib/brand";

/**
 * O countdown depende de Date.now() no exato instante da renderizacao, que
 * nunca bate entre o servidor (SSR) e o client (hidratacao) — por isso
 * comeca como `null` (igual nos dois lados) e so calcula valores reais
 * depois de montado, evitando mismatch de hidratacao.
 */
function useCountdown(target: string) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, new Date(target).getTime() - Date.now()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (remaining === null) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    dias: Math.floor(totalSeconds / 86400),
    horas: Math.floor((totalSeconds % 86400) / 3600),
    minutos: Math.floor((totalSeconds % 3600) / 60),
    segundos: totalSeconds % 60,
  };
}

/**
 * HERO = proximo jogo como EVENTO: escudos, VS, data/local,
 * countdown ao vivo, CTAs de ingresso/transmissao.
 */
export function HeroNextMatch({ jogo }: { jogo: Jogo }) {
  const countdown = useCountdown(jogo.dataHora);
  // timeZone fixo: a data/hora do jogo precisa renderizar igual no servidor
  // e no client, independente do fuso da maquina que fez o SSR.
  const dataFormatada = new Date(jogo.dataHora).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });
  const horaFormatada = new Date(jogo.dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden px-5 pb-16 pt-32 sm:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-black to-black" />

      <p className="font-mono-label text-xs text-red">
        {jogo.status === "ao_vivo" ? "Ao vivo agora" : "Proximo jogo"} · {jogo.competicao}
      </p>

      <Link href={`/jogos/${jogo.slug}`} className="mt-6 flex items-center justify-center gap-6 sm:gap-12">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 sm:h-24 sm:w-24">
            <Image src={ESCUDO_SRC} alt="" fill sizes="96px" style={{ objectFit: "contain" }} />
          </div>
          <span className="font-display text-sm text-white sm:text-lg">Leoas</span>
        </div>

        <span className="font-display text-3xl text-gray sm:text-5xl">VS</span>

        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 sm:h-24 sm:w-24">
            <Image src={jogo.escudoAdversario.url} alt="" fill sizes="96px" style={{ objectFit: "contain" }} />
          </div>
          <span className="font-display text-sm text-white sm:text-lg">{jogo.adversario}</span>
        </div>
      </Link>

      <p className="font-mono-label mt-6 text-center text-xs text-gray sm:text-sm">
        {dataFormatada} · {horaFormatada} · {jogo.local}
      </p>

      {jogo.status === "agendado" && countdown && (
        <div className="mx-auto mt-8 flex gap-4 sm:gap-8" aria-label="Contagem regressiva para o proximo jogo">
          {(
            [
              ["dias", countdown.dias],
              ["hrs", countdown.horas],
              ["min", countdown.minutos],
              ["seg", countdown.segundos],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-mono text-2xl tabular-nums text-white sm:text-4xl">
                {String(value).padStart(2, "0")}
              </span>
              <span className="font-mono-label text-[10px] text-gray">{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto mt-10 flex flex-wrap justify-center gap-4">
        {jogo.ingressoUrl && (
          <Link
            href={jogo.ingressoUrl}
            className="rounded-full bg-red px-6 py-3 text-sm text-white transition-colors hover:bg-red-dark"
          >
            Ingressos
          </Link>
        )}
        {jogo.transmissaoUrl && (
          <Link
            href={jogo.transmissaoUrl}
            className="rounded-full border border-line px-6 py-3 text-sm text-white transition-colors hover:border-red"
          >
            Transmissao
          </Link>
        )}
        <Link
          href={`/jogos/${jogo.slug}`}
          className="rounded-full border border-line px-6 py-3 text-sm text-white transition-colors hover:border-red"
        >
          Match Center
        </Link>
        {!jogo.ingressoUrl && !jogo.transmissaoUrl && (
          <span className="font-mono-label self-center text-xs text-gray">TODO: ingressos e transmissao (CMS)</span>
        )}
      </div>
    </section>
  );
}
