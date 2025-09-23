"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OceanHealthIndex,
  HealthStatus,
  getHealthColor,
  getHealthStatusText,
} from "@/lib/types/environmental";
import {
  HealthStatusBadge,
  TrendIcon,
  TrafficLightIndicator,
} from "./health-metrics";

// Ocean Health Index Detailed View
export const OHIDetailedView = ({ ohi }: { ohi: OceanHealthIndex }) => {
  const subIndicesData = Object.entries(ohi.sub_indices).map(
    ([key, value]) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: value.value,
      status: value.status,
      trend: value.trend,
      color:
        value.status === "healthy"
          ? "#22c55e"
          : value.status === "warning"
          ? "#eab308"
          : "#ef4444",
    })
  );

  // Historical trend data (mock data for demonstration)
  const historicalData = [
    { year: "2020", score: 75 },
    { year: "2021", score: 74 },
    { year: "2022", score: 73 },
    { year: "2023", score: 72 },
    { year: "2024", score: 72 },
    { year: "2025", score: ohi.composite_score.value },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card
        className={cn(
          "border-l-4",
          ohi.composite_score.status === "healthy"
            ? "border-l-green-500"
            : ohi.composite_score.status === "warning"
            ? "border-l-yellow-500"
            : "border-l-red-500"
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Heart className="h-6 w-6 text-blue-600" />
                Ocean Health Index
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {ohi.location.name} ({ohi.location.region})
                </span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(
                    ohi.composite_score.lastUpdated
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {ohi.composite_score.value}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <HealthStatusBadge status={ohi.composite_score.status} />
                <TrendIcon
                  trend={ohi.composite_score.trend}
                  className="h-5 w-5"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={ohi.composite_score.value} className="h-3" />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>Composite score based on 10 sub-indices</span>
              </div>
              <div>Coordinates: {ohi.location.coordinates.join(", ")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sub-indices Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sub-indices Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sub-Index Breakdown</h3>
          {subIndicesData.map((item, index) => (
            <Card
              key={index}
              className={cn(
                "transition-all duration-200 hover:shadow-md border-l-4",
                item.status === "healthy"
                  ? "border-l-green-500 hover:border-l-green-600"
                  : item.status === "warning"
                  ? "border-l-yellow-500 hover:border-l-yellow-600"
                  : "border-l-red-500 hover:border-l-red-600"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <HealthStatusBadge status={item.status} />
                    <TrendIcon trend={item.trend} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{item.value}</span>
                    <TrafficLightIndicator status={item.status} />
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Radial Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sub-Index Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="10%"
                  outerRadius="80%"
                  data={subIndicesData}
                >
                  <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Water Quality Detailed View Component
export const WaterQualityDetailedView = ({
  waterQuality,
}: {
  waterQuality: any[];
}) => {
  // Process data for charts
  const stationData = waterQuality.map((station, index) => ({
    station: station.location.name,
    do: station.dissolved_oxygen.value,
    ph: station.ph_level.value,
    turbidity: station.turbidity.value,
    chlorophyll: station.chlorophyll_a.value,
  }));

  const parametersOverview = [
    {
      parameter: "Dissolved Oxygen",
      unit: "mg/L",
      stations: waterQuality.map((s) => ({
        name: s.location.name,
        value: s.dissolved_oxygen.value,
        status: s.dissolved_oxygen.status,
        optimal: s.dissolved_oxygen.optimal_range,
      })),
    },
    {
      parameter: "pH Level",
      unit: "pH",
      stations: waterQuality.map((s) => ({
        name: s.ph_level.name,
        value: s.ph_level.value,
        status: s.ph_level.status,
        optimal: s.ph_level.optimal_range,
      })),
    },
    {
      parameter: "Turbidity",
      unit: "NTU",
      stations: waterQuality.map((s) => ({
        name: s.location.name,
        value: s.turbidity.value,
        status: s.turbidity.status,
        optimal: s.turbidity.optimal_range,
      })),
    },
    {
      parameter: "Chlorophyll-a",
      unit: "μg/L",
      stations: waterQuality.map((s) => ({
        name: s.location.name,
        value: s.chlorophyll_a.value,
        status: s.chlorophyll_a.status,
        optimal: s.chlorophyll_a.optimal_range,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Multi-parameter comparison chart */}
      <Card>
        <CardHeader>
          <CardTitle>Water Quality Parameters by Station</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="station" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="do"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="ph"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="turbidity"
                  stackId="3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="chlorophyll"
                  stackId="4"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Parameter Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parametersOverview.map((param, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{param.parameter}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {param.stations.map((station, stationIndex) => (
                  <div
                    key={stationIndex}
                    className={cn(
                      "p-3 rounded-lg border-2",
                      getHealthColor(station.status)
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {station.name}
                      </span>
                      <TrafficLightIndicator status={station.status} />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">{station.value}</span>
                      <span className="text-sm text-muted-foreground">
                        {param.unit}
                      </span>
                    </div>
                    {station.optimal && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Optimal range: {station.optimal[0]} -{" "}
                        {station.optimal[1]} {param.unit}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Export all components
export default {
  OHIDetailedView,
  WaterQualityDetailedView,
};
