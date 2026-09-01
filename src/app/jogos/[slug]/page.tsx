import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchStats } from "@/components/match/MatchStats";
import { MatchTimeline } from "@/components/match/MatchTimeline";
import { MatchLineup } from "@/components/match/MatchLineup";
import { MatchGallery } from "@/components/match/MatchGallery";
import { getJogoPorSlug } from "@/lib/content";

interface MatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const jogo = await getJogoPorSlug(slug);
  if (!jogo) return {};
  return { title: `Leoas x ${jogo.adversario} · Match Center` };
}

export default async function MatchCenterPage({ params }: MatchPageProps) {
  const { slug } = await params;
  const jogo = await getJogoPorSlug(slug);
  if (!jogo) notFound();

  return (
    <>
      <MatchHeader jogo={jogo} />
      {jogo.statsComparativas && <MatchStats stats={jogo.statsComparativas} />}
      {jogo.eventos && <MatchTimeline eventos={jogo.eventos} />}
      {jogo.escalacaoLeoas && <MatchLineup escalacao={jogo.escalacaoLeoas} />}
      {jogo.fotos && <MatchGallery fotos={jogo.fotos} />}
    </>
  );
}
