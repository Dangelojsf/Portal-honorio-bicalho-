import type { Metadata } from "next";

import { BusinessCard } from "@/components/business-card";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { getBusinesses, getCategories } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Guia Comercial",
  description: "Diretorio local de bares, restaurantes, mercados, oficinas, servicos e comercio."
};

export default async function BusinessDirectoryPage() {
  const [businesses, categories] = await Promise.all([getBusinesses(), getCategories("business")]);

  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Economia local"
          title="Guia comercial do bairro"
          description="Descubra onde comer, comprar, contratar servicos e apoiar os negocios de Honorio Bicalho."
        />
        <div className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <Badge key={item.id} variant="muted">
              {item.name}
            </Badge>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {businesses.map((item) => (
            <BusinessCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
