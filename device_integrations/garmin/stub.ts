// Garmin OAuth client stub
export const garminOAuthStub = () => {
  // TODO: Implement real OAuth logic
  return { accessToken: 'mock-token', expiresIn: 3600 };
};

// Garmin data normalizer
export interface GarminRawData {
  // Add fields as needed
  vo2max?: number;
  steps?: number;
}

export function normalizeGarminData(raw: GarminRawData) {
  // TODO: Normalize to BiometricSample
  return {
    metric: 'vo2max',
    value: raw.vo2max ?? 0,
    unit: 'ml/kg/min',
    takenAt: new Date().toISOString(),
  };
}

// Garmin quality scoring
export function garminQualityScore(raw: GarminRawData): number {
  // TODO: Implement real scoring
  return 1.0;
} 