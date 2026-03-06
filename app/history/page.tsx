import type { Metadata } from "next";
import Image from "next/image";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/repositories";
import { historyStory } from "@/lib/site";

export const metadata: Metadata = {
  title: "Historia",
  description: "Memoria, ferrovia, mineracao e identidade cultural de Honorio Bicalho."
};

export default async function HistoryPage() {
  const siteSettings = await getSiteSettings();

  return (
    <section className="page-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="relative h-[480px]">
            <Image src={siteSettings.historyImage} alt={siteSettings.historyTitle} fill className="object-cover" />
          </div>
        </Card>
        <Card className="paper-panel">
          <CardContent className="space-y-8 p-8">
            <SectionHeading
              eyebrow="Historia local"
              title={siteSettings.historyTitle}
              description={siteSettings.historyDescription}
            />
            <div className="space-y-6">
              {historyStory.highlights.map((item) => (
                <div key={item.year} className="rounded-[1.5rem] border border-border bg-white/80 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-primary/70">{item.year}</p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
