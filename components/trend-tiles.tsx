'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Heart, Activity, Moon, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface TrendMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'moderate' | 'poor';
  icon: React.ReactNode;
  data: number[];
  target?: number;
  description: string;
}

const TREND_METRICS: TrendMetric[] = [
  {
    id: 'hrv',
    name: 'HRV (RMSSD)',
    value: 45,
    unit: 'ms',
    change: 3,
    changePercent: 7.1,
    trend: 'up',
    status: 'good',
    icon: <Heart className="h-4 w-4" />,
    data: [38, 39, 41, 43, 44, 41, 45],
    target: 50,
    description: 'Autonomic nervous system recovery'
  },
  {
    id: 'vo2max',
    name: 'VO₂max',
    value: 48,
    unit: 'ml/kg/min',
    change: 1,
    changePercent: 2.1,
    trend: 'up',
    status: 'excellent',
    icon: <Activity className="h-4 w-4" />,
    data: [46, 47, 47, 48, 49, 48, 48],
    target: 50,
    description: 'Cardiorespiratory fitness'
  },
  {
    id: 'tir',
    name: 'Time in Range',
    value: 72,
    unit: '%',
    change: 5,
    changePercent: 7.4,
    trend: 'up',
    status: 'good',
    icon: <Zap className="h-4 w-4" />,
    data: [65, 68, 70, 69, 71, 70, 72],
    target: 80,
    description: 'Glucose 70-180 mg/dL'
  },
  {
    id: 'sleep',
    name: 'Sleep Efficiency',
    value: 87,
    unit: '%',
    change: -2,
    changePercent: -2.2,
    trend: 'down',
    status: 'good',
    icon: <Moon className="h-4 w-4" />,
    data: [89, 88, 85, 86, 89, 87, 87],
    target: 90,
    description: 'Time asleep / time in bed'
  }
];

function TrendTile({ metric }: { metric: TrendMetric }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-emerald-600" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-600" />;
      case 'stable': return <Minus className="h-3 w-3 text-gray-600" />;
      default: return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const chartData = metric.data.map((value, index) => ({
    day: index + 1,
    value
  }));

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${getStatusColor(metric.status)}`}>
              {metric.icon}
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          </div>
          <Badge className={`text-xs ${getStatusColor(metric.status)} border`}>
            {metric.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Current Value */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(metric.trend)}
              <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change} ({metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%)
              </span>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    metric.status === 'excellent' ? '#10b981' :
                    metric.status === 'good' ? '#3b82f6' :
                    metric.status === 'moderate' ? '#f59e0b' :
                    '#ef4444'
                  }
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Target Progress */}
          {metric.target && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Target: {metric.target}{metric.unit}</span>
                <span className={`font-medium ${
                  metric.value >= metric.target ? 'text-emerald-600' : 'text-gray-600'
                }`}>
                  {Math.round((metric.value / metric.target) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    metric.value >= metric.target ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendTiles() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Key Metrics</h2>
          <p className="text-sm text-gray-600">7-day trends for longevity biomarkers</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Last 7 days
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TREND_METRICS.map((metric) => (
          <TrendTile key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
