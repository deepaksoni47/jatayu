"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Waves,
  Zap,
  Droplets,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  Shield,
  Flame,
  Wind,
  Skull,
  Factory,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OceanAlerts,
  HABAlert,
  ExtremeEvent,
  PollutionSpike,
} from "@/lib/types/environmental";

// Severity color mapping
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
    case "minor":
      return "text-green-600 bg-green-50 border-green-200";
    case "moderate":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "high":
    case "major":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "extreme":
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    case "monitoring":
    case "warning":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "resolved":
    case "healthy":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

// Alert type icons
const getAlertIcon = (type: string) => {
  switch (type) {
    case "cyclone":
      return Wind;
    case "tsunami":
      return Waves;
    case "ocean_heatwave":
      return Flame;
    case "dead_zone":
      return Skull;
    case "storm_surge":
      return Waves;
    default:
      return AlertTriangle;
  }
};

// Pollutant type icons
const getPollutantIcon = (type: string) => {
  switch (type) {
    case "oil":
      return Droplets;
    case "chemical":
      return Factory;
    case "plastic":
      return Factory;
    case "sewage":
      return Droplets;
    case "industrial":
      return Factory;
    default:
      return AlertTriangle;
  }
};

// HAB Alerts Component
const HABAlerts = ({ alerts }: { alerts: HABAlert[] }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Waves className="h-5 w-5 text-blue-600" />
        Harmful Algal Bloom Alerts
      </h3>
      <Badge className="bg-blue-100 text-blue-800">
        {alerts.length} Active
      </Badge>
    </div>

    {alerts.length === 0 ? (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Waves className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No active HAB alerts</p>
        </CardContent>
      </Card>
    ) : (
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={cn("border-l-4", getSeverityColor(alert.severity))}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {alert.species}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{alert.location.name}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.charAt(0).toUpperCase() +
                      alert.severity.slice(1)}
                  </Badge>
                  <Badge className={getStatusColor(alert.status)}>
                    {alert.status.charAt(0).toUpperCase() +
                      alert.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Concentration:</span>
                  <div className="font-medium">
                    {alert.concentration.toLocaleString()} {alert.unit}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Affected Area:</span>
                  <div className="font-medium">
                    {alert.affected_area_km2} km²
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Toxin Level:</span>
                  <div className="font-medium">{alert.toxin_level}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="font-medium">{alert.estimated_duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  Detected: {new Date(alert.detected_at).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

// Extreme Events Component
const ExtremeEvents = ({ events }: { events: ExtremeEvent[] }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Zap className="h-5 w-5 text-orange-600" />
        Extreme Events
      </h3>
      <Badge className="bg-orange-100 text-orange-800">
        {events.filter((e) => e.status === "active").length} Active
      </Badge>
    </div>

    {events.length === 0 ? (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No extreme events detected</p>
        </CardContent>
      </Card>
    ) : (
      <div className="space-y-3">
        {events.map((event) => {
          const IconComponent = getAlertIcon(event.type);
          return (
            <Card
              key={event.id}
              className={cn("border-l-4", getSeverityColor(event.severity))}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {event.name ||
                        event.type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location.name}</span>
                      {event.location.radius_km && (
                        <span>(Radius: {event.location.radius_km} km)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity.charAt(0).toUpperCase() +
                        event.severity.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {event.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Marine Impact:
                    </span>
                    <div className="font-medium capitalize">
                      {event.marine_impact_level}
                    </div>
                  </div>
                  {event.peak_intensity && (
                    <div>
                      <span className="text-muted-foreground">
                        Peak Intensity:
                      </span>
                      <div className="font-medium">
                        {event.peak_intensity}
                        {event.type === "cyclone" ? " km/h" : "°C"}
                      </div>
                    </div>
                  )}
                  {event.affected_population && (
                    <div>
                      <span className="text-muted-foreground">
                        Affected Population:
                      </span>
                      <div className="font-medium">
                        {event.affected_population.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Started: {new Date(event.start_time).toLocaleString()}
                    </span>
                  </div>
                  {event.end_time && (
                    <div className="flex items-center gap-1">
                      <span>
                        Ended: {new Date(event.end_time).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    )}
  </div>
);

// Pollution Spikes Component
const PollutionSpikes = ({ spikes }: { spikes: PollutionSpike[] }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Factory className="h-5 w-5 text-red-600" />
        Pollution Spikes
      </h3>
      <Badge className="bg-red-100 text-red-800">
        {spikes.length} Detected
      </Badge>
    </div>

    {spikes.length === 0 ? (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No pollution spikes detected</p>
        </CardContent>
      </Card>
    ) : (
      <div className="space-y-3">
        {spikes.map((spike) => {
          const IconComponent = getPollutantIcon(spike.pollutant_type);
          return (
            <Card
              key={spike.id}
              className={cn("border-l-4", getSeverityColor(spike.severity))}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {spike.pollutant_type.charAt(0).toUpperCase() +
                        spike.pollutant_type.slice(1)}{" "}
                      Pollution
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{spike.location.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getSeverityColor(spike.severity)}>
                      {spike.severity.charAt(0).toUpperCase() +
                        spike.severity.slice(1)}
                    </Badge>
                    <Badge
                      className={
                        spike.source_identified
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {spike.source_identified
                        ? "Source Known"
                        : "Source Unknown"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">
                      Concentration:
                    </span>
                    <div className="font-medium">
                      {spike.concentration} {spike.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Baseline:</span>
                    <div className="font-medium">
                      {spike.baseline_level} {spike.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Spike Factor:</span>
                    <div className="font-medium text-red-600">
                      {spike.spike_factor}x
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Containment:</span>
                    <div className="font-medium capitalize">
                      {spike.containment_status}
                    </div>
                  </div>
                </div>

                {spike.source_description && (
                  <Alert className="mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Source:</strong> {spike.source_description}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Detected: {new Date(spike.detected_at).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    )}
  </div>
);

// Main Ocean Alerts Component
export const OceanAlertsComponent = ({
  oceanAlerts,
}: {
  oceanAlerts: OceanAlerts;
}) => {
  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-600" />
                Ocean Alert Dashboard
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Real-time monitoring of marine hazards and environmental threats
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {oceanAlerts.total_active_alerts}
              </div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-blue-600 font-semibold">HAB Alerts</div>
              <div className="text-xl font-bold text-blue-700">
                {oceanAlerts.hab_alerts.length}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="text-orange-600 font-semibold">
                Extreme Events
              </div>
              <div className="text-xl font-bold text-orange-700">
                {
                  oceanAlerts.extreme_events.filter(
                    (e) => e.status === "active"
                  ).length
                }
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="text-red-600 font-semibold">Pollution Spikes</div>
              <div className="text-xl font-bold text-red-700">
                {oceanAlerts.pollution_spikes.length}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
            <Eye className="h-3 w-3" />
            <span>
              Last updated:{" "}
              {new Date(oceanAlerts.last_updated).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Alert Sections */}
      <HABAlerts alerts={oceanAlerts.hab_alerts} />
      <ExtremeEvents events={oceanAlerts.extreme_events} />
      <PollutionSpikes spikes={oceanAlerts.pollution_spikes} />
    </div>
  );
};

export default OceanAlertsComponent;
