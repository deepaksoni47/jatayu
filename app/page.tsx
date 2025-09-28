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
import { RecentDiscoveriesFeed } from "@/components/dashboard/recent-discoveries-feed";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Better colors for conservation status pie chart
const CONSERVATION_COLORS = [
  "#22c55e", // Green for Least Concern
  "#eab308", // Yellow for Near Threatened
  "#f97316", // Orange for Vulnerable
  "#ef4444", // Red for Endangered
  "#7c2d12", // Dark red for Critically Endangered
  "#6b7280", // Gray for Data Deficient
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
        dataKey="temperature"
        stroke="var(--chart-1)"
        strokeWidth={2}
        dot={false}
        name="Temperature (°C)"
      />
      <Line
        type="monotone"
        dataKey="salinity"
        stroke="var(--chart-3)"
        strokeWidth={2}
        dot={false}
        name="Salinity (psu)"
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
        cx="50%"
        cy="50%"
        innerRadius={45}
        outerRadius={90}
        paddingAngle={2}
        label={({ name, percent }: any) =>
          `${name}: ${(percent * 100).toFixed(0)}%`
        }
        labelLine={false}
      >
        {(dist || []).map((_: any, idx: number) => (
          <Cell
            key={idx}
            fill={CONSERVATION_COLORS[idx % CONSERVATION_COLORS.length]}
            stroke="var(--background)"
            strokeWidth={2}
          />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number, name: string) => [`${value} species`, name]}
        contentStyle={{
          backgroundColor: "hsl(var(--popover))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          color: "hsl(var(--popover-foreground))",
          fontSize: "14px",
          padding: "12px",
        }}
        labelStyle={{
          color: "hsl(var(--popover-foreground))",
          fontWeight: "600",
          marginBottom: "4px",
        }}
      />
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
        name="Total Alerts"
      />
      <Area
        type="monotone"
        dataKey="habAlerts"
        stroke="var(--chart-4)"
        fill="var(--chart-4)"
        fillOpacity={0.4}
        name="HAB Alerts"
      />
    </AreaChart>
  </ResponsiveContainer>
));

export default function Dashboard() {
  // Load realistic datasets
  const { data: summary } = useSWR("/data/dashboard.json", fetcher, {
    revalidateOnFocus: false,
  });
  const { data: oceanData } = useSWR(
    "/data/oceanographic_timeseries.json",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: speciesData } = useSWR(
    "/data/marine_species_database.json",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: alertsData } = useSWR(
    "/data/marine_alerts_system.json",
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Refresh alerts every 30 seconds
    }
  );
  const { data: aiData } = useSWR(
    "/data/ai_correlations_trends.json",
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh AI insights every minute
    }
  );
  const { data: discoveries } = useSWR(
    "/data/recent_discoveries.json",
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute for new discoveries
      revalidateOnFocus: false,
    }
  );

  // Process data for dashboard cards
  const cards = useMemo(() => {
    const activeAlerts = alertsData?.active_alerts?.length ?? 0;
    const totalSpecies = speciesData?.metadata?.total_species ?? 0;
    const runningJobs = aiData?.model_performance?.training_data_size
      ? Object.keys(aiData.model_performance.training_data_size).length
      : 0;
    const stationsOnline = oceanData?.metadata?.stations?.length ?? 0;

    return [
      { label: "Monitoring Stations", value: stationsOnline },
      { label: "Species Catalogued", value: totalSpecies },
      {
        label: "Active Alerts",
        value: activeAlerts,
        tone: activeAlerts > 3 ? ("destructive" as const) : undefined,
      },
      { label: "AI Models Running", value: runningJobs },
    ];
  }, [oceanData, speciesData, alertsData, aiData]);

  // Process oceanographic time series for trend chart
  const temperatureTrend = useMemo(() => {
    if (!oceanData?.timeseries_data) return [];

    return oceanData.timeseries_data
      .filter((d: any) => d.station_id === "BAY_01") // Focus on one station
      .map((d: any) => ({
        date: new Date(d.timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        temperature: d.measurements.temperature,
        salinity: d.measurements.salinity,
        ph: d.measurements.ph,
        oxygen: d.measurements.dissolved_oxygen,
      }))
      .reverse(); // Latest first
  }, [oceanData]);

  // Process species conservation status for pie chart
  const conservationData = useMemo(() => {
    if (!speciesData?.species_categories?.conservation_status) return [];

    return speciesData.species_categories.conservation_status.map(
      (status: any) => ({
        name: status.name,
        value: status.count,
        color: status.color,
      })
    );
  }, [speciesData]);

  // Process AI anomalies for notifications
  const anomalies = useMemo(() => {
    if (!aiData?.anomaly_detection?.active_anomalies) return [];

    return aiData.anomaly_detection.active_anomalies.map((anomaly: any) => ({
      title: anomaly.type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      time: new Date(anomaly.detected).toLocaleString(),
      detail: `${anomaly.parameter}: ${anomaly.detected_value} (Normal: ${anomaly.normal_range})`,
    }));
  }, [aiData]);

  // Process HAB alerts timeline
  const habTimelineData = useMemo(() => {
    if (!alertsData?.active_alerts) return [];

    // Create timeline from last 7 days with alert counts
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayAlerts = alertsData.active_alerts.filter((alert: any) => {
        const alertDate = new Date(alert.timestamp);
        return alertDate >= dayStart && alertDate <= dayEnd;
      }).length;

      days.push({
        timestamp: dayStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        alerts: dayAlerts,
        habAlerts: alertsData.active_alerts.filter(
          (alert: any) =>
            alert.category === "hab_bloom" &&
            new Date(alert.timestamp) >= dayStart &&
            new Date(alert.timestamp) <= dayEnd
        ).length,
      });
    }
    return days;
  }, [alertsData]);

  return (
    <AppShell>
      {/* Platform Status Header */}
      <div className="mb-6">
        <Card variant="gradient" className="border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                    JATAYU v1.0
                  </div>
                  <div className="px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-full">
                    DEVELOPMENT BUILD
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Marine Intelligence Platform
                </h1>
                <div className="space-y-2">
                  <p className="text-muted-foreground max-w-2xl">
                    AI-powered marine ecosystem monitoring for Indian coastal
                    waters. Current build demonstrates core data visualization
                    and basic analytics capabilities.
                  </p>
                  <div className="flex items-start gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 dark:text-green-400">
                        Dashboard, Charts
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                      <span className="text-amber-700 dark:text-amber-400">
                        AI Features (Demo)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Advanced Features (Planned)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>Build Date: Sept 2025</div>
                <div>Status: Active Development</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card
          variant="glass"
          hover="glow"
          className="card-shimmer animate-fade-slide-in"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Oceanographic Parameters (Mumbai Coast)
              <div className="h-2 w-2 bg-chart-1 rounded-full animate-pulse-glow"></div>
              <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded dark:text-emerald-400 dark:bg-emerald-950/30">
                WORKING
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <SpeciesTrendChart trend={temperatureTrend} />
          </CardContent>
        </Card>

        <Card
          variant="ocean"
          hover="lift"
          className="card-shimmer animate-fade-slide-in"
          style={{ animationDelay: "500ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Species Conservation Status
              <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded dark:text-emerald-400 dark:bg-emerald-950/30">
                WORKING
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <SourceDistributionChart dist={conservationData} />
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
              Marine Alerts Timeline (7 days)
              <div className="h-2 w-2 bg-chart-2 rounded-full animate-gentle-float"></div>
              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded dark:text-amber-400 dark:bg-amber-950/30">
                SIMULATED
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <HabTimelineChart habTimeline={habTimelineData} />
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
              AI Anomaly Detection
              {anomalies.length > 0 && (
                <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse-glow"></div>
              )}
              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded dark:text-amber-400 dark:bg-amber-950/30">
                DEMO
              </span>
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
                No AI anomalies detected.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Discoveries Feed - Full Width Section */}
      <div className="mt-6">
        <div
          className="card-shimmer animate-fade-slide-in w-full"
          style={{ animationDelay: "800ms" }}
        >
          <RecentDiscoveriesFeed data={discoveries} />
        </div>
      </div>
    </AppShell>
  );
}
