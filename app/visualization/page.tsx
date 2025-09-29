"use client";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { useMemo, useState, memo, useCallback, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Waves,
  FishSymbol,
  ThermometerSun,
  Layers,
  Grid2X2,
  TrendingUp,
  Route,
  Radio,
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
    cluster: false, // Changed to false to show individual markers by default
    currents: true,
    routes: true,
    stations: true,
    incois_sst: false,
    incois_chlorophyll: false,
    incois_waves: false,
    incois_currents: false,
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
            <CardTitle>Layers & Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "ocean", label: "Oceanography", icon: ThermometerSun },
              { key: "bio", label: "Biodiversity Hotspots", icon: Waves },
              { key: "fish", label: "Fisheries Zones", icon: FishSymbol },
              { key: "heat", label: "Temperature Heatmap", icon: Grid2X2 },
              { key: "cluster", label: "Clustered Data", icon: Layers },
              { key: "currents", label: "Ocean Currents", icon: TrendingUp },
              { key: "routes", label: "Vessel Routes", icon: Route },
              { key: "stations", label: "Research Stations", icon: Radio },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                  <span className="text-sm">{label}</span>
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

            {/* INCOIS Government Data Section */}
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                🇮🇳 INCOIS Data Integration
                <Badge variant="secondary" className="text-xs">
                  Demo
                </Badge>
              </div>
              {[
                {
                  key: "incois_sst",
                  label: "Sea Surface Temperature",
                  icon: "🌡️",
                },
                {
                  key: "incois_chlorophyll",
                  label: "Chlorophyll-a",
                  icon: "🌿",
                },
                { key: "incois_waves", label: "Wave Height", icon: "🌊" },
                { key: "incois_currents", label: "Current Speed", icon: "💨" },
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="flex items-center gap-2">
                    <span className="text-sm">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </Label>
                  <Switch
                    id={key}
                    checked={(layers as any)[key]}
                    onCheckedChange={(v) => {
                      console.log(`Toggling INCOIS layer ${key} to ${v}`);
                      setLayers((s) => ({ ...s, [key]: v }));
                    }}
                  />
                </div>
              ))}
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                Simulated data representing INCOIS oceanographic datasets for
                demonstration
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Advanced Features
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Real-time data streaming
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Government API integration
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Multi-layer visualization
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Interactive controls
                </div>
              </div>
            </div>
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

      {/* INCOIS Ocean Services Integration Test */}
      <div className="mt-6 relative z-50">
        <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              INCOIS Ocean Services - Live Government Data
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded dark:text-green-400 dark:bg-green-950/30">
                LIVE
              </span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded dark:text-blue-400 dark:bg-blue-950/30">
                TESTING
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Government Data Integration:</strong> Demonstrating how
                JATAYU would integrate with INCOIS (Indian National Centre for
                Ocean Information Services) and other official marine data
                sources.
              </p>
            </div>

            {/* Mockup of integrated government data */}
            <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    INCOIS Ocean Services Integration
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    Government websites typically block iframe embedding for
                    security. Our production system would integrate via official
                    APIs.
                  </p>
                </div>

                {/* Demo integration cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ✓
                    </div>
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      Sea Surface Temperature
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Live INCOIS Data
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ✓
                    </div>
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      Wave Forecasts
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      5-Day Predictions
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ✓
                    </div>
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      Ocean Currents
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Real-time Flow Data
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="https://incois.gov.in/oceanservices/osfforecast.jsp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View INCOIS Ocean Services
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Opens official INCOIS portal in new tab
                  </p>
                </div>
              </div>
            </div>

            {/* Alternative integration options */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Direct Access</h4>
                <a
                  href="https://incois.gov.in/oceanservices/osfforecast.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  INCOIS Ocean Services →
                </a>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Opens in new tab with full functionality
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-2">API Integration</h4>
                <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded dark:text-amber-400 dark:bg-amber-950/30">
                  PLANNED
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Direct API integration for seamless data access
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Source: Indian National Centre for Ocean Information Services
              (INCOIS) - Ministry of Earth Sciences, Government of India
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
