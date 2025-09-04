import {
  RiskScore,
  Habit,
  Badge,
  Nudge,
  PatientSummary,
  ShapFactor,
  DecisionSupport
} from './types';

// Mock Wearable Vendors
export const MOCK_VENDORS: Array<{ id: string; name: string; status: 'linked' | 'not_linked'; icon: string; color: string; linkedAt?: string; }> = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    status: 'linked',
    icon: '🍎',
    color: 'bg-gray-100 text-gray-700',
    linkedAt: '2024-01-15'
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    status: 'linked',
    icon: '⌚',
    color: 'bg-blue-100 text-blue-700',
    linkedAt: '2024-02-01'
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    status: 'linked',
    icon: '💍',
    color: 'bg-purple-100 text-purple-700',
    linkedAt: '2024-01-10'
  },
  {
    id: 'whoop',
    name: 'WHOOP',
    status: 'not_linked',
    icon: '🔴',
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'garmin',
    name: 'Garmin',
    status: 'not_linked',
    icon: '🏃',
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    status: 'not_linked',
    icon: '🔵',
    color: 'bg-yellow-100 text-yellow-700'
  }
];

// Mock Patient Data
export const MOCK_PATIENT = {
  id: 'patient-1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  role: 'patient',
  avatar: '/images/patient-hero.svg',
  createdAt: '2024-01-01',
  dateOfBirth: '1985-06-15',
  sex: 'female',
  height: 165,
  weight: 68,
  doctorId: 'doctor-1'
};

// Mock Doctor Data
export const MOCK_DOCTOR = {
  id: 'doctor-1',
  name: 'Dr. Michael Chen',
  email: 'dr.chen@healthcenter.com',
  role: 'doctor',
  avatar: '/images/clinician-hero.svg',
  createdAt: '2023-01-01',
  specialty: 'Preventive Medicine & Longevity',
  licenseNumber: 'MD-12345',
  patients: ['patient-1', 'patient-2', 'patient-3']
};

// Visual Assets for Demo
export const DEMO_IMAGES = {
  riskCategories: {
    cardiovascular: '/images/cardiovascular-health.jpg',
    metabolic: '/images/ai-medical-tech.jpg',
    neurocognitive: '/images/ai-medical-tech.jpg'
  },
  programs: {
    zone2: '/images/exerciseszone.png',
    sleep: '/images/patient-hero.svg',
    nutrition: '/images/nutritionsupplmentation.jpg'
  },
  medical: {
    biomarkers: '/images/biomarker-lab-results.jpg',
    wearables: '/images/ai-medical-tech.jpg',
    consultation: '/images/clinician-hero.svg',
    analytics: '/images/cardiovascular-health.jpg',
    aiHealthcare: '/images/ai-medical-tech.jpg'
  },
  lifestyle: {
    longevity: '/images/ai-medical-tech.jpg'
  }
};

// Mock Risk Scores
export const MOCK_RISK_SCORES: RiskScore[] = [
  {
    id: 'cvd',
    userId: 'patient-1',
    model: 'cvd10y',
    score: 0.25,
    band: 'low',
    ci95: [0.2, 0.3],
    computedAt: '2024-08-15'
  },
  {
    id: 't2d',
    userId: 'patient-1',
    model: 't2d5y',
    score: 0.45,
    band: 'moderate',
    ci95: [0.35, 0.5],
    computedAt: '2024-08-15'
  },
  {
    id: 'neuro',
    userId: 'patient-1',
    model: 'neuro',
    score: 0.2,
    band: 'low',
    ci95: [0.15, 0.25],
    computedAt: '2024-08-15'
  }
];

// Mock Wearable Metrics
export const MOCK_WEARABLE_METRICS: Array<{ id: string; userId: string; vendor: string; metric: string; value: number; unit: string; measuredAt: string; source: string; }> = [
  {
    id: 'metric-1',
    userId: 'patient-1',
    vendor: 'Apple Health',
    metric: 'steps',
    value: 8542,
    unit: 'steps',
    measuredAt: '2024-08-30',
    source: 'iPhone'
  },
  {
    id: 'metric-2',
    userId: 'patient-1',
    vendor: 'WHOOP',
    metric: 'hrv',
    value: 45,
    unit: 'ms',
    measuredAt: '2024-08-30',
    source: 'WHOOP 4.0'
  },
  {
    id: 'metric-3',
    userId: 'patient-1',
    vendor: 'Oura',
    metric: 'sleep_quality',
    value: 82,
    unit: 'score',
    measuredAt: '2024-08-30',
    source: 'Oura Ring'
  },
  {
    id: 'metric-4',
    userId: 'patient-1',
    vendor: 'Fitbit',
    metric: 'vo2max',
    value: 38,
    unit: 'ml/kg/min',
    measuredAt: '2024-08-25',
    source: 'Fitbit Sense'
  }
];

// Mock Wearable Trends
export const MOCK_WEARABLE_TRENDS: Array<{ metric: string; current: number; previous: number; change: number; changePercent: number; trend: 'up' | 'down'; unit: string; }> = [
  {
    metric: 'Steps',
    current: 8542,
    previous: 7890,
    change: 652,
    changePercent: 8.3,
    trend: 'up',
    unit: 'steps'
  },
  {
    metric: 'HRV',
    current: 45,
    previous: 42,
    change: 3,
    changePercent: 7.1,
    trend: 'up',
    unit: 'ms'
  },
  {
    metric: 'Sleep Quality',
    current: 82,
    previous: 85,
    change: -3,
    changePercent: -3.5,
    trend: 'down',
    unit: 'score'
  },
  {
    metric: 'VO₂max',
    current: 38,
    previous: 37,
    change: 1,
    changePercent: 2.7,
    trend: 'up',
    unit: 'ml/kg/min'
  }
];

// Mock Biomarkers
export const MOCK_BIOMARKERS: Record<string, {
  id: string; userId: string; name: string; value: number; unit: string; referenceRange: { min: number; max: number; optimal: number }; status: string; measuredAt: string; labName: string;
}> = {
  apoB: {
    id: 'bio-1',
    userId: 'patient-1',
    name: 'apoB',
    value: 85,
    unit: 'mg/dL',
    referenceRange: { min: 60, max: 120, optimal: 80 },
    status: 'optimal',
    measuredAt: '2024-08-01',
    labName: 'LabCorp'
  },
  hba1c: {
    id: 'bio-2',
    userId: 'patient-1',
    name: 'hba1c',
    value: 5.4,
    unit: '%',
    referenceRange: { min: 4.0, max: 5.6, optimal: 5.0 },
    status: 'normal',
    measuredAt: '2024-08-01',
    labName: 'LabCorp'
  },
  hs_crp: {
    id: 'bio-3',
    userId: 'patient-1',
    name: 'hs_crp',
    value: 1.2,
    unit: 'mg/L',
    referenceRange: { min: 0, max: 3.0, optimal: 1.0 },
    status: 'normal',
    measuredAt: '2024-08-01',
    labName: 'LabCorp'
  },
  vo2max: {
    id: 'bio-4',
    userId: 'patient-1',
    name: 'vo2max',
    value: 38,
    unit: 'ml/kg/min',
    referenceRange: { min: 25, max: 45, optimal: 40 },
    status: 'normal',
    measuredAt: '2024-08-25',
    labName: 'Fitness Assessment'
  }
};

// Mock Medications
export const MOCK_MEDICATIONS: Array<{ id: string; userId: string; name: string; dosage: string; frequency: string; startDate: string; prescribedBy: string; indication: string; notes?: string; }> = [
  {
    id: 'med-1',
    userId: 'patient-1',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    startDate: '2024-06-01',
    prescribedBy: 'Dr. Michael Chen',
    indication: 'Cholesterol management',
    notes: 'Take with evening meal'
  },
  {
    id: 'med-2',
    userId: 'patient-1',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2024-07-15',
    prescribedBy: 'Dr. Michael Chen',
    indication: 'Glucose control',
    notes: 'Take with meals'
  }
];

// Mock Medication Overlays for Timeline
export const MOCK_MED_OVERLAYS = [
  { label: 'Statin started', date: '2024-06-01', type: 'start' },
  { label: 'Metformin added', date: '2024-07-15', type: 'start' }
];

// Mock Habits
export const MOCK_HABITS: Habit[] = [
  {
    id: 'habit-1',
    userId: 'patient-1',
    name: 'Daily Walk',
    description: 'Walk for at least 30 minutes',
    category: 'exercise',
    target: 30,
    unit: 'minutes',
    frequency: 'daily',
    streak: 12,
    longestStreak: 28,
    completedToday: true,
    createdAt: '2024-08-01'
  },
  {
    id: 'habit-2',
    userId: 'patient-1',
    name: 'Fiber Intake',
    description: 'Consume at least 25g of fiber',
    category: 'nutrition',
    target: 25,
    unit: 'grams',
    frequency: 'daily',
    streak: 8,
    longestStreak: 15,
    completedToday: false,
    createdAt: '2024-08-05'
  },
  {
    id: 'habit-3',
    userId: 'patient-1',
    name: 'Sleep Schedule',
    description: 'Lights out by 11 PM',
    category: 'sleep',
    target: 23,
    unit: 'hour',
    frequency: 'daily',
    streak: 5,
    longestStreak: 21,
    completedToday: true,
    createdAt: '2024-08-10'
  }
];

// Mock Badges
export const MOCK_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Week Warrior',
    description: 'Complete 7 days of walking',
    icon: '🏃‍♀️',
    category: 'exercise',
    requirement: '7 day streak',
    earnedAt: '2024-08-20'
  },
  {
    id: 'badge-2',
    name: 'Sleep Champion',
    description: 'Maintain sleep schedule for 2 weeks',
    icon: '😴',
    category: 'sleep',
    requirement: '14 day streak'
  },
  {
    id: 'badge-3',
    name: 'Fiber Friend',
    description: 'Hit fiber goals for 10 days',
    icon: '🥬',
    category: 'nutrition',
    requirement: '10 day streak'
  }
];

// Mock Nudges
export const MOCK_NUDGES: Nudge[] = [
  {
    id: 'nudge-1',
    userId: 'patient-1',
    type: 'habit',
    title: 'Time for your walk!',
    message: 'You\'re 12 days into your walking streak. Keep it going!',
    priority: 'medium',
    category: 'exercise',
    actionable: true,
    actionText: 'Log walk',
    createdAt: '2024-08-30T14:00:00',
  },
  {
    id: 'nudge-2',
    userId: 'patient-1',
    type: 'health_tip',
    title: 'Add more fiber',
    message: 'Try adding 20g more fiber to boost your metabolic health',
    priority: 'low',
    category: 'nutrition',
    actionable: false,
    createdAt: '2024-08-30T08:00:00',
  },
  {
    id: 'nudge-3',
    userId: 'patient-1',
    type: 'medication_reminder',
    title: 'Evening medication',
    message: 'Don\'t forget your atorvastatin with dinner',
    priority: 'high',
    category: 'medication',
    actionable: true,
    actionText: 'Mark taken',
    createdAt: '2024-08-30T18:00:00',
  }
];

// Mock Patient Summaries for Doctor Dashboard
export const MOCK_PATIENT_SUMMARIES: PatientSummary[] = [
  {
    id: 'patient-1',
    name: 'Sarah Johnson',
    age: 39,
    sex: 'Female',
    avatar: '/images/patient-hero.svg',
    overallRisk: 'low',
    riskScores: MOCK_RISK_SCORES,
    lastVisit: '2024-08-15',
    nextAppointment: '2024-09-15',
    recentBiomarkers: Object.values(MOCK_BIOMARKERS),
    wearableStatus: 'active',
    medicationCompliance: 95
  },
  {
    id: 'patient-2',
    name: 'James Wilson',
    age: 52,
    sex: 'Male',
    avatar: '/images/patient-hero.svg',
    overallRisk: 'moderate',
    riskScores: [
      { ...MOCK_RISK_SCORES[0], score: 0.65, band: 'moderate', computedAt: '2024-08-10' },
      { ...MOCK_RISK_SCORES[1], score: 0.70, band: 'high', computedAt: '2024-08-10' },
      { ...MOCK_RISK_SCORES[2], score: 0.35, band: 'low', computedAt: '2024-08-10' }
    ],
    lastVisit: '2024-08-10',
    recentBiomarkers: [],
    wearableStatus: 'partial',
    medicationCompliance: 78
  },
  {
    id: 'patient-3',
    name: 'Maria Garcia',
    age: 45,
    sex: 'Female',
    avatar: '/images/patient-hero.svg',
    overallRisk: 'high',
    riskScores: [
      { ...MOCK_RISK_SCORES[0], score: 0.85, band: 'high', computedAt: '2024-08-05' },
      { ...MOCK_RISK_SCORES[1], score: 0.75, band: 'high', computedAt: '2024-08-05' },
      { ...MOCK_RISK_SCORES[2], score: 0.40, band: 'moderate', computedAt: '2024-08-05' }
    ],
    lastVisit: '2024-08-05',
    nextAppointment: '2024-09-05',
    recentBiomarkers: [],
    wearableStatus: 'inactive',
    medicationCompliance: 85
  }
];

// Mock SHAP Factors for Decision Support
export const MOCK_SHAP_FACTORS: ShapFactor[] = [
  {
    feature: 'ApoB',
    impact: 0.65,
    value: '85 mg/dL',
    description: 'Primary driver of cardiovascular risk'
  },
  {
    feature: 'Time in Range',
    impact: -0.45,
    value: '68%',
    description: 'Glucose variability indicator'
  },
  {
    feature: 'hs-CRP',
    impact: 0.32,
    value: '1.2 mg/L',
    description: 'Inflammatory marker'
  },
  {
    feature: 'VO₂max',
    impact: -0.28,
    value: '38 ml/kg/min',
    description: 'Cardiorespiratory fitness'
  },
  {
    feature: 'Sleep Quality',
    impact: -0.15,
    value: '82/100',
    description: 'Recovery and metabolic health'
  }
];

// Mock Decision Support
export const MOCK_DECISION_SUPPORT: DecisionSupport = {
  patientId: 'patient-1',
  topFactors: MOCK_SHAP_FACTORS,
  recommendations: [
    'Consider intensifying lipid-lowering therapy for ApoB ≥ 120 mg/dL + Lp(a) high',
    'Reinforce aerobic exercise program; VO₂max < 30th percentile',
    'Investigate glycemic variability; Time in Range < 70%'
  ],
  guidelines: [
    'ACC/AHA Cholesterol Guidelines: Target ApoB < 80 mg/dL for high-risk patients',
    'ADA Standards: Time in Range goal > 70% for diabetes management',
    'ESC Prevention Guidelines: hs-CRP < 2.0 mg/L optimal for CV risk'
  ],
  confidence: 87,
  lastUpdated: '2024-08-30'
};

// Static mock time series data to prevent hydration mismatches
export const STATIC_TIME_SERIES_DATA = [
  { date: '2024-12-04', steps: 8420, hrv: 42, sleep: 7.2, vo2max: 48 },
  { date: '2024-12-05', steps: 9200, hrv: 44, sleep: 7.5, vo2max: 47 },
  { date: '2024-12-06', steps: 8800, hrv: 41, sleep: 7.8, vo2max: 47 },
  { date: '2024-12-07', steps: 7600, hrv: 43, sleep: 6.9, vo2max: 48 },
  { date: '2024-12-08', steps: 9100, hrv: 44, sleep: 7.1, vo2max: 49 },
  { date: '2024-12-09', steps: 8900, hrv: 41, sleep: 7.4, vo2max: 48 },
  { date: '2024-12-10', steps: 7800, hrv: 42, sleep: 6.8, vo2max: 48 },
  { date: '2024-12-11', steps: 8420, hrv: 42, sleep: 7.2, vo2max: 48 }
];

// Helper functions for generating mock data
export const generateMockTimeSeriesData = (days: number = 30) => {
  // Return static data to prevent hydration mismatches
  return STATIC_TIME_SERIES_DATA.slice(0, Math.min(days, STATIC_TIME_SERIES_DATA.length));
};

export const generateMockBiomarkerTimeline = () => {
  return [
    { date: '2024-01-15', apoB: 95, hba1c: 5.8, hs_crp: 2.1 },
    { date: '2024-03-15', apoB: 88, hba1c: 5.6, hs_crp: 1.8 },
    { date: '2024-06-01', apoB: 85, hba1c: 5.4, hs_crp: 1.2 }, // Statin started
    { date: '2024-08-01', apoB: 82, hba1c: 5.3, hs_crp: 1.1 }
  ];
};

// Longevity-Focused Risk Categories
export const LONGEVITY_RISK_CATEGORIES = {
  cardiovascular: {
    name: 'Cardiovascular',
    score: 15, // percentile (lower is better)
    status: 'excellent' as const,
    color: 'emerald',
    description: 'Heart health & vascular function',
    factors: ['ApoB', 'Lp(a)', 'hs-CRP', 'Blood Pressure', 'VO₂max'],
    target: '<20th percentile'
  },
  metabolic: {
    name: 'Metabolic',
    score: 35,
    status: 'good' as const,
    color: 'blue',
    description: 'Glucose regulation & metabolism',
    factors: ['HbA1c', 'Insulin', 'TIR', 'Waist-to-Hip Ratio', 'Triglycerides'],
    target: '<30th percentile'
  },
  neurocognitive: {
    name: 'Neurocognitive',
    score: 25,
    status: 'good' as const,
    color: 'purple',
    description: 'Brain health & cognitive function',
    factors: ['Sleep Quality', 'HRV', 'Cognitive Tests', 'Stress Markers', 'Exercise'],
    target: '<25th percentile'
  }
};

// Weekly Wearable Trends (last 7 days)
export const WEARABLE_TRENDS = {
  steps: {
    current: 8420,
    target: 10000,
    trend: -5.2, // percentage change
    data: [9200, 8800, 7600, 9100, 8900, 7800, 8420],
    unit: 'steps',
    status: 'below_target' as const
  },
  hrv: {
    current: 42,
    target: 45,
    trend: 8.1,
    data: [38, 39, 41, 43, 44, 41, 42],
    unit: 'ms',
    status: 'improving' as const
  },
  sleep: {
    current: 7.2,
    target: 8.0,
    trend: -2.8,
    data: [7.5, 7.8, 6.9, 7.1, 7.4, 6.8, 7.2],
    unit: 'hours',
    status: 'below_target' as const
  },
  vo2max: {
    current: 48,
    target: 50,
    trend: 3.2,
    data: [46, 47, 47, 48, 49, 48, 48],
    unit: 'ml/kg/min',
    status: 'improving' as const
  }
};

// Longevity-Focused Daily Habits
export const LONGEVITY_HABITS = [
  {
    id: 'zone2-cardio',
    title: 'Zone 2 Cardio (30min)',
    description: 'Mitochondrial health & fat oxidation',
    streak: 12,
    completed: true,
    category: 'movement',
    points: 25,
    longevityImpact: 'high'
  },
  {
    id: 'protein-target',
    title: 'Protein Target (1.6g/kg)',
    description: 'Muscle protein synthesis & sarcopenia prevention',
    streak: 8,
    completed: false,
    category: 'nutrition',
    points: 20,
    longevityImpact: 'high'
  },
  {
    id: 'sleep-consistency',
    title: 'Sleep Consistency (±30min)',
    description: 'Circadian rhythm optimization',
    streak: 5,
    completed: true,
    category: 'recovery',
    points: 30,
    longevityImpact: 'very_high'
  },
  {
    id: 'time-restricted-eating',
    title: '16:8 Time-Restricted Eating',
    description: 'Autophagy & metabolic flexibility',
    streak: 15,
    completed: true,
    category: 'nutrition',
    points: 20,
    longevityImpact: 'high'
  },
  {
    id: 'strength-training',
    title: 'Resistance Training',
    description: 'Bone density & muscle mass preservation',
    streak: 3,
    completed: false,
    category: 'movement',
    points: 25,
    longevityImpact: 'very_high'
  }
];

// Biomarker Timeline Data (last 12 months) - Longevity Focused
export const LONGEVITY_BIOMARKERS = {
  apob: {
    name: 'ApoB',
    unit: 'mg/dL',
    target: '<80',
    optimalRange: '<60',
    longevityTarget: '<50',
    data: [
      { date: '2024-01', value: 95, reference: 'high', percentile: 75 },
      { date: '2024-03', value: 88, reference: 'borderline', percentile: 65 },
      { date: '2024-06', value: 82, reference: 'borderline', percentile: 55 },
      { date: '2024-09', value: 76, reference: 'optimal', percentile: 35 },
      { date: '2024-12', value: 74, reference: 'optimal', percentile: 30 }
    ]
  },
  hba1c: {
    name: 'HbA1c',
    unit: '%',
    target: '<5.7',
    optimalRange: '<5.4',
    longevityTarget: '<5.0',
    data: [
      { date: '2024-01', value: 5.8, reference: 'prediabetic', percentile: 70 },
      { date: '2024-03', value: 5.6, reference: 'normal', percentile: 50 },
      { date: '2024-06', value: 5.4, reference: 'optimal', percentile: 35 },
      { date: '2024-09', value: 5.3, reference: 'optimal', percentile: 25 },
      { date: '2024-12', value: 5.2, reference: 'optimal', percentile: 20 }
    ]
  },
  hscrp: {
    name: 'hs-CRP',
    unit: 'mg/L',
    target: '<3.0',
    optimalRange: '<1.0',
    longevityTarget: '<0.5',
    data: [
      { date: '2024-01', value: 2.1, reference: 'moderate', percentile: 65 },
      { date: '2024-03', value: 1.8, reference: 'moderate', percentile: 55 },
      { date: '2024-06', value: 1.2, reference: 'low', percentile: 35 },
      { date: '2024-09', value: 0.8, reference: 'low', percentile: 25 },
      { date: '2024-12', value: 0.6, reference: 'low', percentile: 15 }
    ]
  },
  vo2max: {
    name: 'VO₂max',
    unit: 'ml/kg/min',
    target: '>35',
    optimalRange: '>45',
    longevityTarget: '>50',
    data: [
      { date: '2024-01', value: 42, reference: 'good', percentile: 60 },
      { date: '2024-03', value: 44, reference: 'good', percentile: 65 },
      { date: '2024-06', value: 46, reference: 'excellent', percentile: 70 },
      { date: '2024-09', value: 48, reference: 'excellent', percentile: 75 },
      { date: '2024-12', value: 48, reference: 'excellent', percentile: 75 }
    ]
  }
};

// Export all mock data as a single object for easy access
// Cohort Data for Doctor Dashboard
export const COHORT_DATA = {
  totalPatients: 247,
  riskDistribution: {
    low: 156,      // <25th percentile
    moderate: 67,  // 25-75th percentile
    high: 24       // >75th percentile
  },
  ageGroups: {
    '30-40': 45,
    '40-50': 89,
    '50-60': 76,
    '60-70': 37
  },
  conditions: {
    'Pre-diabetes': 34,
    'Hypertension': 56,
    'Dyslipidemia': 78,
    'Metabolic Syndrome': 23,
    'Sleep Disorders': 31,
    'Chronic Inflammation': 19
  },
  longevityMetrics: {
    averageBiologicalAge: 42.3,
    averageChronologicalAge: 48.7,
    healthspanProjection: 78.2,
    topPerformers: 23 // patients in top 10% across all metrics
  }
};

// SHAP-style Risk Factors for Longevity
export const LONGEVITY_RISK_FACTORS = [
  {
    factor: 'ApoB Level',
    impact: 0.34,
    direction: 'negative',
    description: 'Elevated ApoB increases cardiovascular risk and reduces healthspan',
    intervention: 'Statin therapy + dietary changes'
  },
  {
    factor: 'Sleep Quality Score',
    impact: 0.28,
    direction: 'positive',
    description: 'Poor sleep affects multiple longevity pathways',
    intervention: 'Sleep hygiene protocol + circadian optimization'
  },
  {
    factor: 'VO₂max Percentile',
    impact: 0.22,
    direction: 'positive',
    description: 'Higher fitness strongly predicts longevity',
    intervention: 'Zone 2 cardio + strength training program'
  },
  {
    factor: 'HRV Trend',
    impact: 0.16,
    direction: 'negative',
    description: 'Declining HRV indicates autonomic dysfunction',
    intervention: 'Stress management + recovery optimization'
  }
];

export const MOCK_DATA = {
  vendors: MOCK_VENDORS,
  patient: MOCK_PATIENT,
  doctor: MOCK_DOCTOR,
  riskScores: MOCK_RISK_SCORES,
  wearableMetrics: MOCK_WEARABLE_METRICS,
  wearableTrends: MOCK_WEARABLE_TRENDS,
  biomarkers: MOCK_BIOMARKERS,
  medications: MOCK_MEDICATIONS,
  medOverlays: MOCK_MED_OVERLAYS,
  habits: MOCK_HABITS,
  badges: MOCK_BADGES,
  nudges: MOCK_NUDGES,
  patientSummaries: MOCK_PATIENT_SUMMARIES,
  shapFactors: MOCK_SHAP_FACTORS,
  decisionSupport: MOCK_DECISION_SUPPORT,
  timeSeriesData: generateMockTimeSeriesData(),
  biomarkerTimeline: generateMockBiomarkerTimeline(),
  // New longevity-focused data
  longevityRiskCategories: LONGEVITY_RISK_CATEGORIES,
  wearableTrendsNew: WEARABLE_TRENDS,
  longevityHabits: LONGEVITY_HABITS,
  longevityBiomarkers: LONGEVITY_BIOMARKERS,
  cohortData: COHORT_DATA,
  longevityRiskFactors: LONGEVITY_RISK_FACTORS,
  // Demo visual assets
  images: DEMO_IMAGES
};