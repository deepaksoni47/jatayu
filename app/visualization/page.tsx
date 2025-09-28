"use client";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { useMemo, useState, memo, useCallback, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Waves,
  FishSymbol,
  ThermometerSun,
  Layers,
  Grid2X2,
} from "lucide-react";
import dynamic from "next/dynamic";

// Create a separate map component that's only loaded client-side
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[560px] bg-muted/50 animate-pulse rounded-lg flex items-center justify-center text-muted-foreground border">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        Loading WebGIS Map...
      </div>
    </div>
  ),
});

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Point = {
  id: string;
  lat: number;
  lon: number;
  salinity: number;
  temp: number;
  species: string;
  alerts?: string;
};

export default function VisualizationPage() {
  // Leaflet CSS is loaded in layout.tsx

  const [time, setTime] = useState(0); // 0,1,2 for T1,T2,T3
  // ocean=Oceanography, bio=Biodiversity, fish=Fisheries, heat=Heatmap, cluster=Clustered Markers
  const [layers, setLayers] = useState({
    ocean: true,
    bio: true,
    fish: true,
    heat: true,
    cluster: true,
  });
  const files = [
    "/data/map_data_t1.json",
    "/data/map_data_t2.json",
    "/data/map_data_t3.json",
  ];
  const { data: points = [] } = useSWR<Point[]>(files[time], fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
  });

  // Memoized layer toggle handlers
  const handleLayerToggle = useCallback((layer: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const handleTimeChange = useCallback((newTime: number[]) => {
    setTime(newTime[0]);
  }, []);

  // Simple grid-based cluster buckets to avoid extra deps
  const clusters = useMemo(() => {
    if (!layers.cluster || !points?.length) return [];
    const grid = new Map<string, { lat: number; lon: number; count: number }>();
    const cellSize = 1.5; // degrees
    for (const p of points) {
      const gx = Math.floor(p.lon / cellSize) * cellSize + cellSize / 2;
      const gy = Math.floor(p.lat / cellSize) * cellSize + cellSize / 2;
      const key = `${gx.toFixed(2)}:${gy.toFixed(2)}`;
      const found = grid.get(key);
      if (found) found.count += 1;
      else grid.set(key, { lat: gy, lon: gx, count: 1 });
    }
    return [...grid.values()];
  }, [points, layers.cluster]);

  // Heatmap rectangles based on point density per 1° grid
  const heatCells = useMemo(() => {
    if (!layers.heat || !points?.length) return [];
    const cell = 1; // 1 degree
    const map = new Map<string, number>();
    for (const p of points) {
      const x = Math.floor(p.lon / cell) * cell;
      const y = Math.floor(p.lat / cell) * cell;
      const key = `${x}:${y}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    const max = Math.max(1, ...map.values());
    return [...map.entries()].map(([key, count]) => {
      const [x, y] = key.split(":").map(Number);
      const bounds: [[number, number], [number, number]] = [
        [y, x],
        [y + cell, x + cell],
      ];
      const intensity = count / max; // 0..1
      return { bounds, intensity };
    });
  }, [points, layers.heat]);

  // Debug: log current layers state
  console.log("Current layers state:", layers);

  return (
    <AppShell>
      {/* Interactive Map Status Header */}
      <div className="mb-6">
        <Card className="border-teal-500/20 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-teal-600 text-white text-xs font-semibold rounded">
                    WEBGIS
                  </div>
                  <div className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                    INTERACTIVE
                  </div>
                </div>
                <h2 className="font-semibold text-teal-900 dark:text-teal-100">
                  Interactive Marine Data Visualization
                </h2>
                <div className="space-y-1 text-sm text-teal-800 dark:text-teal-200">
                  <p>
                    Real-time interactive mapping with multiple data layers and
                    temporal controls.
                  </p>
                  <div className="flex items-center gap-4">
                    <span>• Interactive Map: ✅ Working</span>
                    <span>• Layer Controls: ✅ Functional</span>
                    <span>
                      • Real-time Updates: 🔄 Enhanced Version Planned
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-teal-600 dark:text-teal-400">
                Fully Functional
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Map View</CardTitle>
          </CardHeader>
          <CardContent>
            <MapComponent
              points={points}
              layers={layers}
              heatCells={heatCells}
              clusters={clusters}
            />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Layers & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "ocean", label: "Oceanography", icon: ThermometerSun },
              { key: "bio", label: "Biodiversity Hotspots", icon: Waves },
              { key: "fish", label: "Fisheries Zones", icon: FishSymbol },
              { key: "heat", label: "Heatmap", icon: Grid2X2 },
              { key: "cluster", label: "Clustered Markers", icon: Layers },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                  <span>{label}</span>
                </Label>
                <Switch
                  id={key}
                  checked={(layers as any)[key]}
                  onCheckedChange={(v) => {
                    console.log(`Toggling layer ${key} to ${v}`);
                    setLayers((s) => ({ ...s, [key]: v }));
                  }}
                />
              </div>
            ))}
            <div>
              <Label>Time</Label>
              <div className="mt-2">
                <Slider
                  min={0}
                  max={2}
                  step={1}
                  value={[time]}
                  onValueChange={(v) => setTime(v[0])}
                />
                <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                  <span
                    className={time === 0 ? "font-medium text-foreground" : ""}
                  >
                    T1
                  </span>
                  <span
                    className={time === 1 ? "font-medium text-foreground" : ""}
                  >
                    T2
                  </span>
                  <span
                    className={time === 2 ? "font-medium text-foreground" : ""}
                  >
                    T3
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Pan/zoom to explore coasts. Toggle layers for clarity. Popups show
              temp, salinity, species, and alerts.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
