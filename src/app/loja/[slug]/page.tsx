import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/ProductDetail";
import { getProdutoPorSlug } from "@/lib/content";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProdutoPorSlug(slug);
  if (!produto) return {};
  return { title: `${produto.nome} · Loja Leoas da Serra` };
}

export default async function ProdutoPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const produto = await getProdutoPorSlug(slug);
  if (!produto) notFound();

  return <ProductDetail produto={produto} />;
}
