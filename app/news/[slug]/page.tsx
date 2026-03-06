import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLatestNews, getNewsBySlug } from "@/lib/repositories";
import { formatPortalDate } from "@/lib/utils";

type NewsDetailPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const news = await getLatestNews();
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.content.slice(0, 140)
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <section className="page-shell py-14">
      <article className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          {article.category ? <Badge>{article.category.name}</Badge> : null}
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{article.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{formatPortalDate(article.publishedAt)}</span>
            <span>{article.author}</span>
          </div>
        </div>
        <Card className="overflow-hidden">
          <div className="relative h-[420px]">
            <Image src={article.image} alt={article.title} fill className="object-cover" />
          </div>
          <CardContent className="prose prose-neutral max-w-none p-8 text-foreground prose-headings:text-foreground prose-p:text-foreground/90">
            <p className="text-lg leading-8">{article.content}</p>
          </CardContent>
        </Card>
      </article>
    </section>
  );
}
