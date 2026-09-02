import { Hero } from "@/components/home/hero/Hero";
import { TitlesTicker } from "@/components/home/TitlesTicker";
import { getProximoJogo, getTitulos } from "@/lib/content";

// Noticias e temporada saem da Home ate ter conteudo real cadastrado
// (hoje sao placeholder: "TODO: titulo da noticia" e estatisticas zeradas).
export default async function Home() {
  const [jogo, titulos] = await Promise.all([getProximoJogo(), getTitulos()]);

  return (
    <>
      <Hero jogo={jogo} />
      <TitlesTicker titulos={titulos} />
    </>
  );
}
