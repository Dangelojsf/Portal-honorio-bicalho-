import { MapPin, Mountain } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PortalTourismSpot } from "@/types/portal";

interface TourismCardProps {
  item: PortalTourismSpot;
}

export function TourismCard({ item }: TourismCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-56">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{item.type}</Badge>
          <Badge variant="muted">{item.difficulty}</Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-primary" />
            <span>Roteiro ideal para visitantes e moradores</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
