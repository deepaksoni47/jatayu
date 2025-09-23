"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Heart,
  Droplets,
  AlertTriangle,
  Leaf,
  Map,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Eye,
} from "lucide-react";
import {
  EnvironmentalHealthData,
  HealthStatus,
  getHealthStatusText,
} from "@/lib/types/environmental";
import {
  HealthStatusBadge,
  TrafficLightIndicator,
  EnvironmentalSummaryStats,
  HealthMetricsGrid,
  HealthScoreCard,
} from "./health-metrics";
import { OHIDetailedView, WaterQualityDetailedView } from "./detailed-views";

// Real-time alerts component
const EnvironmentalAlerts = ({ data }: { data: EnvironmentalHealthData }) => {
  const criticalAlerts: Array<{
    type: string;
    message: string;
    severity: string;
    location: string;
  }> = [];

  // Check for critical OHI sub-indices
  Object.entries(data.ocean_health_index.sub_indices).forEach(
    ([key, value]) => {
      if (value.status === "critical") {
        criticalAlerts.push({
          type: "OHI",
          message: `${key.replace(/_/g, " ")} index is critical (${
            value.value
          })`,
          severity: "critical",
          location: data.ocean_health_index.location.name,
        });
      }
    }
  );

  // Check for critical water quality
  data.water_quality.forEach((station) => {
    if (station.dissolved_oxygen.status === "critical") {
      criticalAlerts.push({
        type: "Water Quality",
        message: `Low dissolved oxygen at ${station.location.name} (${station.dissolved_oxygen.value} ${station.dissolved_oxygen.unit})`,
        severity: "critical",
        location: station.location.name,
      });
    }
  });

  // Check for pollution alerts
  data.pollution_indicators.forEach((site) => {
    if (site.oil_spills.detected) {
      criticalAlerts.push({
        type: "Pollution",
        message: `Oil spill detected at ${site.location.name} - ${site.oil_spills.severity} severity`,
        severity: site.oil_spills.severity === "major" ? "critical" : "warning",
        location: site.location.name,
      });
    }
  });

  return (
    <div className="space-y-3">
      {criticalAlerts.length === 0 ? (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            No critical environmental alerts at this time.
          </AlertDescription>
        </Alert>
      ) : (
        criticalAlerts.map((alert, index) => (
          <Alert
            key={index}
            className={
              alert.severity === "critical"
                ? "border-red-200 bg-red-50"
                : "border-yellow-200 bg-yellow-50"
            }
          >
            <AlertTriangle
              className={`h-4 w-4 ${
                alert.severity === "critical"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            />
            <AlertDescription
              className={
                alert.severity === "critical"
                  ? "text-red-800"
                  : "text-yellow-800"
              }
            >
              <strong>{alert.type}:</strong> {alert.message}
              <br />
              <span className="text-sm">Location: {alert.location}</span>
            </AlertDescription>
          </Alert>
        ))
      )}
    </div>
  );
};

// Regional Health Map (simplified representation)
const RegionalHealthMap = ({ data }: { data: EnvironmentalHealthData }) => {
  const regions = [
    {
      name: data.ocean_health_index.location.name,
      ohi: data.ocean_health_index.composite_score.value,
      status: data.ocean_health_index.composite_score.status,
      coordinates: data.ocean_health_index.location.coordinates,
    },
    ...data.water_quality.map((station) => ({
      name: station.location.name,
      ohi: null,
      status: station.dissolved_oxygen.status, // Simplified status
      coordinates: station.location.coordinates,
    })),
    ...data.ecosystem_stress.map((site) => ({
      name: site.location.name,
      ohi: null,
      status: site.coral_bleaching.status,
      coordinates: site.location.coordinates,
    })),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Regional Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{region.name}</h4>
                <TrafficLightIndicator status={region.status} />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  Lat: {region.coordinates[0]}, Lng: {region.coordinates[1]}
                </div>
                {region.ohi && <div>OHI Score: {region.ohi}</div>}
                <Badge
                  className="mt-2"
                  variant={
                    region.status === "healthy"
                      ? "default"
                      : region.status === "warning"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {getHealthStatusText(region.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Environmental Dashboard Component
export const EnvironmentalDashboard = ({
  data,
}: {
  data: EnvironmentalHealthData;
}) => {
  // Calculate summary statistics
  const allIndicators = [
    ...Object.values(data.ocean_health_index.sub_indices),
    ...data.water_quality.flatMap((wq) => [
      wq.dissolved_oxygen,
      wq.ph_level,
      wq.turbidity,
      wq.chlorophyll_a,
    ]),
    ...data.pollution_indicators.flatMap((p) => [p.microplastics]),
    ...data.ecosystem_stress.flatMap((e) => [
      e.coral_bleaching,
      e.seagrass_loss,
      e.fish_mortality,
    ]),
  ];

  const healthyCount = allIndicators.filter(
    (i) => i.status === "healthy"
  ).length;
  const warningCount = allIndicators.filter(
    (i) => i.status === "warning"
  ).length;
  const criticalCount = allIndicators.filter(
    (i) => i.status === "critical"
  ).length;

  const keyMetrics = [
    {
      title: "Ocean Health Index",
      score: data.ocean_health_index.composite_score,
      icon: Heart,
      subtitle: data.ocean_health_index.location.name,
    },
    {
      title: "Water Quality Stations",
      score: {
        value: data.water_quality.length,
        status: data.water_quality.some(
          (w) => w.dissolved_oxygen.status === "critical"
        )
          ? ("critical" as HealthStatus)
          : data.water_quality.some(
              (w) => w.dissolved_oxygen.status === "warning"
            )
          ? ("warning" as HealthStatus)
          : ("healthy" as HealthStatus),
        trend: "stable" as const,
        lastUpdated: data.last_updated,
      },
      icon: Droplets,
      subtitle: "Active monitoring",
    },
    {
      title: "Pollution Sites",
      score: {
        value: data.pollution_indicators.length,
        status: data.pollution_indicators.some(
          (p) => p.microplastics.status === "critical"
        )
          ? ("critical" as HealthStatus)
          : data.pollution_indicators.some(
              (p) => p.microplastics.status === "warning"
            )
          ? ("warning" as HealthStatus)
          : ("healthy" as HealthStatus),
        trend: "declining" as const,
        lastUpdated: data.last_updated,
      },
      icon: AlertTriangle,
      subtitle: "Under observation",
    },
    {
      title: "Ecosystem Health",
      score: {
        value: data.ecosystem_stress.length,
        status: data.ecosystem_stress.some(
          (e) => e.coral_bleaching.status === "critical"
        )
          ? ("critical" as HealthStatus)
          : data.ecosystem_stress.some(
              (e) => e.coral_bleaching.status === "warning"
            )
          ? ("warning" as HealthStatus)
          : ("healthy" as HealthStatus),
        trend: "declining" as const,
        lastUpdated: data.last_updated,
      },
      icon: Leaf,
      subtitle: "Marine ecosystems",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Environmental Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Environmental Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnvironmentalAlerts data={data} />
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <EnvironmentalSummaryStats
        healthyCount={healthyCount}
        warningCount={warningCount}
        criticalCount={criticalCount}
        totalIndicators={allIndicators.length}
      />

      {/* Key Metrics */}
      <HealthMetricsGrid columns={4}>
        {keyMetrics.map((metric, index) => (
          <HealthScoreCard
            key={index}
            title={metric.title}
            score={metric.score}
            icon={metric.icon}
            subtitle={metric.subtitle}
          />
        ))}
      </HealthMetricsGrid>

      {/* Regional Health Map */}
      <RegionalHealthMap data={data} />

      {/* Detailed Tabs */}
      <Tabs defaultValue="ohi" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ohi">Ocean Health Index</TabsTrigger>
          <TabsTrigger value="water">Water Quality</TabsTrigger>
          <TabsTrigger value="pollution">Pollution</TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem Stress</TabsTrigger>
        </TabsList>

        <TabsContent value="ohi">
          <OHIDetailedView ohi={data.ocean_health_index} />
        </TabsContent>

        <TabsContent value="water">
          <WaterQualityDetailedView waterQuality={data.water_quality} />
        </TabsContent>

        <TabsContent value="pollution">
          <Card>
            <CardHeader>
              <CardTitle>Pollution Indicators Detail</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed pollution analysis view - microplastics, oil spills,
                and chemical contaminants.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecosystem">
          <Card>
            <CardHeader>
              <CardTitle>Ecosystem Stress Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Marine ecosystem health monitoring - coral bleaching, seagrass
                loss, and fish mortality events.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Source Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {data.data_sources.map((source, index) => (
              <Badge
                key={index}
                variant="outline"
                className="justify-center p-2"
              >
                {source}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalDashboard;
