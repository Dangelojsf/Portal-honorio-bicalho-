import { Globe, Instagram, MapPin, Phone } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PortalBusiness } from "@/types/portal";

interface BusinessCardProps {
  item: PortalBusiness;
}

export function BusinessCard({ item }: BusinessCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-44">
        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          {item.category ? <Badge variant="muted">{item.category.name}</Badge> : null}
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{item.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>{item.phone}</span>
          </div>
          {item.website ? (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>{item.website}</span>
            </div>
          ) : null}
          {item.instagram ? (
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-primary" />
              <span>{item.instagram}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
