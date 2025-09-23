"use client";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Rectangle,
  LayerGroup,
  Marker,
  ZoomControl,
} from "react-leaflet";
import L, { type LatLngExpression, type DivIcon } from "leaflet";
import { useEffect, useState } from "react";

// Import Leaflet CSS dynamically to avoid SSR issues
import "leaflet/dist/leaflet.css";

// India bounds and center for map
const INDIA_CENTER: LatLngExpression = [20.5937, 78.9629];
const INDIA_BOUNDS = [
  [6.4, 68.7],
  [35.5, 97.25],
];

// helper to build a DivIcon for cluster counts
function makeClusterIcon(count: number): DivIcon {
  return L.divIcon({
    className: "cluster-bubble",
    html: `<div>${count}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

type Point = {
  id: string;
  lat: number;
  lon: number;
  temp: number;
  salinity: number;
  species: string;
  alerts?: string;
};

type MapComponentProps = {
  points: Point[];
  layers: {
    ocean: boolean;
    bio: boolean;
    fish: boolean;
    heat: boolean;
    cluster: boolean;
  };
  heatCells: Array<{
    bounds: [[number, number], [number, number]];
    intensity: number;
  }>;
  clusters: Array<{
    lat: number;
    lon: number;
    count: number;
  }>;
};

export default function MapComponent({
  points,
  layers,
  heatCells,
  clusters,
}: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  // Fix leaflet default icons and ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[560px] bg-muted/50 animate-pulse rounded-lg flex items-center justify-center text-muted-foreground border">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          Initializing Map...
        </div>
      </div>
    );
  }

  // Render helpers
  const renderMarkers = (color: string, radiusFn?: (p: Point) => number) =>
    points.map((p) => (
      <CircleMarker
        key={`m-${p.id}-${color}`}
        center={[p.lat, p.lon]}
        radius={radiusFn ? radiusFn(p) : 4}
        pathOptions={{ color, fillColor: color, fillOpacity: 0.8, weight: 1 }}
      >
        <Popup>
          <div className="text-sm">
            <div className="font-medium mb-1">Point {p.id}</div>
            <div>Temperature: {p.temp} °C</div>
            <div>Salinity: {p.salinity} PSU</div>
            <div>Species: {p.species}</div>
            {p.alerts ? (
              <div className="text-destructive mt-1">Alert: {p.alerts}</div>
            ) : null}
          </div>
        </Popup>
      </CircleMarker>
    ));

  return (
    <div className="relative w-full h-[560px] rounded-lg border overflow-hidden bg-muted/20">
      <MapContainer
        center={INDIA_CENTER}
        zoom={4}
        minZoom={3}
        maxZoom={9}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        {/* subtle ocean tile style */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {/* Heatmap via grid rectangles */}
        {layers.heat && (
          <LayerGroup>
            {heatCells.map((c, i) => (
              <Rectangle
                key={`heat-${i}`}
                bounds={c.bounds as any}
                pathOptions={{
                  color: "transparent",
                  fillColor: `oklch(${85 - c.intensity * 40}% ${
                    0.02 + c.intensity * 0.12
                  } 200)`,
                  fillOpacity: 0.35,
                }}
              />
            ))}
          </LayerGroup>
        )}

        {/* Clustered bubbles (hide individual markers to avoid clutter) */}
        {layers.cluster ? (
          <LayerGroup>
            {clusters.map((c, i) => (
              <Marker
                key={`c-${i}`}
                position={[c.lat, c.lon]}
                icon={makeClusterIcon(c.count)}
                interactive={false}
              />
            ))}
          </LayerGroup>
        ) : (
          <>
            {/* Oceanography markers: size by temperature */}
            {layers.ocean && (
              <LayerGroup>
                {renderMarkers("#0ea5e9", (p) =>
                  Math.max(3, Math.min(9, (p.temp - 10) * 0.6))
                )}
              </LayerGroup>
            )}
            {/* Biodiversity markers: teal/green emphasis */}
            {layers.bio && <LayerGroup>{renderMarkers("#10b981")}</LayerGroup>}
            {/* Fisheries markers: deep blue */}
            {layers.fish && <LayerGroup>{renderMarkers("#3b82f6")}</LayerGroup>}
          </>
        )}
      </MapContainer>
    </div>
  );
}
