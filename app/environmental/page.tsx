"use client";
import { Suspense } from "react";
import AppShell from "@/components/layout/app-shell";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  Globe,
  Leaf,
  TrendingUp,
  Waves,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnvironmentalHealthData } from "@/lib/types/environmental";

// Import all environmental components
import { OceanAlertsComponent } from "@/components/environmental/ocean-alerts";
import { DataUpdatesComponent } from "@/components/environmental/data-updates";
import { RecoveryProgressComponent } from "@/components/environmental/recovery-progress";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

// Error component
const ErrorAlert = ({ error }: { error: Error }) => (
  <Alert className="border-red-200 bg-red-50">
    <AlertTriangle className="h-4 w-4 text-red-600" />
    <AlertDescription className="text-red-800">
      Failed to load environmental data: {error.message}
    </AlertDescription>
  </Alert>
);

// Health status indicator component
const HealthStatusIndicator = ({
  status,
  value,
  label,
  icon: Icon,
}: {
  status: "healthy" | "warning" | "critical";
  value: string | number;
  label: string;
  icon: any;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
          <div className={cn("p-2 rounded-full", getStatusColor(status))}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-2">
          <Badge className={cn("text-xs", getStatusColor(status))}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// Overview metrics component
const OverviewMetrics = ({ data }: { data: EnvironmentalHealthData }) => {
  // Calculate overall health metrics
  const oceanHealthScore = data.ocean_health_index.composite_score.value;
  const activeAlerts =
    data.ocean_alerts.hab_alerts.filter(
      (alert) => alert.severity === "high" || alert.severity === "extreme"
    ).length +
    data.ocean_alerts.extreme_events.filter(
      (event) => event.severity === "major" || event.severity === "extreme"
    ).length +
    data.ocean_alerts.pollution_spikes.filter(
      (spike) => spike.severity === "major" || spike.severity === "critical"
    ).length;

  const waterQualityHealthy = data.water_quality.filter(
    (wq) =>
      wq.dissolved_oxygen.status === "healthy" &&
      wq.ph_level.status === "healthy" &&
      wq.turbidity.status === "healthy"
  ).length;

  const recoveryProjects =
    data.recovery_progress.coral_reef_projects.length +
    data.recovery_progress.mangrove_projects.length +
    data.recovery_progress.species_recovery.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <HealthStatusIndicator
        status={
          oceanHealthScore >= 80
            ? "healthy"
            : oceanHealthScore >= 60
            ? "warning"
            : "critical"
        }
        value={oceanHealthScore}
        label="Ocean Health Index"
        icon={Globe}
      />
      <HealthStatusIndicator
        status={
          activeAlerts === 0
            ? "healthy"
            : activeAlerts <= 2
            ? "warning"
            : "critical"
        }
        value={activeAlerts}
        label="Active Alerts"
        icon={AlertTriangle}
      />
      <HealthStatusIndicator
        status={
          waterQualityHealthy >= 3
            ? "healthy"
            : waterQualityHealthy >= 2
            ? "warning"
            : "critical"
        }
        value={`${waterQualityHealthy}/${data.water_quality.length}`}
        label="Healthy Sites"
        icon={Droplets}
      />
      <HealthStatusIndicator
        status={
          recoveryProjects >= 10
            ? "healthy"
            : recoveryProjects >= 5
            ? "warning"
            : "critical"
        }
        value={recoveryProjects}
        label="Recovery Projects"
        icon={TrendingUp}
      />
    </div>
  );
};

// Main Environmental Health Dashboard
export default function EnvironmentalHealthPage() {
  const { data, error, isLoading } = useSWR<EnvironmentalHealthData>(
    "/data/environmental_health.json",
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
    }
  );

  if (error)
    return (
      <AppShell>
        <ErrorAlert error={error} />
      </AppShell>
    );
  if (isLoading || !data)
    return (
      <AppShell>
        <LoadingSkeleton />
      </AppShell>
    );

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Environmental Health Metrics & Indices
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive monitoring of ocean health, water quality, and
              ecosystem recovery
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </div>
        </div>

        {/* Overview Metrics */}
        <OverviewMetrics data={data} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Ocean Alerts
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Data Updates
            </TabsTrigger>
            <TabsTrigger value="recovery" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Recovery Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <OceanAlertsComponent oceanAlerts={data.ocean_alerts} />
            </Suspense>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <DataUpdatesComponent dataUpdates={data.data_updates} />
            </Suspense>
          </TabsContent>

          <TabsContent value="recovery" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <RecoveryProgressComponent
                recoveryProgress={data.recovery_progress}
              />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* Footer Information */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span>Real-time monitoring active</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span>Auto-refresh: 5 minutes</span>
                </div>
              </div>
              <div className="text-muted-foreground">
                Data sources: {data.data_sources.join(", ")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
