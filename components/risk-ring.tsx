'use client';

import { RiskScore } from '@/lib/types';
import { Heart, Activity, Brain } from 'lucide-react';

interface RiskRingProps {
  riskScore: RiskScore;
}

export function RiskRing({ riskScore }: RiskRingProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'cardiovascular':
        return <Heart className="h-6 w-6" />;
      case 'metabolic':
        return <Activity className="h-6 w-6" />;
      case 'neurocognitive':
        return <Brain className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  const getColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-emerald-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRingColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'stroke-emerald-500';
      case 'moderate':
        return 'stroke-yellow-500';
      case 'high':
        return 'stroke-red-500';
      default:
        return 'stroke-gray-500';
    }
  };

  const getBackgroundColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'stroke-emerald-100';
      case 'moderate':
        return 'stroke-yellow-100';
      case 'high':
        return 'stroke-red-100';
      default:
        return 'stroke-gray-100';
    }
  };

  // Calculate the circumference and stroke-dasharray for the progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(riskScore.score / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Risk Ring */}
      <div className="relative mb-3">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            className={getBackgroundColor(riskScore.level)}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            className={getRingColor(riskScore.level)}
          />
        </svg>

        {/* Icon in center */}
        <div className={`absolute inset-0 flex items-center justify-center ${getColor(riskScore.level)}`}>
          {getIcon(riskScore.category)}
        </div>
      </div>

      {/* Risk Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm capitalize">
          {riskScore.category.replace('_', ' ')}
        </h3>
        <div className={`text-lg font-bold ${getColor(riskScore.level)}`}>
          {riskScore.percentile}th percentile
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          riskScore.level === 'low' ? 'bg-emerald-100 text-emerald-700' :
          riskScore.level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {riskScore.level.toUpperCase()} RISK
        </div>
      </div>
    </div>
  );
}