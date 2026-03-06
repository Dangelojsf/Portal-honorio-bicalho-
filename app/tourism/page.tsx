import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { TourismCard } from "@/components/tourism-card";
import { getTourismSpots } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Turismo",
  description: "Trilhas, cachoeiras, mirantes e roteiros historicos em Honorio Bicalho."
};

export default async function TourismPage() {
  const spots = await getTourismSpots();

  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Turismo"
          title="Natureza, memoria e paisagens"
          description="Roteiros para visitantes e moradores explorarem o patrimonio natural e historico da regiao."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {spots.map((item) => (
            <TourismCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
