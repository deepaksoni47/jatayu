"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  HealthStatus,
  HealthScore,
  getHealthColor,
  getHealthStatusText,
} from "@/lib/types/environmental";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Droplets,
  Thermometer,
  Eye,
  Beaker,
} from "lucide-react";

// Trend Icon Component
export const TrendIcon = ({
  trend,
  className,
}: {
  trend: "improving" | "stable" | "declining";
  className?: string;
}) => {
  switch (trend) {
    case "improving":
      return <TrendingUp className={cn("h-4 w-4 text-green-600", className)} />;
    case "declining":
      return <TrendingDown className={cn("h-4 w-4 text-red-600", className)} />;
    case "stable":
      return <Minus className={cn("h-4 w-4 text-gray-600", className)} />;
  }
};

// Status Badge Component with Traffic Light Colors
export const HealthStatusBadge = ({
  status,
  className,
}: {
  status: HealthStatus;
  className?: string;
}) => (
  <Badge
    className={cn("text-xs font-medium", getHealthColor(status), className)}
  >
    {getHealthStatusText(status)}
  </Badge>
);

// Status Icon Component
export const HealthStatusIcon = ({
  status,
  className,
}: {
  status: HealthStatus;
  className?: string;
}) => {
  switch (status) {
    case "healthy":
      return (
        <CheckCircle className={cn("h-5 w-5 text-green-600", className)} />
      );
    case "warning":
      return (
        <AlertTriangle className={cn("h-5 w-5 text-yellow-600", className)} />
      );
    case "critical":
      return <XCircle className={cn("h-5 w-5 text-red-600", className)} />;
  }
};

// Health Score Card Component
export const HealthScoreCard = ({
  title,
  score,
  icon: Icon,
  subtitle,
}: {
  title: string;
  score: HealthScore;
  icon?: any;
  subtitle?: string;
}) => (
  <Card
    className={cn(
      "transition-all duration-200 hover:shadow-md border-l-4",
      score.status === "healthy"
        ? "border-l-green-500"
        : score.status === "warning"
        ? "border-l-yellow-500"
        : "border-l-red-500"
    )}
  >
    <CardHeader className="pb-2">
      <CardTitle className="text-base flex items-center justify-between">
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {title}
        </span>
        <div className="flex items-center gap-2">
          <HealthStatusBadge status={score.status} />
          <TrendIcon trend={score.trend} />
        </div>
      </CardTitle>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{score.value}</span>
          <HealthStatusIcon status={score.status} />
        </div>
        <Progress
          value={score.value}
          className={cn(
            "h-2",
            score.status === "healthy"
              ? "bg-green-100"
              : score.status === "warning"
              ? "bg-yellow-100"
              : "bg-red-100"
          )}
        />
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(score.lastUpdated).toLocaleString()}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Water Quality Metric Component
export const WaterQualityMetric = ({
  label,
  value,
  unit,
  status,
  optimalRange,
  icon: Icon = Droplets,
}: {
  label: string;
  value: number;
  unit: string;
  status: HealthStatus;
  optimalRange?: [number, number];
  icon?: any;
}) => {
  const isInRange = optimalRange
    ? value >= optimalRange[0] && value <= optimalRange[1]
    : true;

  return (
    <div
      className={cn(
        "p-3 rounded-lg border-2 transition-all duration-200",
        getHealthColor(status),
        "hover:shadow-sm"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium text-sm">{label}</span>
        </div>
        <HealthStatusIcon status={status} className="h-4 w-4" />
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>

        {optimalRange && (
          <div className="text-xs text-muted-foreground">
            Optimal: {optimalRange[0]} - {optimalRange[1]} {unit}
            {!isInRange && (
              <span className="ml-2 text-red-600 font-medium">
                Out of range
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Traffic Light Indicator Component
export const TrafficLightIndicator = ({
  status,
  size = "default",
  showLabel = false,
}: {
  status: HealthStatus;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-6 w-6",
  };

  const colors = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full border-2 border-gray-200 shadow-sm",
          sizeClasses[size],
          colors[status]
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {getHealthStatusText(status)}
        </span>
      )}
    </div>
  );
};

// Pollution Alert Component
export const PollutionAlert = ({
  detected,
  severity,
  substance,
  value,
  unit,
}: {
  detected: boolean;
  severity:
    | "none"
    | "minor"
    | "moderate"
    | "major"
    | "low"
    | "high"
    | "extreme";
  substance: string;
  value?: number;
  unit?: string;
}) => {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "none":
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "minor":
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "major":
      case "high":
      case "extreme":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={cn("p-3 rounded-lg border", getSeverityColor(severity))}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{substance}</span>
        <Badge className={getSeverityColor(severity)}>
          {detected
            ? severity.charAt(0).toUpperCase() + severity.slice(1)
            : "Not Detected"}
        </Badge>
      </div>

      {detected && value !== undefined && (
        <div className="text-sm">
          <span className="font-medium">{value}</span>
          {unit && <span className="text-muted-foreground ml-1">{unit}</span>}
        </div>
      )}
    </div>
  );
};

// Ecosystem Health Summary Component
export const EcosystemHealthSummary = ({
  title,
  metrics,
  location,
}: {
  title: string;
  metrics: {
    label: string;
    value: number | string;
    status: HealthStatus;
    unit?: string;
  }[];
  location: string;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center justify-between">
        <span>{title}</span>
        <span className="text-sm text-muted-foreground font-normal">
          {location}
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm">{metric.label}:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {metric.value}
              {metric.unit && ` ${metric.unit}`}
            </span>
            <TrafficLightIndicator status={metric.status} size="sm" />
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Health Metrics Grid Component
export const HealthMetricsGrid = ({
  children,
  columns = 3,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridClasses[columns])}>{children}</div>
  );
};

// Environmental Summary Stats Component
export const EnvironmentalSummaryStats = ({
  healthyCount,
  warningCount,
  criticalCount,
  totalIndicators,
}: {
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  totalIndicators: number;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Healthy</p>
            <p className="text-2xl font-bold text-green-600">{healthyCount}</p>
            <p className="text-xs text-muted-foreground">
              {((healthyCount / totalIndicators) * 100).toFixed(1)}% of total
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </CardContent>
    </Card>

    <Card className="border-l-4 border-l-yellow-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Warning</p>
            <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
            <p className="text-xs text-muted-foreground">
              {((warningCount / totalIndicators) * 100).toFixed(1)}% of total
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
      </CardContent>
    </Card>

    <Card className="border-l-4 border-l-red-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">
              {((criticalCount / totalIndicators) * 100).toFixed(1)}% of total
            </p>
          </div>
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
      </CardContent>
    </Card>

    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Indicators</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalIndicators}
            </p>
            <p className="text-xs text-muted-foreground">Monitoring points</p>
          </div>
          <Eye className="h-8 w-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Metric Icons for different types
export const MetricIcons = {
  dissolved_oxygen: Droplets,
  ph_level: Beaker,
  turbidity: Eye,
  chlorophyll: Droplets,
  temperature: Thermometer,
  default: Droplets,
};
