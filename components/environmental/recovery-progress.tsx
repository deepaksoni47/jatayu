"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TreePine,
  Fish,
  Waves,
  TrendingUp,
  Calendar,
  MapPin,
  Award,
  Target,
  Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecoveryProgress as RecoveryProgressType } from "@/lib/types/environmental";

// Circular progress component for completion meters
const CircularProgress = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = "text-green-600",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-300", color)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold">{percentage}%</span>
      </div>
    </div>
  );
};

// Get color based on progress percentage
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-blue-600";
  if (percentage >= 40) return "text-yellow-600";
  return "text-red-600";
};

// Get status badge color
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "on_track":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "delayed":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "at_risk":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Coral restoration progress component
const CoralRestoration = ({
  corals,
}: {
  corals: RecoveryProgressType["coral_reef_projects"];
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Waves className="h-5 w-5 text-blue-600" />
        Coral Restoration Progress
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {corals.map((coral) => (
          <div key={coral.project_id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{coral.project_name}</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {coral.location.name}
                </div>
              </div>
              <Badge className={getStatusBadgeColor(coral.status)}>
                {coral.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="flex items-center justify-center mb-4">
              <CircularProgress
                percentage={coral.current_progress_percent}
                color={getProgressColor(coral.current_progress_percent)}
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target Area:</span>
                <span>{coral.target_area_hectares} ha</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Restored:</span>
                <span>{coral.area_restored_hectares} ha</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Survival Rate:</span>
                <span
                  className={cn(
                    "font-medium",
                    coral.survival_rate_percent >= 80
                      ? "text-green-600"
                      : coral.survival_rate_percent >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  )}
                >
                  {coral.survival_rate_percent}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Timeline:</span>
                <span>
                  {coral.start_date} - {coral.target_completion}
                </span>
              </div>
            </div>

            {coral.coral_species_planted.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Species Planted
                </div>
                <div className="space-y-1">
                  {coral.coral_species_planted
                    .slice(0, 2)
                    .map((species, idx) => (
                      <div
                        key={idx}
                        className="text-xs flex items-center gap-1"
                      >
                        <Waves className="h-3 w-3 text-blue-500" />
                        {species}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Mangrove replantation progress component
const MangroveReplantation = ({
  mangroves,
}: {
  mangroves: RecoveryProgressType["mangrove_projects"];
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TreePine className="h-5 w-5 text-green-600" />
        Mangrove Replantation Progress
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mangroves.map((mangrove) => (
          <div key={mangrove.project_id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{mangrove.project_name}</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {mangrove.location.name}
                </div>
              </div>
              <Badge className={getStatusBadgeColor(mangrove.status)}>
                {mangrove.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="flex items-center justify-center mb-4">
              <CircularProgress
                percentage={mangrove.current_progress_percent}
                color={getProgressColor(mangrove.current_progress_percent)}
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target Trees:</span>
                <span>{mangrove.target_trees.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Planted:</span>
                <span>{mangrove.trees_planted.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Survival Rate:</span>
                <span
                  className={cn(
                    "font-medium",
                    mangrove.survival_rate_percent >= 80
                      ? "text-green-600"
                      : mangrove.survival_rate_percent >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  )}
                >
                  {mangrove.survival_rate_percent}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Community:</span>
                <span>{mangrove.community_involvement ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Progress Timeline
              </div>
              <Progress
                value={mangrove.current_progress_percent}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{mangrove.start_date}</span>
                <span>{mangrove.target_completion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Species recovery progress component
const SpeciesRecovery = ({
  species,
}: {
  species: RecoveryProgressType["species_recovery"];
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Fish className="h-5 w-5 text-blue-600" />
        Species Recovery Programs
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {species.map((speciesData, idx) => (
          <div
            key={`${speciesData.species_name}-${idx}`}
            className="border rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{speciesData.species_name}</h4>
                <div className="text-sm text-muted-foreground">
                  {speciesData.scientific_name}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {speciesData.location.name}
                </div>
              </div>
              <Badge
                className={cn(
                  "capitalize",
                  speciesData.conservation_status === "critically_endangered"
                    ? "bg-red-100 text-red-800 border-red-200"
                    : speciesData.conservation_status === "endangered"
                    ? "bg-orange-100 text-orange-800 border-orange-200"
                    : speciesData.conservation_status === "vulnerable"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : speciesData.conservation_status === "near_threatened"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-green-100 text-green-800 border-green-200"
                )}
              >
                {speciesData.conservation_status.replace("_", " ")}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {speciesData.current_population.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Current Pop.
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {speciesData.target_population.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Target Pop.</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recovery Progress</span>
                <span className="text-sm text-muted-foreground">
                  {speciesData.recovery_progress_percent}%
                </span>
              </div>
              <Progress
                value={speciesData.recovery_progress_percent}
                className="h-3"
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Population Trend:</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    speciesData.population_trend === "increasing"
                      ? "border-green-500 text-green-700"
                      : speciesData.population_trend === "stable"
                      ? "border-blue-500 text-blue-700"
                      : "border-red-500 text-red-700"
                  )}
                >
                  {speciesData.population_trend}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Program Start:</span>
                <span>{speciesData.program_start_date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Key Threats:</span>
                <span className="text-right">
                  {speciesData.key_threats.slice(0, 2).join(", ")}
                </span>
              </div>
            </div>

            {speciesData.conservation_measures.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Conservation Measures
                </div>
                <div className="space-y-1">
                  {speciesData.conservation_measures
                    .slice(0, 2)
                    .map((measure, idx) => (
                      <div
                        key={idx}
                        className="text-xs flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        {measure}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main Recovery Progress component
export const RecoveryProgressComponent = ({
  recoveryProgress,
}: {
  recoveryProgress: RecoveryProgressType;
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {recoveryProgress.coral_reef_projects.length}
                </div>
                <div className="text-sm text-muted-foreground">Coral Sites</div>
              </div>
              <Waves className="h-8 w-8 text-blue-600 opacity-60" />
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                Avg. Completion:{" "}
                {Math.round(
                  recoveryProgress.coral_reef_projects.reduce(
                    (sum: number, site) => sum + site.current_progress_percent,
                    0
                  ) / recoveryProgress.coral_reef_projects.length
                )}
                %
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {recoveryProgress.mangrove_projects
                    .reduce((sum: number, site) => sum + site.trees_planted, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Trees Planted
                </div>
              </div>
              <TreePine className="h-8 w-8 text-green-600 opacity-60" />
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                Across {recoveryProgress.mangrove_projects.length} sites
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {recoveryProgress.species_recovery.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Species Programs
                </div>
              </div>
              <Fish className="h-8 w-8 text-purple-600 opacity-60" />
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                Avg. Recovery:{" "}
                {Math.round(
                  recoveryProgress.species_recovery.reduce(
                    (sum: number, species) =>
                      sum + species.recovery_progress_percent,
                    0
                  ) / recoveryProgress.species_recovery.length
                )}
                %
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Sections */}
      <CoralRestoration corals={recoveryProgress.coral_reef_projects} />
      <MangroveReplantation mangroves={recoveryProgress.mangrove_projects} />
      <SpeciesRecovery species={recoveryProgress.species_recovery} />
    </div>
  );
};

export default RecoveryProgressComponent;
