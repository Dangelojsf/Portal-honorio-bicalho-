import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { formatPortalDate } from "@/lib/utils";
import type { PortalEvent } from "@/types/portal";

interface EventCardProps {
  item: PortalEvent;
}

export function EventCard({ item }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={item.image} alt={item.title} fill className="object-cover" />
      </div>
      <CardContent className="space-y-4 p-5">
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>
              {formatPortalDate(item.date)} • {item.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{item.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
