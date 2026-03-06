import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactCards } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Canais de contato do Portal Honorio Bicalho para cobertura, negocios locais e servicos."
};

export default function ContactPage() {
  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Contato"
          title="Fale com o portal"
          description="Use os canais abaixo para sugerir pautas, divulgar negocios locais ou acionar a equipe editorial."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {contactCards.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <a href={item.link} className="text-sm font-medium text-primary">
                  {item.link}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
