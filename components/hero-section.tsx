import { ArrowRight, CalendarDays, MapPinned, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image: string;
}

export function HeroSection({ title, subtitle, image }: HeroSectionProps) {
  return (
    <section className="page-shell-wide pt-0">
      <div className="relative overflow-hidden rounded-b-[1.75rem] rounded-t-none border border-t-0 border-white/70 bg-white/85 shadow-soft backdrop-blur">
        <div className="relative min-h-[460px] overflow-hidden sm:min-h-[560px] lg:min-h-[600px]">
          <Image src={image} alt={title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,12,0.42)_0%,rgba(10,18,12,0.2)_28%,rgba(10,18,12,0.04)_56%,rgba(10,18,12,0)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,12,0.04)_0%,rgba(10,18,12,0.14)_100%)]" />
          <div className="relative z-10 flex min-h-[460px] items-center px-6 py-8 sm:min-h-[560px] sm:px-10 lg:min-h-[600px]">
            <div className="max-w-[380px] space-y-5 text-white sm:max-w-[460px]">
              <Badge variant="accent">Hub digital do bairro</Badge>
              <div className="space-y-3">
                <h1 className="max-w-md text-3xl font-semibold leading-[1.02] text-balance sm:text-4xl lg:text-[3.4rem]">
                  {title}
                </h1>
                <p className="max-w-sm text-base leading-7 text-white/90 sm:text-lg">{subtitle}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent">
                  <Link href="/news">
                    Ler noticias
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/tourism">Explorar turismo</Link>
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-white/12 bg-black/10 p-4 backdrop-blur-sm">
                  <Newspaper className="mb-3 h-5 w-5" />
                  <p className="text-sm font-medium">Cobertura local</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/12 bg-black/10 p-4 backdrop-blur-sm">
                  <CalendarDays className="mb-3 h-5 w-5" />
                  <p className="text-sm font-medium">Agenda ativa</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/12 bg-black/10 p-4 backdrop-blur-sm">
                  <MapPinned className="mb-3 h-5 w-5" />
                  <p className="text-sm font-medium">Mapa interativo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
