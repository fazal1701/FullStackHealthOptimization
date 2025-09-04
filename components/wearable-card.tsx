'use client';

import { WearableTrend } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WearableCardProps {
  trend: WearableTrend;
}

export function WearableCard({ trend }: WearableCardProps) {
  const getTrendIcon = () => {
    switch (trend.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'steps') {
      return value.toLocaleString();
    }
    return `${value}${unit}`;
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{trend.metric}</h4>
        {getTrendIcon()}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(trend.current, trend.unit)}
        </div>

        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          <span>{trend.change > 0 ? '+' : ''}{trend.change}</span>
          <span>({trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%)</span>
        </div>

        <div className="text-xs text-gray-500">
          vs. last week
        </div>
      </div>
    </div>
  );
}