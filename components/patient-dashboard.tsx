'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Activity,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Award,
  Plus,
  Settings,
  Link,
  Calendar,
  BarChart3
} from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';
import { RiskRings } from '@/components/risk-rings';
import { WearableTrends } from '@/components/wearable-trends';
import { HabitTracker } from '@/components/habit-tracker';
import { DailyWins } from '@/components/daily-wins';
import { TrendTiles } from '@/components/trend-tiles';

export function PatientDashboard() {
  const patient = MOCK_DATA.patient;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {patient.name}</h1>
          <p className="text-gray-600 mt-1">Your personalized health optimization dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Risk Assessment Rings */}
      <RiskRings />

      {/* Daily Wins and Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendTiles />
        </div>
        <div>
          <DailyWins />
        </div>
      </div>

      {/* Wearable Trends */}
      <WearableTrends />

      {/* Habit Tracker */}
      <HabitTracker />
    </div>
  );
}