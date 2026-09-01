import type { Metadata } from "next";
import { TextReveal } from "@/components/motion";
import { RosterCard } from "@/components/roster/RosterCard";
import { getElenco } from "@/lib/content";

export const metadata: Metadata = {
  title: "Elenco · Leoas da Serra",
  description: "Elenco das Leoas da Serra, futsal feminino de Lages, Santa Catarina.",
};

export default async function ElencoPage() {
  const elenco = await getElenco();

  return (
    <div className="px-5 py-28 sm:px-8">
      <TextReveal as="h1" className="font-display text-4xl text-white sm:text-6xl">
        Elenco
      </TextReveal>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {elenco.map((atleta, index) => (
          <RosterCard key={atleta._id} atleta={atleta} index={index} />
        ))}
      </div>
    </div>
  );
}
