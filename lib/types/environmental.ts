// Environmental Health Metrics & Indices Types

export type HealthStatus = "healthy" | "warning" | "critical";

export interface HealthScore {
  value: number;
  status: HealthStatus;
  trend: "improving" | "stable" | "declining";
  lastUpdated: string;
}

// Ocean Health Index Types
export interface OceanHealthIndex {
  composite_score: HealthScore;
  sub_indices: {
    food_provision: HealthScore;
    artisanal_opportunity: HealthScore;
    natural_products: HealthScore;
    carbon_storage: HealthScore;
    coastal_protection: HealthScore;
    tourism_recreation: HealthScore;
    livelihoods_economies: HealthScore;
    sense_of_place: HealthScore;
    clean_waters: HealthScore;
    biodiversity: HealthScore;
  };
  location: {
    name: string;
    coordinates: [number, number];
    region: string;
  };
}

// Water Quality Indicators Types
export interface WaterQualityIndicators {
  dissolved_oxygen: {
    value: number;
    unit: "mg/L";
    status: HealthStatus;
    optimal_range: [number, number];
  };
  ph_level: {
    value: number;
    unit: "pH";
    status: HealthStatus;
    optimal_range: [number, number];
  };
  turbidity: {
    value: number;
    unit: "NTU";
    status: HealthStatus;
    optimal_range: [number, number];
  };
  chlorophyll_a: {
    value: number;
    unit: "μg/L";
    status: HealthStatus;
    optimal_range: [number, number];
  };
  nutrients: {
    nitrogen: {
      value: number;
      unit: "mg/L";
      status: HealthStatus;
    };
    phosphorus: {
      value: number;
      unit: "mg/L";
      status: HealthStatus;
    };
    nitrates: {
      value: number;
      unit: "mg/L";
      status: HealthStatus;
    };
  };
  location: {
    name: string;
    coordinates: [number, number];
    depth: number;
  };
  timestamp: string;
}

// Pollution Indicators Types
export interface PollutionIndicators {
  microplastics: {
    concentration: number;
    unit: "particles/m³";
    status: HealthStatus;
    size_distribution: {
      small: number; // <1mm
      medium: number; // 1-5mm
      large: number; // >5mm
    };
  };
  oil_spills: {
    detected: boolean;
    severity: "none" | "minor" | "moderate" | "major";
    area_affected: number; // km²
    source_identified: boolean;
  };
  chemical_contaminants: {
    heavy_metals: {
      mercury: { value: number; unit: "μg/L"; status: HealthStatus };
      lead: { value: number; unit: "μg/L"; status: HealthStatus };
      cadmium: { value: number; unit: "μg/L"; status: HealthStatus };
    };
    pesticides: {
      detected: boolean;
      concentration: number;
      unit: "μg/L";
      status: HealthStatus;
    };
    industrial_chemicals: {
      detected: boolean;
      types: string[];
      status: HealthStatus;
    };
  };
  location: {
    name: string;
    coordinates: [number, number];
  };
  timestamp: string;
}

// Ecosystem Stress Markers Types
export interface EcosystemStressMarkers {
  coral_bleaching: {
    index: number; // 0-100
    status: HealthStatus;
    affected_area_percent: number;
    severity_level: "none" | "minor" | "moderate" | "severe";
    temperature_stress: {
      current_temp: number;
      baseline_temp: number;
      degree_heating_weeks: number;
    };
  };
  seagrass_loss: {
    coverage_percent: number;
    historical_baseline: number;
    loss_rate_percent: number;
    status: HealthStatus;
    primary_causes: string[];
  };
  fish_mortality: {
    events_detected: number;
    species_affected: string[];
    estimated_deaths: number;
    severity: "low" | "moderate" | "high" | "extreme";
    status: HealthStatus;
    potential_causes: string[];
  };
  location: {
    name: string;
    coordinates: [number, number];
    ecosystem_type: string;
  };
  timestamp: string;
}

// Ocean Alerts Types
export interface HABAlert {
  id: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  severity: "low" | "moderate" | "high" | "extreme";
  species: string;
  concentration: number;
  unit: string;
  status: HealthStatus;
  detected_at: string;
  estimated_duration: string;
  affected_area_km2: number;
  toxin_level: number;
}

export interface ExtremeEvent {
  id: string;
  type: "cyclone" | "tsunami" | "ocean_heatwave" | "dead_zone" | "storm_surge";
  name?: string;
  location: {
    name: string;
    coordinates: [number, number];
    radius_km?: number;
  };
  severity: "minor" | "moderate" | "major" | "extreme";
  status: "active" | "monitoring" | "resolved";
  start_time: string;
  end_time?: string;
  peak_intensity?: number;
  affected_population?: number;
  marine_impact_level: "low" | "moderate" | "high" | "severe";
  description: string;
}

export interface PollutionSpike {
  id: string;
  pollutant_type: "oil" | "plastic" | "chemical" | "sewage" | "industrial";
  location: {
    name: string;
    coordinates: [number, number];
  };
  concentration: number;
  unit: string;
  baseline_level: number;
  spike_factor: number;
  severity: "minor" | "moderate" | "major" | "critical";
  detected_at: string;
  source_identified: boolean;
  source_description?: string;
  containment_status: "none" | "partial" | "contained";
}

export interface OceanAlerts {
  hab_alerts: HABAlert[];
  extreme_events: ExtremeEvent[];
  pollution_spikes: PollutionSpike[];
  total_active_alerts: number;
  last_updated: string;
}

// Data Updates Types
export interface DatasetIngestion {
  dataset_name: string;
  source: string;
  last_ingestion: string;
  status: "completed" | "in_progress" | "failed" | "pending";
  records_processed: number;
  file_size_mb: number;
  processing_time_minutes: number;
  quality_score: number;
  errors_count: number;
}

export interface NewDataset {
  name: string;
  description: string;
  source: string;
  added_date: string;
  data_type: "satellite" | "sensor" | "survey" | "model" | "citizen_science";
  geographic_coverage: string;
  temporal_coverage: string;
  parameters: string[];
  status: "active" | "processing" | "validation_pending";
}

export interface PendingVerification {
  id: string;
  dataset_name: string;
  verification_type:
    | "quality_check"
    | "peer_review"
    | "field_validation"
    | "cross_reference";
  submitted_by: string;
  submitted_date: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimated_completion: string;
  current_stage: string;
  issues_found: number;
}

export interface DataUpdates {
  recent_ingestions: DatasetIngestion[];
  new_datasets: NewDataset[];
  pending_verifications: PendingVerification[];
  system_status: {
    total_datasets: number;
    active_ingestions: number;
    failed_ingestions: number;
    storage_usage_gb: number;
    last_system_check: string;
  };
}

// Recovery Progress Types
export interface CoralReefRestoration {
  project_id: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  project_name: string;
  start_date: string;
  target_completion: string;
  current_progress_percent: number;
  area_restored_hectares: number;
  target_area_hectares: number;
  coral_species_planted: string[];
  survival_rate_percent: number;
  funding_source: string;
  status: "planning" | "active" | "monitoring" | "completed" | "suspended";
  last_monitoring_date: string;
  health_improvement_score: number;
}

export interface MangroveReplantation {
  project_id: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  project_name: string;
  start_date: string;
  target_completion: string;
  current_progress_percent: number;
  trees_planted: number;
  target_trees: number;
  area_covered_hectares: number;
  species_used: string[];
  survival_rate_percent: number;
  carbon_sequestration_estimate_tons: number;
  community_involvement: boolean;
  status: "planning" | "planting" | "monitoring" | "completed";
}

export interface SpeciesRecovery {
  species_name: string;
  scientific_name: string;
  conservation_status:
    | "critically_endangered"
    | "endangered"
    | "vulnerable"
    | "near_threatened"
    | "recovering";
  location: {
    name: string;
    coordinates: [number, number];
  };
  baseline_population: number;
  current_population: number;
  target_population: number;
  recovery_progress_percent: number;
  program_start_date: string;
  estimated_recovery_date: string;
  key_threats: string[];
  conservation_measures: string[];
  population_trend: "increasing" | "stable" | "decreasing";
  last_survey_date: string;
}

export interface RecoveryProgress {
  coral_reef_projects: CoralReefRestoration[];
  mangrove_projects: MangroveReplantation[];
  species_recovery: SpeciesRecovery[];
  summary_stats: {
    total_projects: number;
    completed_projects: number;
    active_projects: number;
    total_funding_usd: number;
    areas_under_restoration_hectares: number;
    species_under_recovery_programs: number;
  };
  last_updated: string;
}

// Combined Environmental Health Data
export interface EnvironmentalHealthData {
  ocean_health_index: OceanHealthIndex;
  water_quality: WaterQualityIndicators[];
  pollution_indicators: PollutionIndicators[];
  ecosystem_stress: EcosystemStressMarkers[];
  ocean_alerts: OceanAlerts;
  data_updates: DataUpdates;
  recovery_progress: RecoveryProgress;
  last_updated: string;
  data_sources: string[];
}

// Helper functions for status determination
export const getHealthStatus = (
  value: number,
  thresholds: { healthy: number; warning: number }
): HealthStatus => {
  if (value >= thresholds.healthy) return "healthy";
  if (value >= thresholds.warning) return "warning";
  return "critical";
};

export const getHealthColor = (status: HealthStatus): string => {
  switch (status) {
    case "healthy":
      return "text-green-600 bg-green-50 border-green-200";
    case "warning":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
  }
};

export const getHealthStatusText = (status: HealthStatus): string => {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "warning":
      return "Warning";
    case "critical":
      return "Critical";
  }
};
