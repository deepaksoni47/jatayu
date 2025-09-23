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

// Combined Environmental Health Data
export interface EnvironmentalHealthData {
  ocean_health_index: OceanHealthIndex;
  water_quality: WaterQualityIndicators[];
  pollution_indicators: PollutionIndicators[];
  ecosystem_stress: EcosystemStressMarkers[];
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
