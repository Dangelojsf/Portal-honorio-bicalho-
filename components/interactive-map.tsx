"use client";

import { useMemo, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { CalendarDays, MapPinned, Store, Trees } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Point = {
  id: string;
  title: string;
  subtitle: string;
  type: "business" | "tourism" | "event";
  latitude: number;
  longitude: number;
};

interface InteractiveMapProps {
  businesses: Array<{ id: string; name: string; address: string; latitude: number; longitude: number }>;
  tourismSpots: Array<{ id: string; name: string; location: string; latitude: number; longitude: number }>;
  events: Array<{ id: string; title: string; location: string; latitude: number; longitude: number }>;
}

const containerStyle = {
  width: "100%",
  height: "460px"
};

const center = {
  lat: -20.017,
  lng: -43.847
};

export function InteractiveMap({ businesses, tourismSpots, events }: InteractiveMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded } = useJsApiLoader({
    id: "portal-honorio-bicalho-map",
    googleMapsApiKey: apiKey
  });

  const points = useMemo<Point[]>(
    () => [
      ...businesses.map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: item.address,
        type: "business" as const,
        latitude: item.latitude,
        longitude: item.longitude
      })),
      ...tourismSpots.map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: item.location,
        type: "tourism" as const,
        latitude: item.latitude,
        longitude: item.longitude
      })),
      ...events.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.location,
        type: "event" as const,
        latitude: item.latitude,
        longitude: item.longitude
      }))
    ],
    [businesses, tourismSpots, events]
  );

  const selectedPoint = points.find((item) => item.id === selectedId) ?? null;

  if (!apiKey) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-primary to-[#0f3926] p-6 text-white">
            <div className="mb-4 flex items-center gap-3">
              <MapPinned className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Mapa interativo pronto para Google Maps</h3>
            </div>
            <p className="max-w-xl text-sm text-white/75">
              Adicione `GOOGLE_MAPS_API_KEY` e `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` ao `.env` para ativar o mapa completo
              com marcadores de turismo, eventos e negocios locais.
            </p>
          </div>
          <div className="grid gap-3">
            <LegendCard icon={Store} label="Negocios" count={businesses.length} />
            <LegendCard icon={Trees} label="Turismo" count={tourismSpots.length} />
            <LegendCard icon={CalendarDays} label="Eventos" count={events.length} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[460px] animate-pulse rounded-[1.75rem] bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13} options={{ disableDefaultUI: true }}>
          {points.map((point) => (
            <MarkerF
              key={point.id}
              position={{ lat: point.latitude, lng: point.longitude }}
              onClick={() => setSelectedId(point.id)}
            />
          ))}
          {selectedPoint ? (
            <InfoWindowF
              position={{ lat: selectedPoint.latitude, lng: selectedPoint.longitude }}
              onCloseClick={() => setSelectedId(null)}
            >
              <div className="max-w-[180px] p-1">
                <p className="font-semibold text-foreground">{selectedPoint.title}</p>
                <p className="text-sm text-muted-foreground">{selectedPoint.subtitle}</p>
              </div>
            </InfoWindowF>
          ) : null}
        </GoogleMap>
      </CardContent>
    </Card>
  );
}

function LegendCard({
  icon: Icon,
  label,
  count
}: {
  icon: typeof Store;
  label: string;
  count: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-white p-4 shadow-soft">
      <Icon className="mb-3 h-5 w-5 text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{count}</p>
    </div>
  );
}
