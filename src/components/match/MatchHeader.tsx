import Image from "next/image";
import { ESCUDO_SRC } from "@/lib/brand";
import type { Jogo } from "@/types/content";

const STATUS_LABEL: Record<Jogo["status"], string> = {
  agendado: "Agendado",
  ao_vivo: "Ao vivo",
  encerrado: "Encerrado",
};

export function MatchHeader({ jogo }: { jogo: Jogo }) {
  const dataFormatada = new Date(jogo.dataHora).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
  const horaFormatada = new Date(jogo.dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
  const encerrado = jogo.status === "encerrado";

  return (
    <section className="border-b border-line px-5 pb-14 pt-32 sm:px-8">
      <p className="font-mono-label text-center text-xs text-red">
        {STATUS_LABEL[jogo.status]} · {jogo.competicao}
      </p>

      <div className="mt-8 flex items-center justify-center gap-8 sm:gap-16">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 sm:h-24 sm:w-24">
            <Image src={ESCUDO_SRC} alt="" fill sizes="96px" style={{ objectFit: "contain" }} />
          </div>
          <span className="font-display text-sm text-white sm:text-lg">Leoas</span>
        </div>

        {encerrado ? (
          <span className="font-display text-4xl text-white sm:text-6xl">
            {jogo.placarLeoas} - {jogo.placarAdversario}
          </span>
        ) : (
          <span className="font-display text-3xl text-gray sm:text-5xl">VS</span>
        )}

        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 sm:h-24 sm:w-24">
            <Image src={jogo.escudoAdversario.url} alt="" fill sizes="96px" style={{ objectFit: "contain" }} />
          </div>
          <span className="font-display text-sm text-white sm:text-lg">{jogo.adversario}</span>
        </div>
      </div>

      <p className="font-mono-label mt-8 text-center text-xs text-gray sm:text-sm">
        {dataFormatada} · {horaFormatada} · {jogo.local}
      </p>
    </section>
  );
}
