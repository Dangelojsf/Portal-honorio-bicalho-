import type { Metadata } from "next";

import { EventCard } from "@/components/event-card";
import { SectionHeading } from "@/components/section-heading";
import { getEvents } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Agenda de eventos e programacao comunitaria em Honorio Bicalho."
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Agenda"
          title="Eventos em destaque"
          description="Acompanhe festas, trilhas guiadas, feiras, cinema ao ar livre e encontros da comunidade."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((item) => (
            <EventCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
