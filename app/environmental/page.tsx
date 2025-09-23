"use client";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Waves,
  Droplets,
  AlertTriangle,
  Heart,
  ThermometerSun,
  Fish,
  Leaf,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";
import {
  EnvironmentalHealthData,
  HealthStatus,
  getHealthColor,
  getHealthStatusText,
} from "@/lib/types/environmental";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Traffic light color mapping
const getTrafficLightColor = (status: HealthStatus) => {
  switch (status) {
    case "healthy":
      return "#22c55e"; // green-500
    case "warning":
      return "#eab308"; // yellow-500
    case "critical":
      return "#ef4444"; // red-500
  }
};

// Status Badge Component
const StatusBadge = memo(({ status }: { status: HealthStatus }) => (
  <Badge className={cn("text-xs font-medium", getHealthColor(status))}>
    {getHealthStatusText(status)}
  </Badge>
));

// Trend Icon Component
const TrendIcon = memo(
  ({ trend }: { trend: "improving" | "stable" | "declining" }) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  }
);

// Ocean Health Index Overview Component
const OHIOverview = memo(
  ({ ohi }: { ohi: EnvironmentalHealthData["ocean_health_index"] }) => {
    const subIndicesData = Object.entries(ohi.sub_indices).map(
      ([key, value]) => ({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: value.value,
        status: value.status,
        color: getTrafficLightColor(value.status),
      })
    );

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-600" />
              Ocean Health Index - {ohi.location.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {ohi.composite_score.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  Composite Score
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={ohi.composite_score.status} />
                <TrendIcon trend={ohi.composite_score.trend} />
              </div>
            </div>
            <Progress value={ohi.composite_score.value} className="mb-4" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Sub-Index Breakdown</h4>
                <div className="space-y-2">
                  {subIndicesData.slice(0, 5).map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {item.value}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subIndicesData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {subIndicesData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

// Water Quality Dashboard Component
const WaterQualityDashboard = memo(
  ({
    waterQuality,
  }: {
    waterQuality: EnvironmentalHealthData["water_quality"];
  }) => {
    const stationSummary = waterQuality.map((station) => ({
      name: station.location.name,
      overallStatus: station.dissolved_oxygen.status, // Simplified - could be more complex
      coordinates: station.location.coordinates,
      metrics: {
        do: station.dissolved_oxygen,
        ph: station.ph_level,
        turbidity: station.turbidity,
        chlorophyll: station.chlorophyll_a,
      },
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stationSummary.map((station, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    {station.name}
                  </span>
                  <StatusBadge status={station.overallStatus} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>DO:</span>
                    <span
                      className={cn(
                        "font-medium",
                        getHealthColor(station.metrics.do.status)
                      )}
                    >
                      {station.metrics.do.value} {station.metrics.do.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>pH:</span>
                    <span
                      className={cn(
                        "font-medium",
                        getHealthColor(station.metrics.ph.status)
                      )}
                    >
                      {station.metrics.ph.value}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turbidity:</span>
                    <span
                      className={cn(
                        "font-medium",
                        getHealthColor(station.metrics.turbidity.status)
                      )}
                    >
                      {station.metrics.turbidity.value}{" "}
                      {station.metrics.turbidity.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chlorophyll-a:</span>
                    <span
                      className={cn(
                        "font-medium",
                        getHealthColor(station.metrics.chlorophyll.status)
                      )}
                    >
                      {station.metrics.chlorophyll.value}{" "}
                      {station.metrics.chlorophyll.unit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
);

// Pollution Indicators Component
const PollutionIndicators = memo(
  ({
    pollution,
  }: {
    pollution: EnvironmentalHealthData["pollution_indicators"];
  }) => {
    const pollutionSummary = pollution.map((site) => ({
      name: site.location.name,
      microplastics: site.microplastics,
      oilSpills: site.oil_spills,
      chemicals: site.chemical_contaminants,
    }));

    return (
      <div className="space-y-6">
        {pollutionSummary.map((site, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Pollution Status - {site.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Microplastics */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Microplastics</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Concentration:</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-medium",
                          getHealthColor(site.microplastics.status)
                        )}
                      >
                        {site.microplastics.concentration}{" "}
                        {site.microplastics.unit}
                      </span>
                      <StatusBadge status={site.microplastics.status} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Small: {site.microplastics.size_distribution.small} |
                    Medium: {site.microplastics.size_distribution.medium} |
                    Large: {site.microplastics.size_distribution.large}
                  </div>
                </div>

                {/* Oil Spills */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Oil Spills</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge
                      className={
                        site.oilSpills.detected
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {site.oilSpills.detected ? "Detected" : "None"}
                    </Badge>
                  </div>
                  {site.oilSpills.detected && (
                    <div className="text-xs text-muted-foreground">
                      Severity: {site.oilSpills.severity} | Area:{" "}
                      {site.oilSpills.area_affected} km²
                    </div>
                  )}
                </div>

                {/* Chemical Contaminants */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Heavy Metals</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Mercury:</span>
                      <span
                        className={cn(
                          "font-medium",
                          getHealthColor(
                            site.chemicals.heavy_metals.mercury.status
                          )
                        )}
                      >
                        {site.chemicals.heavy_metals.mercury.value}{" "}
                        {site.chemicals.heavy_metals.mercury.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead:</span>
                      <span
                        className={cn(
                          "font-medium",
                          getHealthColor(
                            site.chemicals.heavy_metals.lead.status
                          )
                        )}
                      >
                        {site.chemicals.heavy_metals.lead.value}{" "}
                        {site.chemicals.heavy_metals.lead.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
);

// Ecosystem Stress Component
const EcosystemStress = memo(
  ({ stress }: { stress: EnvironmentalHealthData["ecosystem_stress"] }) => {
    return (
      <div className="space-y-6">
        {stress.map((site, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Ecosystem Health - {site.location.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coral Bleaching */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <ThermometerSun className="h-4 w-4" />
                    Coral Bleaching
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bleaching Index:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {site.coral_bleaching.index}
                        </span>
                        <StatusBadge status={site.coral_bleaching.status} />
                      </div>
                    </div>
                    <Progress
                      value={site.coral_bleaching.index}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {site.coral_bleaching.affected_area_percent}% area
                      affected |
                      {site.coral_bleaching.temperature_stress.current_temp}°C
                      current temp
                    </div>
                  </div>
                </div>

                {/* Seagrass Loss */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Seagrass Coverage
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Coverage:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {site.seagrass_loss.coverage_percent}%
                        </span>
                        <StatusBadge status={site.seagrass_loss.status} />
                      </div>
                    </div>
                    <Progress
                      value={site.seagrass_loss.coverage_percent}
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      Baseline: {site.seagrass_loss.historical_baseline}% | Loss
                      rate: {site.seagrass_loss.loss_rate_percent}%/year
                    </div>
                  </div>
                </div>

                {/* Fish Mortality */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Fish className="h-4 w-4" />
                    Fish Mortality Events
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Events:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {site.fish_mortality.events_detected}
                        </span>
                        <StatusBadge status={site.fish_mortality.status} />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Estimated deaths:{" "}
                      {site.fish_mortality.estimated_deaths.toLocaleString()} |
                      Severity: {site.fish_mortality.severity}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
);

export default function EnvironmentalHealthPage() {
  const { data, error, isLoading } = useSWR<EnvironmentalHealthData>(
    "/data/environmental_health.json",
    fetcher,
    { refreshInterval: 30000 }
  );

  if (error) {
    return (
      <AppShell>
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>Failed to load environmental health data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (isLoading || !data) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Environmental Health Metrics & Indices
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive ocean and marine ecosystem health monitoring with
              traffic-light indicators
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ohi">Ocean Health Index</TabsTrigger>
            <TabsTrigger value="water">Water Quality</TabsTrigger>
            <TabsTrigger value="pollution">Pollution</TabsTrigger>
            <TabsTrigger value="ecosystem">Ecosystem Stress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ocean Health Index
                      </p>
                      <p className="text-2xl font-bold">
                        {data.ocean_health_index.composite_score.value}
                      </p>
                    </div>
                    <StatusBadge
                      status={data.ocean_health_index.composite_score.status}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Water Quality Stations
                      </p>
                      <p className="text-2xl font-bold">
                        {data.water_quality.length}
                      </p>
                    </div>
                    <Droplets className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pollution Sites
                      </p>
                      <p className="text-2xl font-bold">
                        {data.pollution_indicators.length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ecosystem Monitoring
                      </p>
                      <p className="text-2xl font-bold">
                        {data.ecosystem_stress.length}
                      </p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Health Status Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-green-600 font-semibold">
                      Healthy Indicators
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {
                        [
                          ...Object.values(data.ocean_health_index.sub_indices),
                          ...data.water_quality.flatMap((wq) => [
                            wq.dissolved_oxygen,
                            wq.ph_level,
                            wq.turbidity,
                            wq.chlorophyll_a,
                          ]),
                          ...data.pollution_indicators.flatMap((p) => [
                            p.microplastics,
                          ]),
                          ...data.ecosystem_stress.flatMap((e) => [
                            e.coral_bleaching,
                            e.seagrass_loss,
                            e.fish_mortality,
                          ]),
                        ].filter((item) => item.status === "healthy").length
                      }
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="text-yellow-600 font-semibold">Warning</div>
                    <div className="text-2xl font-bold text-yellow-700">
                      {
                        [
                          ...Object.values(data.ocean_health_index.sub_indices),
                          ...data.water_quality.flatMap((wq) => [
                            wq.dissolved_oxygen,
                            wq.ph_level,
                            wq.turbidity,
                            wq.chlorophyll_a,
                          ]),
                          ...data.pollution_indicators.flatMap((p) => [
                            p.microplastics,
                          ]),
                          ...data.ecosystem_stress.flatMap((e) => [
                            e.coral_bleaching,
                            e.seagrass_loss,
                            e.fish_mortality,
                          ]),
                        ].filter((item) => item.status === "warning").length
                      }
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="text-red-600 font-semibold">Critical</div>
                    <div className="text-2xl font-bold text-red-700">
                      {
                        [
                          ...Object.values(data.ocean_health_index.sub_indices),
                          ...data.water_quality.flatMap((wq) => [
                            wq.dissolved_oxygen,
                            wq.ph_level,
                            wq.turbidity,
                            wq.chlorophyll_a,
                          ]),
                          ...data.pollution_indicators.flatMap((p) => [
                            p.microplastics,
                          ]),
                          ...data.ecosystem_stress.flatMap((e) => [
                            e.coral_bleaching,
                            e.seagrass_loss,
                            e.fish_mortality,
                          ]),
                        ].filter((item) => item.status === "critical").length
                      }
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-blue-600 font-semibold">
                      Data Sources
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {data.data_sources.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ohi">
            <OHIOverview ohi={data.ocean_health_index} />
          </TabsContent>

          <TabsContent value="water">
            <WaterQualityDashboard waterQuality={data.water_quality} />
          </TabsContent>

          <TabsContent value="pollution">
            <PollutionIndicators pollution={data.pollution_indicators} />
          </TabsContent>

          <TabsContent value="ecosystem">
            <EcosystemStress stress={data.ecosystem_stress} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
