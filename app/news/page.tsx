import type { Metadata } from "next";

import { NewsCard } from "@/components/news-card";
import { SectionHeading } from "@/components/section-heading";
import { getLatestNews } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Ultimas noticias de Honorio Bicalho com cobertura de bairro, eventos, emprego, cultura e infraestrutura."
};

export default async function NewsPage() {
  const news = await getLatestNews();

  return (
    <section className="page-shell py-14">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Noticias"
          title="Jornal do bairro"
          description="Atualizacoes sobre obras, eventos, oportunidades, cultura e o cotidiano de Honorio Bicalho."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
