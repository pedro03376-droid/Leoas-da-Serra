import type { Metadata } from "next";
import { CollectionGrid } from "@/components/store/CollectionGrid";
import { VestiarioHero } from "@/components/store/VestiarioHero";
import { VestiarioMarquee } from "@/components/store/VestiarioMarquee";
import { getProdutosDestaque } from "@/lib/content";

export const metadata: Metadata = {
  title: "Loja Oficial · Leoas da Serra",
  description: "Camisa oficial e colecao das Leoas da Serra.",
};

export default async function LojaPage() {
  const produtos = await getProdutosDestaque();

  return (
    <>
      <VestiarioHero produtos={produtos} />
      <VestiarioMarquee />
      <CollectionGrid produtos={produtos} />
    </>
  );
}
