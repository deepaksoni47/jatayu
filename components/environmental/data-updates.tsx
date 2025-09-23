"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader,
  FileText,
  Globe,
  Calendar,
  User,
  HardDrive,
  Activity,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  DataUpdates as DataUpdatesType,
  DatasetIngestion,
  NewDataset,
  PendingVerification,
} from "@/lib/types/environmental";

// Status color mapping for ingestion
const getIngestionStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50 border-green-200";
    case "in_progress":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "failed":
      return "text-red-600 bg-red-50 border-red-200";
    case "pending":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

// Priority color mapping
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "text-red-600 bg-red-50 border-red-200";
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

// Status icons
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "in_progress":
      return Loader;
    case "failed":
      return XCircle;
    case "pending":
      return Clock;
    default:
      return AlertTriangle;
  }
};

// Data type icons
const getDataTypeIcon = (type: string) => {
  switch (type) {
    case "satellite":
      return Globe;
    case "sensor":
      return Activity;
    case "survey":
      return FileText;
    case "model":
      return TrendingUp;
    case "citizen_science":
      return User;
    default:
      return Database;
  }
};

// Recent Ingestions Component
const RecentIngestions = ({
  ingestions,
}: {
  ingestions: DatasetIngestion[];
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Upload className="h-5 w-5 text-blue-600" />
        Recent Data Ingestions
      </h3>
      <Badge className="bg-blue-100 text-blue-800">
        {ingestions.filter((i) => i.status === "completed").length} Completed
        Today
      </Badge>
    </div>

    <div className="space-y-3">
      {ingestions.map((ingestion, index) => {
        const StatusIcon = getStatusIcon(ingestion.status);
        return (
          <Card
            key={index}
            className={cn(
              "border-l-4",
              getIngestionStatusColor(ingestion.status)
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {ingestion.dataset_name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Source: {ingestion.source}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-4 w-4" />
                  <Badge className={getIngestionStatusColor(ingestion.status)}>
                    {ingestion.status
                      .replace("_", " ")
                      .charAt(0)
                      .toUpperCase() +
                      ingestion.status.replace("_", " ").slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Records:</span>
                  <div className="font-medium">
                    {ingestion.records_processed.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <div className="font-medium">{ingestion.file_size_mb} MB</div>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Processing Time:
                  </span>
                  <div className="font-medium">
                    {ingestion.processing_time_minutes} min
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality Score:</span>
                  <div className="font-medium">{ingestion.quality_score}%</div>
                </div>
              </div>

              {/* Quality Score Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Quality Score</span>
                  <span>{ingestion.quality_score}%</span>
                </div>
                <Progress
                  value={ingestion.quality_score}
                  className={cn(
                    "h-2",
                    ingestion.quality_score >= 95
                      ? "bg-green-100"
                      : ingestion.quality_score >= 85
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  )}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    Last ingestion:{" "}
                    {new Date(ingestion.last_ingestion).toLocaleString()}
                  </span>
                </div>
                {ingestion.errors_count > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{ingestion.errors_count} errors</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

// New Datasets Component
const NewDatasets = ({ datasets }: { datasets: NewDataset[] }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-green-600" />
        New Datasets Added
      </h3>
      <Badge className="bg-green-100 text-green-800">
        {datasets.filter((d) => d.status === "active").length} Active
      </Badge>
    </div>

    <div className="space-y-3">
      {datasets.map((dataset, index) => {
        const DataTypeIcon = getDataTypeIcon(dataset.data_type);
        return (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DataTypeIcon className="h-4 w-4" />
                    {dataset.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    {dataset.description}
                  </div>
                </div>
                <Badge
                  className={
                    dataset.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {dataset.status.replace("_", " ").charAt(0).toUpperCase() +
                    dataset.status.replace("_", " ").slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Source:</span>
                  <div className="font-medium">{dataset.source}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Data Type:</span>
                  <div className="font-medium capitalize">
                    {dataset.data_type.replace("_", " ")}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Geographic Coverage:
                  </span>
                  <div className="font-medium">
                    {dataset.geographic_coverage}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Temporal Coverage:
                  </span>
                  <div className="font-medium">{dataset.temporal_coverage}</div>
                </div>
              </div>

              {/* Parameters */}
              <div className="mb-3">
                <span className="text-muted-foreground text-sm">
                  Parameters:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dataset.parameters.map((param, paramIndex) => (
                    <Badge
                      key={paramIndex}
                      variant="outline"
                      className="text-xs"
                    >
                      {param}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  Added: {new Date(dataset.added_date).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

// Pending Verifications Component
const PendingVerifications = ({
  verifications,
}: {
  verifications: PendingVerification[];
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        Pending Verifications
      </h3>
      <Badge className="bg-orange-100 text-orange-800">
        {verifications.length} Pending
      </Badge>
    </div>

    <div className="space-y-3">
      {verifications.map((verification) => (
        <Card
          key={verification.id}
          className={cn("border-l-4", getPriorityColor(verification.priority))}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {verification.dataset_name}
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {verification.verification_type
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              </div>
              <Badge className={getPriorityColor(verification.priority)}>
                {verification.priority.charAt(0).toUpperCase() +
                  verification.priority.slice(1)}{" "}
                Priority
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-muted-foreground">Submitted by:</span>
                <div className="font-medium">{verification.submitted_by}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Current Stage:</span>
                <div className="font-medium">{verification.current_stage}</div>
              </div>
            </div>

            {verification.issues_found > 0 && (
              <Alert className="mb-3 border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {verification.issues_found} issue
                  {verification.issues_found > 1 ? "s" : ""} found during
                  verification
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>
                  Submitted:{" "}
                  {new Date(verification.submitted_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>
                  Est. completion:{" "}
                  {new Date(
                    verification.estimated_completion
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// System Status Component
const SystemStatus = ({
  systemStatus,
}: {
  systemStatus: DataUpdatesType["system_status"];
}) => (
  <Card className="border-l-4 border-l-blue-500">
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-3">
        <HardDrive className="h-6 w-6 text-blue-600" />
        System Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-blue-600 font-semibold">Total Datasets</div>
          <div className="text-2xl font-bold text-blue-700">
            {systemStatus.total_datasets}
          </div>
        </div>

        <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="text-green-600 font-semibold">Active Ingestions</div>
          <div className="text-2xl font-bold text-green-700">
            {systemStatus.active_ingestions}
          </div>
        </div>

        <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="text-red-600 font-semibold">Failed Ingestions</div>
          <div className="text-2xl font-bold text-red-700">
            {systemStatus.failed_ingestions}
          </div>
        </div>

        <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
          <div className="text-purple-600 font-semibold">Storage Used</div>
          <div className="text-2xl font-bold text-purple-700">
            {systemStatus.storage_usage_gb.toFixed(1)} GB
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
        <Clock className="h-3 w-3" />
        <span>
          Last system check:{" "}
          {new Date(systemStatus.last_system_check).toLocaleString()}
        </span>
      </div>
    </CardContent>
  </Card>
);

// Main Data Updates Component
export const DataUpdatesComponent = ({
  dataUpdates,
}: {
  dataUpdates: DataUpdatesType;
}) => {
  return (
    <div className="space-y-8">
      {/* System Status Header */}
      <SystemStatus systemStatus={dataUpdates.system_status} />

      {/* Data Sections */}
      <RecentIngestions ingestions={dataUpdates.recent_ingestions} />
      <NewDatasets datasets={dataUpdates.new_datasets} />
      <PendingVerifications verifications={dataUpdates.pending_verifications} />
    </div>
  );
};

export default DataUpdatesComponent;
