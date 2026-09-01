import type { Metadata } from "next";
import { TextReveal } from "@/components/motion";
import { MatchCard } from "@/components/match/MatchCard";
import { getJogos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Agenda · Leoas da Serra",
  description: "Proximos jogos e resultados das Leoas da Serra.",
};

export default async function AgendaPage() {
  const jogos = await getJogos();
  const proximos = jogos.filter((jogo) => jogo.status !== "encerrado");
  const encerrados = jogos.filter((jogo) => jogo.status === "encerrado");

  return (
    <div className="px-5 py-28 sm:px-8">
      <TextReveal as="h1" className="font-display text-4xl text-white sm:text-6xl">
        Agenda
      </TextReveal>

      {proximos.length > 0 && (
        <section className="mt-12">
          <p className="font-mono-label text-xs text-gray">Proximos jogos</p>
          <div className="mt-4 flex flex-col gap-3">
            {proximos.map((jogo) => (
              <MatchCard key={jogo._id} jogo={jogo} />
            ))}
          </div>
        </section>
      )}

      {encerrados.length > 0 && (
        <section className="mt-12">
          <p className="font-mono-label text-xs text-gray">Resultados</p>
          <div className="mt-4 flex flex-col gap-3">
            {encerrados.map((jogo) => (
              <MatchCard key={jogo._id} jogo={jogo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
