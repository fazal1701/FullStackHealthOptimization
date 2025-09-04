# Component Architecture: Patient Dashboard System

## Overview
This document outlines the React component structure for the patient-facing dashboard, focusing on reusable, testable components that integrate with the ML backend and provide engaging user experiences.

## Core Component Hierarchy

```
PatientApp
├── NavigationSidebar
├── PatientDashboard (Home)
│   ├── RiskRingsPanel
│   │   ├── RiskRing (Cardiovascular)
│   │   ├── RiskRing (Metabolic)
│   │   └── RiskRing (Neurocognitive)
│   ├── DailyWinsPanel
│   │   ├── WinCard (Steps)
│   │   ├── WinCard (Sleep)
│   │   └── WinCard (Exercise)
│   └── TrendTilesPanel
│       ├── MetricTile (HRV)
│       ├── MetricTile (Time in Range)
│       ├── MetricTile (VO2 Max)
│       └── MetricTile (Sleep Efficiency)
├── ProgramsPage
├── BiomarkersPage
├── DevicesPage
└── AccountPage
```

## Component Specifications

### 1. RiskRing Component

**Purpose**: Visual representation of risk category with SHAP-driven explanations

```typescript
interface RiskRingProps {
  category: 'cardiovascular' | 'metabolic' | 'neurocognitive';
  score: number; // 0-100
  level: 'low' | 'moderate' | 'high';
  topFactors: ShapFactor[];
  trend: 'improving' | 'stable' | 'worsening';
  lastUpdated: string;
}

// Key Features:
// - Animated SVG ring with color-coded segments
// - Click to expand → shows top 3 SHAP factors
// - "Why This Matters?" → educational modal
// - "Improve This" → links to relevant programs
```

**Visual Elements**:
- Ring color: Green (<1 SD), Yellow (1-2 SD), Orange (2-3 SD), Red (>3 SD)
- Inner icon: 🫀 heart, 🧬 DNA, 🧠 brain
- Trend arrow: ↗️ improving, → stable, ↘️ worsening
- Pulse animation for high-risk categories

### 2. DailyWins Component

**Purpose**: Gamified daily goal tracking with streak mechanics

```typescript
interface WinCardProps {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  streak: number;
  icon: React.ReactNode;
  onComplete: (winId: string) => void;
  onViewDetails: (winId: string) => void;
}

// Key Features:
// - Progress bar with current/target values
// - "Mark Complete" button → confetti animation
// - Streak counter with fire emoji for >7 days
// - "Why This Win?" → shows biological rationale
```

**Interaction Flow**:
1. User sees 3 daily wins (refreshed at midnight)
2. Clicks "Mark Complete" → progress animation
3. Streak counter updates → micro-celebration
4. All 3 complete → daily badge earned

### 3. MetricTile Component

**Purpose**: Real-time biomarker and wearable data visualization

```typescript
interface MetricTileProps {
  metric: string;
  value: number;
  unit: string;
  percentile: number;
  sdBand: 'green' | 'yellow' | 'orange' | 'red';
  trend: number[]; // 7-day sparkline data
  lastSync: string;
  deviceSource: string;
  onViewTrend: () => void;
}

// Key Features:
// - Large value with percentile context
// - Color-coded border based on SD band
// - Mini sparkline showing 7-day trend
// - Device sync indicator with timestamp
// - Click → expanded trend view
```

**Data Integration**:
- Real-time updates from device APIs
- Fallback to manual entry if device disconnected
- Quality indicators for data completeness

### 4. BiomarkerCard Component

**Purpose**: Educational biomarker display with actionable insights

```typescript
interface BiomarkerCardProps {
  biomarker: {
    name: string;
    value: number;
    unit: string;
    percentile: number;
    sdScore: number;
    status: 'optimal' | 'normal' | 'borderline' | 'high' | 'critical';
    lastMeasured: string;
    referenceRange: { min: number; max: number; optimal?: number };
  };
  shapContributions: ShapFactor[];
  recommendations: string[];
  onTogglePercentile: () => void;
  onViewRecommendations: () => void;
  onScheduleRetest: () => void;
}

// Key Features:
// - Toggle between raw value and percentile
// - Visual reference range with optimal zone
// - "What Improves This?" → evidence-based chips
// - "When to Retest?" → interval guidance
// - Timeline integration for trend tracking
```

**Educational Elements**:
- Hover tooltips with biological explanations
- Visual diagrams (artery for ApoB, RBC for HbA1c)
- Links to relevant research studies

### 5. ProgramCard Component

**Purpose**: Structured health optimization programs with progress tracking

```typescript
interface ProgramCardProps {
  program: {
    id: string;
    name: string;
    category: 'exercise' | 'nutrition' | 'sleep' | 'stress';
    description: string;
    targetBiomarkers: string[];
    weeklyTarget: number;
    currentProgress: number;
    nextSession?: {
      type: string;
      duration: number;
      intensity: string;
    };
  };
  userProgress: {
    completedSessions: number;
    totalSessions: number;
    streak: number;
    lastSession: string;
  };
  onStartSession: () => void;
  onLogSession: () => void;
  onViewProgress: () => void;
}

// Key Features:
// - Progress ring showing weekly completion
// - "Start Session" → timer interface
// - "Log Session" → RPE/duration entry
// - Biomarker impact predictions
// - Evidence links for program efficacy
```

## State Management Architecture

### Global State (Zustand)
```typescript
interface AppState {
  user: Patient;
  riskScores: RiskScore[];
  biomarkers: Biomarker[];
  wearableData: WearableMetric[];
  dailyWins: DailyWin[];
  programs: UserProgram[];
  devices: DeviceConnection[];
  
  // Actions
  updateRiskScore: (category: string, score: RiskScore) => void;
  markWinComplete: (winId: string) => void;
  syncDeviceData: (deviceId: string) => Promise<void>;
  addBiomarker: (biomarker: Biomarker) => void;
}
```

### Server State (React Query)
```typescript
// Real-time data fetching with optimistic updates
const useRiskScores = (userId: string) => {
  return useQuery({
    queryKey: ['riskScores', userId],
    queryFn: () => fetchRiskScores(userId),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

const useWearableData = (userId: string, timeRange: string) => {
  return useQuery({
    queryKey: ['wearableData', userId, timeRange],
    queryFn: () => fetchWearableData(userId, timeRange),
    refetchInterval: 60 * 1000, // 1 minute for recent data
  });
};
```

## Integration Points

### ML Model Integration
```typescript
// SHAP explanation fetching
const useShapExplanations = (predictionId: string) => {
  return useQuery({
    queryKey: ['shap', predictionId],
    queryFn: () => fetchShapExplanations(predictionId),
    select: (data) => ({
      topFactors: data.factors.slice(0, 3), // Patient view
      allFactors: data.factors, // Doctor view
      confidence: data.confidence,
      modelVersion: data.modelVersion,
    }),
  });
};

// Risk prediction updates
const useRiskPrediction = (userId: string) => {
  return useMutation({
    mutationFn: (biomarkerUpdate: Biomarker) => 
      updateRiskPrediction(userId, biomarkerUpdate),
    onSuccess: (newPrediction) => {
      // Update risk rings with new scores
      queryClient.setQueryData(['riskScores', userId], newPrediction);
    },
  });
};
```

### Device API Integration
```typescript
// Device sync with error handling
const useDeviceSync = () => {
  return useMutation({
    mutationFn: async (deviceId: string) => {
      const device = await getDeviceConnection(deviceId);
      switch (device.vendor) {
        case 'apple':
          return syncAppleHealth(device);
        case 'fitbit':
          return syncFitbit(device);
        case 'oura':
          return syncOura(device);
        default:
          throw new Error(`Unsupported device: ${device.vendor}`);
      }
    },
    onSuccess: (data, deviceId) => {
      // Update wearable data cache
      queryClient.invalidateQueries(['wearableData']);
      // Update sync timestamp
      updateDeviceLastSync(deviceId, new Date());
    },
    onError: (error, deviceId) => {
      // Handle token expiration, rate limits, etc.
      handleDeviceError(deviceId, error);
    },
  });
};
```

## Animation & Interaction Patterns

### Micro-Interactions
- **Risk Ring Hover**: Subtle scale + glow effect
- **Win Completion**: Confetti burst + success sound
- **Trend Updates**: Smooth number counting animation
- **Data Sync**: Pulse indicator during fetch

### Loading States
- **Skeleton Screens**: For biomarker cards and trend tiles
- **Progressive Loading**: Show cached data while fetching updates
- **Error Boundaries**: Graceful fallbacks for component failures

### Accessibility
- **Screen Reader Support**: Proper ARIA labels for all interactive elements
- **Keyboard Navigation**: Tab order and focus management
- **Color Blind Friendly**: Patterns + colors for status indicators
- **High Contrast Mode**: Alternative styling for visibility

## Testing Strategy

### Unit Tests
- Component rendering with various props
- State management actions and reducers
- Utility functions for data transformation
- SHAP explanation formatting

### Integration Tests
- User flows: completing daily wins, viewing trends
- API integration: device sync, biomarker updates
- Error handling: network failures, invalid data

### E2E Tests
- Complete user journeys from login to goal completion
- Cross-device synchronization scenarios
- Performance under realistic data loads

This component architecture ensures scalability, maintainability, and excellent user experience while integrating seamlessly with the ML backend and clinical decision support systems.
