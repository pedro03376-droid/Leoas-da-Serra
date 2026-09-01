import type { Metadata } from "next";
import { CampaignHero } from "@/components/store/CampaignHero";
import { CollectionGrid } from "@/components/store/CollectionGrid";
import { getProdutosDestaque } from "@/lib/content";

export const metadata: Metadata = {
  title: "Loja Oficial · Leoas da Serra",
  description: "Camisa oficial e colecao das Leoas da Serra.",
};

export default async function LojaPage() {
  const produtos = await getProdutosDestaque();
  const destaque = produtos.find((produto) => produto.emCampanha) ?? produtos[0];

  return (
    <>
      {destaque && <CampaignHero produto={destaque} />}
      <CollectionGrid produtos={produtos} />
    </>
  );
}
