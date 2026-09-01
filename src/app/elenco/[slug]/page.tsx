import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AthleteProfile } from "@/components/roster/AthleteProfile";
import { getAtletaPorSlug } from "@/lib/content";

interface AthletePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AthletePageProps): Promise<Metadata> {
  const { slug } = await params;
  const atleta = await getAtletaPorSlug(slug);
  if (!atleta) return {};
  return { title: `${atleta.nome} · Leoas da Serra` };
}

export default async function AthletePage({ params }: AthletePageProps) {
  const { slug } = await params;
  const atleta = await getAtletaPorSlug(slug);
  if (!atleta) notFound();

  return <AthleteProfile atleta={atleta} />;
}
