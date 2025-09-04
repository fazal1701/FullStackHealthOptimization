'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  Activity,
  Brain,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Zap,
  Moon,
  Dumbbell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Types for health data
interface HealthMetric {
  metric_type: string;
  value: number;
  unit: string;
  timestamp: string;
  source_device: string;
  quality_score: number;
  percentile?: number;
  sd_band?: 'green' | 'yellow' | 'orange' | 'red';
}

interface RiskPrediction {
  risk_probability: number;
  risk_percentile: number;
  sd_band: 'green' | 'yellow' | 'orange' | 'red';
  shap_explanations: Array<{
    feature: string;
    impact: number;
    explanation: string;
  }>;
  confidence_interval: [number, number];
  model_version: string;
}

interface DeviceStatus {
  device_type: string;
  status: 'connected' | 'disconnected' | 'syncing';
  last_sync: string;
  data_quality: number;
  battery_level?: number;
}

// Mock data for demonstration
const mockHealthData = {
  riskPredictions: {
    cardiovascular: {
      risk_probability: 0.15,
      risk_percentile: 75,
      sd_band: 'yellow' as const,
      shap_explanations: [
        { feature: 'apoB_mg_dl', impact: 0.35, explanation: 'Your ApoB level (120 mg/dL) increases cardiovascular risk' },
        { feature: 'vo2_max_ml_kg_min', impact: -0.15, explanation: 'Your fitness level (VO2 Max: 42.1) helps lower risk' },
        { feature: 'sleep_efficiency_percent', impact: -0.10, explanation: 'Your sleep quality (88% efficiency) is protective' }
      ],
      confidence_interval: [0.12, 0.18] as [number, number],
      model_version: 'CardioRisk-RF-v1.2'
    },
    metabolic: {
      risk_probability: 0.08,
      risk_percentile: 45,
      sd_band: 'green' as const,
      shap_explanations: [
        { feature: 'hba1c_percent', impact: 0.12, explanation: 'Your HbA1c (5.8%) is slightly elevated' },
        { feature: 'physical_activity_min_week', impact: -0.20, explanation: 'Your exercise (180 min/week) significantly lowers risk' }
      ],
      confidence_interval: [0.06, 0.10] as [number, number],
      model_version: 'MetabolicRisk-XGB-v1.1'
    },
    neurocognitive: {
      risk_probability: 0.05,
      risk_percentile: 25,
      sd_band: 'green' as const,
      shap_explanations: [
        { feature: 'hrv_rmssd_ms', impact: -0.18, explanation: 'Your heart rate variability (45.2 ms) is excellent for brain health' },
        { feature: 'sleep_duration', impact: -0.12, explanation: 'Your sleep duration (7.5 hours) supports cognitive function' }
      ],
      confidence_interval: [0.03, 0.07] as [number, number],
      model_version: 'NeuroCog-RF-v1.0'
    }
  },
  
  currentMetrics: [
    { metric_type: 'steps', value: 8542, unit: 'count', timestamp: '2024-12-15T23:59:59Z', source_device: 'fitbit', quality_score: 0.95, percentile: 78, sd_band: 'green' },
    { metric_type: 'hrv_rmssd', value: 45.2, unit: 'ms', timestamp: '2024-12-15T08:30:00Z', source_device: 'oura', quality_score: 0.92, percentile: 85, sd_band: 'green' },
    { metric_type: 'sleep_efficiency', value: 88, unit: 'percent', timestamp: '2024-12-15T08:00:00Z', source_device: 'oura', quality_score: 0.95, percentile: 82, sd_band: 'green' },
    { metric_type: 'vo2_max', value: 42.1, unit: 'ml/kg/min', timestamp: '2024-12-15T18:30:00Z', source_device: 'fitbit', quality_score: 0.88, percentile: 75, sd_band: 'yellow' },
    { metric_type: 'resting_heart_rate', value: 58, unit: 'bpm', timestamp: '2024-12-15T08:00:00Z', source_device: 'oura', quality_score: 0.93, percentile: 70, sd_band: 'green' },
    { metric_type: 'body_temperature', value: 36.8, unit: 'celsius', timestamp: '2024-12-15T08:00:00Z', source_device: 'oura', quality_score: 0.85, percentile: 60, sd_band: 'green' }
  ] as HealthMetric[],
  
  deviceStatus: [
    { device_type: 'oura', status: 'connected' as const, last_sync: '2024-12-15T08:15:00Z', data_quality: 0.94, battery_level: 78 },
    { device_type: 'fitbit', status: 'connected' as const, last_sync: '2024-12-15T23:45:00Z', data_quality: 0.89, battery_level: 45 },
    { device_type: 'whoop', status: 'disconnected' as const, last_sync: '2024-12-13T14:20:00Z', data_quality: 0.0 }
  ] as DeviceStatus[],
  
  trendData: [
    { date: '2024-12-09', hrv: 42.1, sleep_efficiency: 85, vo2_max: 41.8, steps: 7234 },
    { date: '2024-12-10', hrv: 44.3, sleep_efficiency: 87, vo2_max: 42.0, steps: 8901 },
    { date: '2024-12-11', hrv: 43.8, sleep_efficiency: 82, vo2_max: 41.9, steps: 6543 },
    { date: '2024-12-12', hrv: 46.1, sleep_efficiency: 89, vo2_max: 42.2, steps: 9876 },
    { date: '2024-12-13', hrv: 45.7, sleep_efficiency: 86, vo2_max: 42.1, steps: 8234 },
    { date: '2024-12-14', hrv: 44.9, sleep_efficiency: 90, vo2_max: 42.3, steps: 7890 },
    { date: '2024-12-15', hrv: 45.2, sleep_efficiency: 88, vo2_max: 42.1, steps: 8542 }
  ]
};

// Risk Ring Component
const RiskRing: React.FC<{
  category: string;
  prediction: RiskPrediction;
  icon: React.ReactNode;
}> = ({ category, prediction, icon }) => {
  const getBandColor = (band: string) => {
    switch (band) {
      case 'green': return 'text-green-600 border-green-200 bg-green-50';
      case 'yellow': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'orange': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'red': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getRiskLevel = (probability: number) => {
    if (probability < 0.1) return 'Low';
    if (probability < 0.2) return 'Moderate';
    return 'High';
  };

  return (
    <Card className={`${getBandColor(prediction.sd_band)} border-2 transition-all hover:shadow-lg cursor-pointer`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="font-semibold text-lg capitalize">{category}</h3>
              <p className="text-sm opacity-75">10-year risk</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {getRiskLevel(prediction.risk_probability)}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Risk Score</span>
              <span className="font-medium">{(prediction.risk_probability * 100).toFixed(1)}%</span>
            </div>
            <Progress value={prediction.risk_probability * 100} className="h-2" />
          </div>
          
          <div className="text-xs text-gray-600">
            <p>Percentile: {prediction.risk_percentile}th</p>
            <p>Confidence: {(prediction.confidence_interval[0] * 100).toFixed(1)}% - {(prediction.confidence_interval[1] * 100).toFixed(1)}%</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium">Top Factors:</p>
          {prediction.shap_explanations.slice(0, 2).map((exp, idx) => (
            <div key={idx} className="text-xs p-2 bg-white/50 rounded">
              <span className={exp.impact > 0 ? 'text-red-600' : 'text-green-600'}>
                {exp.impact > 0 ? '↑' : '↓'}
              </span>
              <span className="ml-1">{exp.explanation}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Device Status Component
const DeviceStatusCard: React.FC<{ devices: DeviceStatus[]; isClient: boolean }> = ({ devices, isClient }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'syncing': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'oura': return '💍';
      case 'fitbit': return '⌚';
      case 'whoop': return '📱';
      default: return '📱';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Connected Devices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {devices.map((device, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg">{getDeviceIcon(device.device_type)}</span>
              <div>
                <p className="font-medium capitalize">{device.device_type}</p>
                <p className="text-xs text-gray-600" suppressHydrationWarning>
                  Last sync: {isClient ? new Date(device.last_sync).toLocaleTimeString() : 'Loading...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {device.battery_level && (
                <span className="text-xs text-gray-600">{device.battery_level}%</span>
              )}
              <Badge variant={device.status === 'connected' ? 'default' : 'destructive'} className="text-xs">
                Quality: {(device.data_quality * 100).toFixed(0)}%
              </Badge>
              {getStatusIcon(device.status)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Metric Tile Component
const MetricTile: React.FC<{ metric: HealthMetric; isClient: boolean }> = ({ metric, isClient }) => {
  const getBandColor = (band?: string) => {
    switch (band) {
      case 'green': return 'border-green-200 bg-green-50';
      case 'yellow': return 'border-yellow-200 bg-yellow-50';
      case 'orange': return 'border-orange-200 bg-orange-50';
      case 'red': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'steps': return <Activity className="h-5 w-5" />;
      case 'hrv_rmssd': return <Heart className="h-5 w-5" />;
      case 'sleep_efficiency': return <Moon className="h-5 w-5" />;
      case 'vo2_max': return <Dumbbell className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const formatMetricName = (type: string) => {
    const names: Record<string, string> = {
      'steps': 'Steps',
      'hrv_rmssd': 'HRV (RMSSD)',
      'sleep_efficiency': 'Sleep Efficiency',
      'vo2_max': 'VO₂ Max',
      'resting_heart_rate': 'Resting HR',
      'body_temperature': 'Body Temp'
    };
    return names[type] || type;
  };

  return (
    <Card className={`${getBandColor(metric.sd_band)} border-l-4 transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getMetricIcon(metric.metric_type)}
            <span className="font-medium text-sm">{formatMetricName(metric.metric_type)}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {metric.percentile}th %ile
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" suppressHydrationWarning>
              {isClient ? metric.value.toLocaleString() : metric.value.toString()}
            </span>
            <span className="text-sm text-gray-600">{metric.unit}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Quality: {(metric.quality_score * 100).toFixed(0)}%</span>
            <span className="capitalize">{metric.source_device}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
export const AdvancedPatientDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [realTimeData, setRealTimeData] = useState(mockHealthData);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simulate real-time updates (only on client)
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      // Update some metrics with small variations
      setRealTimeData(prev => ({
        ...prev,
        currentMetrics: prev.currentMetrics.map(metric => {
          if (metric.metric_type === 'hrv_rmssd') {
            return {
              ...metric,
              value: metric.value + (Math.random() - 0.5) * 2,
              timestamp: new Date().toISOString()
            };
          }
          return metric;
        })
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading health dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights from your connected devices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Set Goals
          </Button>
          <Button variant="outline" size="sm">
            <Award className="h-4 w-4 mr-2" />
            View Progress
          </Button>
        </div>
      </div>

      {/* Risk Assessment Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskRing
          category="cardiovascular"
          prediction={realTimeData.riskPredictions.cardiovascular}
          icon={<Heart className="h-6 w-6" />}
        />
        <RiskRing
          category="metabolic"
          prediction={realTimeData.riskPredictions.metabolic}
          icon={<Activity className="h-6 w-6" />}
        />
        <RiskRing
          category="neurocognitive"
          prediction={realTimeData.riskPredictions.neurocognitive}
          icon={<Brain className="h-6 w-6" />}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Current Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {realTimeData.currentMetrics.map((metric, idx) => (
                  <MetricTile key={idx} metric={metric} isClient={isClient} />
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Device Status */}
              <DeviceStatusCard devices={realTimeData.deviceStatus} isClient={isClient} />
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Sync All Devices
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Update Goals
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Award className="h-4 w-4 mr-2" />
                    View Achievements
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realTimeData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hrv" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="sleep_efficiency" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="vo2_max" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <DeviceStatusCard devices={realTimeData.deviceStatus} isClient={isClient} />
          
          <Card>
            <CardHeader>
              <CardTitle>Add New Device</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Apple Health', 'Garmin', 'WHOOP', 'Polar'].map((device) => (
                  <Button key={device} variant="outline" className="h-20 flex-col">
                    <span className="text-2xl mb-2">📱</span>
                    <span className="text-sm">{device}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
