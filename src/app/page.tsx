import { Hero } from "@/components/home/hero/Hero";
import { TitlesTicker } from "@/components/home/TitlesTicker";
import { getProdutosDestaque, getProximoJogo, getTitulos } from "@/lib/content";

// Noticias e temporada saem da Home ate ter conteudo real cadastrado
// (hoje sao placeholder: "TODO: titulo da noticia" e estatisticas zeradas).
export default async function Home() {
  const [jogo, titulos, produtos] = await Promise.all([getProximoJogo(), getTitulos(), getProdutosDestaque()]);

  return (
    <>
      <Hero jogo={jogo} produtos={produtos.slice(0, 3)} />
      <TitlesTicker titulos={titulos} />
    </>
  );
}
