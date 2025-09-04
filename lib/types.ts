// Core types for the Health Optimization App

// --- Canonical Domain Types ---

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'clinician' | 'admin';
  plan: 'free' | 'pro' | 'team';
}

export interface DeviceLink {
  userId: string;
  vendor: 'fitbit' | 'oura' | 'whoop' | 'garmin' | 'apple';
  status: 'linked' | 'error' | 'pending';
  lastSync?: string;
  quality?: number;
}

export interface BiometricSample {
  id: string;
  userId: string;
  source: DeviceLink['vendor'] | 'manual';
  metric: 'hr' | 'hrv' | 'steps' | 'sleep_score' | 'resting_hr' | 'spo2' | 'vo2max' | 'cgm_sd';
  value: number;
  unit: string;
  takenAt: string;
}

export interface LabResult {
  id: string;
  userId: string;
  kind: 'apob' | 'ldl' | 'hdl' | 'triglycerides' | 'a1c' | 'lp(a)' | 'hs_crp' | 'vitd' | 'creatinine' | 'alt' | 'ast';
  value: number;
  unit: string;
  collectedAt: string;
}

export interface Vital {
  id: string;
  userId: string;
  kind: 'sbp' | 'dbp' | 'bmi' | 'waist' | 'temp';
  value: number;
  unit: string;
  takenAt: string;
}

export interface LifestyleLog {
  id: string;
  userId: string;
  kind: 'nutrition_score' | 'alcohol_units' | 'cigarettes' | 'minutes_mvpa' | 'stress_score' | 'sleep_hours';
  value: number;
  takenAt: string;
}

export interface RiskScore {
  id: string;
  userId: string;
  model: 'cvd10y' | 't2d5y' | 'cancer_proxy' | 'neuro';
  score: number;
  band: 'low' | 'moderate' | 'high';
  ci95: [number, number];
  computedAt: string;
}

export interface FeatureAttribution {
  riskId: string;
  feature: string;
  contribution: number;
  direction: 'pos' | 'neg';
}

// --- Migration Helpers ---

// Type guards and conversion helpers for legacy -> canonical types
// (Add more as needed for mock-data migration)

export function isUserProfile(obj: any): obj is UserProfile {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string' && typeof obj.role === 'string';
}

// --- Legacy types (to be removed) ---
// (Retain for migration, but do not use in new code)

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'stress' | 'medication';
  target: number;
  unit: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  createdAt: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  userId: string;
  value: number;
  completed: boolean;
  date: string;
  notes?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  earnedAt?: string;
}

// Nudge/Recommendation Types
export interface Nudge {
  id: string;
  userId: string;
  type: 'habit' | 'health_tip' | 'medication_reminder' | 'appointment';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
}

// Doctor Dashboard Types
export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  sex: string;
  avatar?: string;
  overallRisk: 'low' | 'moderate' | 'high';
  riskScores: RiskScore[];
  lastVisit: string;
  nextAppointment?: string;
  recentBiomarkers: Biomarker[];
  wearableStatus: 'active' | 'inactive' | 'partial';
  medicationCompliance: number; // 0-100
}

export interface CohortFilter {
  ageRange?: [number, number];
  sex?: 'male' | 'female' | 'all';
  riskLevel?: 'low' | 'moderate' | 'high' | 'all';
  condition?: string;
  wearableStatus?: 'active' | 'inactive' | 'partial' | 'all';
}

// SHAP/Explainability Types
export interface ShapFactor {
  feature: string;
  impact: number; // -1 to 1
  value: string;
  description: string;
}

export interface DecisionSupport {
  patientId: string;
  topFactors: ShapFactor[];
  recommendations: string[];
  guidelines: string[];
  confidence: number; // 0-100
  lastUpdated: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard State Types
export interface PatientDashboardState {
  user: Patient;
  riskScores: RiskScore[];
  wearableData: WearableMetric[];
  wearableTrends: WearableTrend[];
  habits: Habit[];
  habitEntries: HabitEntry[];
  badges: Badge[];
  nudges: Nudge[];
  vendors: WearableVendor[];
}

export interface DoctorDashboardState {
  user: Doctor;
  patients: PatientSummary[];
  selectedPatient?: PatientSummary;
  cohortFilters: CohortFilter;
  decisionSupport?: DecisionSupport;
}