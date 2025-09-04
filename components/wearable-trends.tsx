'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Heart, Moon, Zap } from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';

interface WearableTrendCardProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  target: number;
  trend: number;
  data: number[];
  unit: string;
  status: 'improving' | 'declining' | 'stable' | 'below_target' | 'above_target';
}

function WearableTrendCard({ title, icon, current, target, trend, data, unit, status }: WearableTrendCardProps) {
  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-emerald-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'improving': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'declining': return 'bg-red-100 text-red-800 border-red-200';
      case 'stable': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'below_target': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'above_target': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Prepare chart data
  const chartData = data.map((value, index) => ({
    day: `Day ${index + 1}`,
    value: value
  }));

  const progressPercentage = Math.min(100, (current / target) * 100);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Badge className={`${getStatusBadge(status)} border text-xs`}>
            {status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Value and Target */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">{current.toLocaleString()}</span>
              <span className="text-sm text-gray-500">{unit}</span>
            </div>
            <div className="text-sm text-gray-600">
              Target: {target.toLocaleString()} {unit}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : null}
            <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress to target</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                progressPercentage >= 100 ? 'bg-emerald-500' :
                progressPercentage >= 80 ? 'bg-blue-500' :
                progressPercentage >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            />
          </div>
        </div>

        {/* 7-Day Trend Chart */}
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip 
                labelFormatter={(label) => label}
                formatter={(value: number) => [`${value} ${unit}`, title]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={
                  trend > 0 ? '#10b981' :
                  trend < 0 ? '#ef4444' :
                  '#6b7280'
                }
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function WearableTrends() {
  const trends = MOCK_DATA.wearableTrendsNew;
  const vendors = MOCK_DATA.vendors;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wearable Trends</h2>
          <p className="text-gray-600">7-day trends from your connected devices</p>
        </div>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>

      {/* Wearable Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WearableTrendCard
          title="Daily Steps"
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          current={trends.steps.current}
          target={trends.steps.target}
          trend={trends.steps.trend}
          data={trends.steps.data}
          unit={trends.steps.unit}
          status={trends.steps.status}
        />
        
        <WearableTrendCard
          title="HRV"
          icon={<Heart className="w-5 h-5 text-red-600" />}
          current={trends.hrv.current}
          target={trends.hrv.target}
          trend={trends.hrv.trend}
          data={trends.hrv.data}
          unit={trends.hrv.unit}
          status={trends.hrv.status}
        />
        
        <WearableTrendCard
          title="Sleep Duration"
          icon={<Moon className="w-5 h-5 text-purple-600" />}
          current={trends.sleep.current}
          target={trends.sleep.target}
          trend={trends.sleep.trend}
          data={trends.sleep.data}
          unit={trends.sleep.unit}
          status={trends.sleep.status}
        />
        
        <WearableTrendCard
          title="VO₂max"
          icon={<Zap className="w-5 h-5 text-emerald-600" />}
          current={trends.vo2max.current}
          target={trends.vo2max.target}
          trend={trends.vo2max.trend}
          data={trends.vo2max.data}
          unit={trends.vo2max.unit}
          status={trends.vo2max.status}
        />
      </div>

      {/* Connected Devices */}
      <Card className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{
            backgroundImage: `url(${MOCK_DATA.images.medical.wearables})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <CardHeader className="relative z-10">
          <CardTitle className="text-lg">Connected Devices</CardTitle>
          <p className="text-sm text-gray-600">Your integrated health monitoring ecosystem</p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-wrap gap-2">
            {vendors.map((vendor) => (
              <Badge
                key={vendor.id}
                className={`${vendor.color} border`}
              >
                <span className="mr-1">{vendor.icon}</span>
                {vendor.name}
                {vendor.status === 'linked' && (
                  <span className="ml-1 text-xs">✓</span>
                )}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm">
              Manage Connections
            </Button>
            <Button variant="outline" size="sm">
              Add Device
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
