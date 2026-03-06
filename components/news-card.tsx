import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createExcerpt, formatPortalDate } from "@/lib/utils";
import type { PortalNews } from "@/types/portal";

interface NewsCardProps {
  item: PortalNews;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="space-y-4 p-5">
        {item.category ? <Badge>{item.category.name}</Badge> : null}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-snug">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{createExcerpt(item.content, 120)}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formatPortalDate(item.publishedAt)}</span>
          <Link href={`/news/${item.slug}`} className="inline-flex items-center gap-2 font-medium text-primary">
            Ler mais
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
