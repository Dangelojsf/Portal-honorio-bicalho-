import type { Metadata } from "next";
import Link from "next/link";

import { BusinessCard } from "@/components/business-card";
import { CommunityCard } from "@/components/community-card";
import { EventCard } from "@/components/event-card";
import { HeroSection } from "@/components/hero-section";
import { InteractiveMap } from "@/components/interactive-map";
import { NewsCard } from "@/components/news-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { TourismCard } from "@/components/tourism-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHomePageData, getMapPoints, getSiteSettings } from "@/lib/repositories";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    openGraph: {
      images: [
        {
          url: settings.seoImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name
        }
      ]
    },
    twitter: {
      images: [settings.seoImage]
    }
  };
}

export default async function HomePage() {
  const [homeData, mapData] = await Promise.all([getHomePageData(), getMapPoints()]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    areaServed: siteConfig.location
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <HeroSection
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        image={homeData.hero.image}
      />

      <section className="page-shell mt-16 space-y-16">
        <div className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Jornal do bairro"
              title="Ultimas noticias"
              description="Cobertura local com foco em infraestrutura, cultura, esporte e oportunidades na regiao."
            />
            <Button asChild variant="ghost">
              <Link href="/news">Ver todas</Link>
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {homeData.news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Agenda local"
                title="Proximos eventos"
                description="Festas, trilhas, feiras e encontros comunitarios para quem vive ou visita Honorio Bicalho."
              />
              <Button asChild variant="ghost">
                <Link href="/events">Agenda completa</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {homeData.events.map((item) => (
                <EventCard key={item.id} item={item} />
              ))}
            </div>
          </div>
          <Card className="paper-panel">
            <CardContent className="space-y-6 p-6">
              <SectionHeading
                eyebrow="Rede local"
                title="Quadro comunitario"
                description="Avisos, vagas e servicos publicados pelos moradores com moderacao administrativa."
              />
              <div className="space-y-4">
                {homeData.communityPosts.map((item) => (
                  <CommunityCard key={item.id} item={item} />
                ))}
              </div>
              <Button asChild variant="accent" className="w-full">
                <Link href="/community">Publicar no quadro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Economia local"
              title="Guia comercial"
              description="Negocios que fazem o bairro girar: gastronomia, mercados, servicos, oficinas e comercio."
            />
            <Button asChild variant="ghost">
              <Link href="/business-directory">Abrir guia</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {homeData.businesses.map((item) => (
              <BusinessCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Destino local"
              title="Turismo e natureza"
              description="Trilhas, mirantes, cachoeiras e pontos historicos para descobrir o territorio."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {homeData.tourismSpots.map((item) => (
                <TourismCard key={item.id} item={item} />
              ))}
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="relative h-64 bg-primary/10">
              <img
                src={homeData.featuredHistory.image}
                alt={homeData.featuredHistory.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="space-y-6 p-6">
              <SectionHeading
                eyebrow="Memoria"
                title={homeData.featuredHistory.title}
                description={homeData.featuredHistory.description}
              />
              <Button asChild variant="default">
                <Link href="/history">Conhecer a historia</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <SectionHeading
            eyebrow="Mapa local"
            title="Explore Honorio Bicalho no mapa"
            description="Visualize negocios, eventos e atrativos turisticos em uma mesma experiencia geolocalizada."
          />
          <InteractiveMap
            businesses={mapData.businesses.map((item) => ({
              id: item.id,
              name: item.name,
              address: item.address,
              latitude: item.latitude as number,
              longitude: item.longitude as number
            }))}
            tourismSpots={mapData.tourismSpots.map((item) => ({
              id: item.id,
              name: item.name,
              location: item.location,
              latitude: item.latitude as number,
              longitude: item.longitude as number
            }))}
            events={mapData.events.map((item) => ({
              id: item.id,
              title: item.title,
              location: item.location,
              latitude: item.latitude as number,
              longitude: item.longitude as number
            }))}
          />
        </div>
      </section>
    </>
  );
}
