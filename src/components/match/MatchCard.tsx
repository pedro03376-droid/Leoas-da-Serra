import Image from "next/image";
import Link from "next/link";
import { ESCUDO_SRC } from "@/lib/brand";
import type { Jogo } from "@/types/content";

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo",
  });
}

/** Card de jogo para a agenda: escudos, placar (se encerrado) ou data, link para o Match Center. */
export function MatchCard({ jogo }: { jogo: Jogo }) {
  const encerrado = jogo.status === "encerrado";

  return (
    <Link
      href={`/jogos/${jogo.slug}`}
      className="hover-zoom flex items-center justify-between gap-4 rounded-sm border border-line bg-ink px-5 py-4 transition-colors hover:border-red"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-9 w-9 shrink-0">
          <Image src={ESCUDO_SRC} alt="" fill sizes="36px" style={{ objectFit: "contain" }} />
        </div>
        <span className="truncate text-sm text-white">Leoas</span>
      </div>

      <div className="flex shrink-0 flex-col items-center">
        {encerrado ? (
          <span className="font-display text-xl text-white">
            {jogo.placarLeoas} - {jogo.placarAdversario}
          </span>
        ) : (
          <span className="font-mono-label text-xs text-red">{formatarData(jogo.dataHora)}</span>
        )}
        <span className="mt-0.5 text-[11px] text-gray">{jogo.competicao}</span>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-3">
        <span className="truncate text-right text-sm text-white">{jogo.adversario}</span>
        <div className="relative h-9 w-9 shrink-0">
          <Image src={jogo.escudoAdversario.url} alt="" fill sizes="36px" style={{ objectFit: "contain" }} />
        </div>
      </div>
    </Link>
  );
}
