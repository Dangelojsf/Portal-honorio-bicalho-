import { Clock3, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPortalDateTime } from "@/lib/utils";
import type { PortalCommunityPost } from "@/types/portal";

interface CommunityCardProps {
  item: PortalCommunityPost;
}

export function CommunityCard({ item }: CommunityCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          {item.category ? <Badge>{item.category.name}</Badge> : <Badge variant="muted">Comunidade</Badge>}
          <Badge variant={item.status === "approved" ? "default" : "accent"}>{item.status}</Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.content}</p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" />
            <span>{item.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>{formatPortalDateTime(item.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
