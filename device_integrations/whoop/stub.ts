// Whoop OAuth client stub
export const whoopOAuthStub = () => {
  // TODO: Implement real OAuth logic
  return { accessToken: 'mock-token', expiresIn: 3600 };
};

// Whoop data normalizer
export interface WhoopRawData {
  // Add fields as needed
  strain?: number;
  recovery?: number;
  hrv?: number;
}

export function normalizeWhoopData(raw: WhoopRawData) {
  // TODO: Normalize to BiometricSample
  return {
    metric: 'hrv',
    value: raw.hrv ?? 0,
    unit: 'ms',
    takenAt: new Date().toISOString(),
  };
}

// Whoop quality scoring
export function whoopQualityScore(raw: WhoopRawData): number {
  // TODO: Implement real scoring
  return 1.0;
} 