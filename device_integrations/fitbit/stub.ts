// Fitbit OAuth client stub
export const fitbitOAuthStub = () => {
  // TODO: Implement real OAuth logic
  return { accessToken: 'mock-token', expiresIn: 3600 };
};

// Fitbit data normalizer
export interface FitbitRawData {
  // Add fields as needed
  steps?: number;
  heartRate?: number;
  sleepScore?: number;
}

export function normalizeFitbitData(raw: FitbitRawData) {
  // TODO: Normalize to BiometricSample
  return {
    metric: 'steps',
    value: raw.steps ?? 0,
    unit: 'steps',
    takenAt: new Date().toISOString(),
  };
}

// Fitbit quality scoring
export function fitbitQualityScore(raw: FitbitRawData): number {
  // TODO: Implement real scoring
  return 1.0;
} 