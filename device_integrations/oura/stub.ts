// Oura OAuth client stub
export const ouraOAuthStub = () => {
  // TODO: Implement real OAuth logic
  return { accessToken: 'mock-token', expiresIn: 3600 };
};

// Oura data normalizer
export interface OuraRawData {
  // Add fields as needed
  sleepScore?: number;
  readiness?: number;
  hrv?: number;
}

export function normalizeOuraData(raw: OuraRawData) {
  // TODO: Normalize to BiometricSample
  return {
    metric: 'sleep_score',
    value: raw.sleepScore ?? 0,
    unit: 'score',
    takenAt: new Date().toISOString(),
  };
}

// Oura quality scoring
export function ouraQualityScore(raw: OuraRawData): number {
  // TODO: Implement real scoring
  return 1.0;
} 