import { Hero } from "@/components/home/hero/Hero";
import { TitlesTicker } from "@/components/home/TitlesTicker";
import { NewsGrid } from "@/components/home/NewsGrid";
import { SeasonCounters } from "@/components/home/SeasonCounters";
import { getNoticias, getProximoJogo, getTemporadaAtual, getTitulos } from "@/lib/content";

export default async function Home() {
  const [jogo, titulos, noticias, temporada] = await Promise.all([
    getProximoJogo(),
    getTitulos(),
    getNoticias(),
    getTemporadaAtual(),
  ]);

  return (
    <>
      <Hero jogo={jogo} />
      <TitlesTicker titulos={titulos} />
      <NewsGrid noticias={noticias} />
      <SeasonCounters temporada={temporada} />
    </>
  );
}
