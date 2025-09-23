"use client";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Memoized chart components to prevent unnecessary re-renders
const SpeciesTrendChart = memo(({ trend }: { trend: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={trend || []}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="detections"
        stroke="var(--chart-1)"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
));

const SourceDistributionChart = memo(({ dist }: { dist: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={dist || []}
        dataKey="value"
        nameKey="name"
        outerRadius={90}
        label
      >
        {(dist || []).map((_: any, idx: number) => (
          <Cell
            key={idx}
            fill={COLORS[idx % COLORS.length]}
            stroke="var(--card)"
            strokeWidth={1}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
));

const HabTimelineChart = memo(({ habTimeline }: { habTimeline: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={habTimeline || []}>
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="alerts"
        stroke="var(--chart-2)"
        fill="var(--chart-2)"
        fillOpacity={0.25}
      />
    </AreaChart>
  </ResponsiveContainer>
));

export default function DashboardPage() {
  // Reduced refresh interval to 30 seconds instead of 5 seconds
  const { data: summary } = useSWR("/data/dashboard.json", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });
  const { data: trend } = useSWR("/data/species_trend.json", fetcher, {
    revalidateOnFocus: false,
  });
  const { data: dist } = useSWR("/data/source_distribution.json", fetcher, {
    revalidateOnFocus: false,
  });
  const { data: habTimeline } = useSWR("/data/hab_timeline.json", fetcher, {
    revalidateOnFocus: false,
  });

  const anomalies = useMemo(
    () => summary?.anomalies ?? [],
    [summary?.anomalies]
  );

  const cards = useMemo(
    () => [
      { label: "Datasets Ingested", value: summary?.datasets ?? 0 },
      { label: "Species Detected", value: summary?.species ?? 0 },
      {
        label: "Active Alerts",
        value: summary?.alerts ?? 0,
        tone: "destructive" as const,
      },
      { label: "Running AI Jobs", value: summary?.jobs ?? 0 },
    ],
    [summary]
  );

  return (
    <AppShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, index) => {
          const variants = ["gradient", "ocean", "forest", "cosmic"];
          const variant =
            c.tone === "destructive"
              ? "sunset"
              : variants[index % variants.length];

          return (
            <Card
              key={c.label}
              variant={variant as any}
              hover="float"
              className={cn(
                "card-shimmer animate-fade-slide-in",
                c.tone === "destructive" &&
                  "!border-red-500/30 !shadow-red-500/20"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground text-pretty">
                  {c.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "text-2xl font-semibold transition-colors duration-300",
                    c.tone === "destructive" && "text-red-400"
                  )}
                >
                  {c.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card
          variant="glass"
          hover="glow"
          className="lg:col-span-2 card-shimmer animate-fade-slide-in"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Species Detection Trend
              <div className="h-2 w-2 bg-chart-1 rounded-full animate-pulse-glow"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <SpeciesTrendChart trend={trend} />
          </CardContent>
        </Card>

        <Card
          variant="ocean"
          hover="lift"
          className="card-shimmer animate-fade-slide-in"
          style={{ animationDelay: "500ms" }}
        >
          <CardHeader>
            <CardTitle>Data Source Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <SourceDistributionChart dist={dist} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card
          variant="cosmic"
          hover="glow"
          className="lg:col-span-2 card-shimmer animate-fade-slide-in"
          style={{ animationDelay: "600ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Real-time HAB Alerts Timeline
              <div className="h-2 w-2 bg-chart-2 rounded-full animate-gentle-float"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <HabTimelineChart habTimeline={habTimeline} />
          </CardContent>
        </Card>
        <Card
          variant="forest"
          hover="lift"
          className="card-shimmer animate-fade-slide-in"
          style={{ animationDelay: "700ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Notifications
              {anomalies.length > 0 && (
                <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse-glow"></div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-auto">
            {anomalies.map((a: any, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 p-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300"
              >
                <div className="text-sm font-medium text-foreground">
                  {a.title}
                </div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
                <div className="text-sm mt-1 text-card-foreground">
                  {a.detail}
                </div>
              </div>
            ))}
            {anomalies.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">
                <div className="text-green-400 text-2xl mb-2">✓</div>
                No new anomalies.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
