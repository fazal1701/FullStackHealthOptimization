'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Heart,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Award,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Circle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const ZONE2_PROGRESS_DATA = [
  { week: 'Week 1', vo2max: 42, zone2Minutes: 90 },
  { week: 'Week 2', vo2max: 43, zone2Minutes: 120 },
  { week: 'Week 3', vo2max: 44, zone2Minutes: 150 },
  { week: 'Week 4', vo2max: 45, zone2Minutes: 180 },
  { week: 'Week 5', vo2max: 46, zone2Minutes: 180 },
  { week: 'Week 6', vo2max: 47, zone2Minutes: 210 },
  { week: 'Week 7', vo2max: 47, zone2Minutes: 210 },
  { week: 'Week 8', vo2max: 48, zone2Minutes: 240 }
];

const TRAINING_PHASES = [
  {
    phase: 'Foundation',
    weeks: '1-4',
    description: 'Build aerobic base with consistent Zone 2 training',
    target: '3x/week, 30-60 minutes',
    status: 'completed' as const
  },
  {
    phase: 'Development',
    weeks: '5-8',
    description: 'Increase volume and add VO₂max intervals',
    target: '4x/week, 45-75 minutes + 1x VO₂max',
    status: 'current' as const
  },
  {
    phase: 'Optimization',
    weeks: '9-12',
    description: 'Peak fitness with advanced protocols',
    target: '4x/week Zone 2 + 2x VO₂max intervals',
    status: 'upcoming' as const
  }
];

const WEEKLY_SCHEDULE = [
  {
    day: 'Monday',
    workout: 'Zone 2 Cardio',
    duration: '60 minutes',
    intensity: 'Conversational pace',
    completed: true
  },
  {
    day: 'Tuesday',
    workout: 'Rest or Light Activity',
    duration: '30 minutes',
    intensity: 'Easy walk/yoga',
    completed: true
  },
  {
    day: 'Wednesday',
    workout: 'VO₂max Intervals',
    duration: '45 minutes',
    intensity: '4x4 min @ 90-95% max HR',
    completed: false
  },
  {
    day: 'Thursday',
    workout: 'Zone 2 Cardio',
    duration: '45 minutes',
    intensity: 'Conversational pace',
    completed: false
  },
  {
    day: 'Friday',
    workout: 'Rest',
    duration: '-',
    intensity: 'Complete rest',
    completed: false
  },
  {
    day: 'Saturday',
    workout: 'Zone 2 Long Session',
    duration: '90 minutes',
    intensity: 'Steady conversational pace',
    completed: false
  },
  {
    day: 'Sunday',
    workout: 'Active Recovery',
    duration: '30 minutes',
    intensity: 'Easy movement',
    completed: false
  }
];

export function Zone2VO2MaxProgram() {
  const currentVO2Max = 48;
  const targetVO2Max = 52;
  const progressPercent = ((currentVO2Max - 42) / (targetVO2Max - 42)) * 100;
  const weeklyMinutes = 240;
  const targetMinutes = 300;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zone 2 & VO₂max Program</h1>
          <p className="text-gray-600 mt-1">Optimize mitochondrial function and cardiorespiratory fitness</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Week 8 of 12
        </Badge>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Zone 2 & VO₂max Training Matters</h3>
              <p className="text-gray-700 text-sm mb-3">
                Zone 2 training optimizes mitochondrial function and fat oxidation, while VO₂max intervals 
                improve maximum oxygen uptake. Together, they form the foundation of cardiovascular longevity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Reduces cardiovascular disease risk by 40-50%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Improves mitochondrial efficiency</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Increases healthspan and longevity</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Current VO₂max
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{currentVO2Max}</span>
                <span className="text-sm text-gray-500">ml/kg/min</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target: {targetVO2Max}</span>
                  <span className="font-medium text-blue-600">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Excellent for age
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              Weekly Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{weeklyMinutes}</span>
                <span className="text-sm text-gray-500">minutes</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target: {targetMinutes}</span>
                  <span className="font-medium text-emerald-600">{Math.round((weeklyMinutes/targetMinutes)*100)}%</span>
                </div>
                <Progress value={(weeklyMinutes/targetMinutes)*100} className="h-2" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                On track
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Program Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">8</span>
                <span className="text-sm text-gray-500">of 12 weeks</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-purple-600">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                Development phase
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
          <p className="text-sm text-gray-600">VO₂max improvement and training volume over time</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ZONE2_PROGRESS_DATA}>
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="vo2max" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="VO₂max (ml/kg/min)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="zone2Minutes" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Zone 2 Minutes/Week"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Training Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Training Phases</CardTitle>
          <p className="text-sm text-gray-600">Progressive 12-week program structure</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TRAINING_PHASES.map((phase, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                phase.status === 'current' ? 'bg-blue-50 border-blue-200' :
                phase.status === 'completed' ? 'bg-emerald-50 border-emerald-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      phase.status === 'current' ? 'bg-blue-100' :
                      phase.status === 'completed' ? 'bg-emerald-100' :
                      'bg-gray-100'
                    }`}>
                      {phase.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : phase.status === 'current' ? (
                        <PlayCircle className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                      <p className="text-sm text-gray-600">{phase.weeks}</p>
                    </div>
                  </div>
                  <Badge className={
                    phase.status === 'current' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    phase.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }>
                    {phase.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{phase.description}</p>
                <p className="text-sm font-medium text-gray-900">{phase.target}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* This Week's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Training Schedule</CardTitle>
          <p className="text-sm text-gray-600">Week 8 - Development Phase</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {WEEKLY_SCHEDULE.map((day, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                day.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      day.completed ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      {day.completed ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{day.day}</h4>
                      <p className="text-sm text-gray-600">{day.workout}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{day.duration}</p>
                    <p className="text-xs text-gray-500">{day.intensity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Training Tip</span>
            </div>
            <p className="text-xs text-blue-700">
              Zone 2 intensity should allow you to maintain a conversation. If you can't speak in full sentences, slow down.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
