'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Calendar,
  Pill,
  Utensils,
  Activity,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, AreaChart, Area } from 'recharts';

const HBA1C_TIMELINE = [
  { date: 'Jan 2024', value: 5.8, category: 'prediabetic', tir: 65 },
  { date: 'Mar 2024', value: 5.6, category: 'normal', tir: 68 },
  { date: 'Jun 2024', value: 5.4, category: 'optimal', tir: 72 },
  { date: 'Sep 2024', value: 5.2, category: 'optimal', tir: 75 },
  { date: 'Dec 2024', value: 5.1, category: 'optimal', tir: 78 }
];

const GLUCOSE_VARIABILITY_DATA = [
  { time: '6:00', glucose: 85, target: 90 },
  { time: '8:00', glucose: 120, target: 140 },
  { time: '10:00', glucose: 95, target: 120 },
  { time: '12:00', glucose: 140, target: 180 },
  { time: '14:00', glucose: 110, target: 140 },
  { time: '16:00', glucose: 90, target: 120 },
  { time: '18:00', glucose: 135, target: 180 },
  { time: '20:00', glucose: 105, target: 140 },
  { time: '22:00', glucose: 88, target: 120 }
];

const REFERENCE_RANGES = {
  optimal: { min: 4.0, max: 5.0, color: 'emerald', label: 'Optimal (Longevity)', risk: 'Minimal diabetes risk' },
  normal: { min: 5.0, max: 5.7, color: 'blue', label: 'Normal', risk: 'Low diabetes risk' },
  prediabetic: { min: 5.7, max: 6.5, color: 'yellow', label: 'Prediabetes', risk: 'Increased diabetes risk' },
  diabetic: { min: 6.5, max: 15.0, color: 'red', label: 'Diabetes', risk: 'Diabetes diagnosis' }
};

const OPTIMIZATION_STRATEGIES = [
  {
    category: 'Nutrition',
    icon: <Utensils className="h-5 w-5 text-green-600" />,
    strategies: [
      {
        name: 'Fiber Optimization',
        description: 'Soluble fiber slows glucose absorption',
        impact: 'HbA1c ↓0.2-0.4%',
        evidence: 'Cochrane meta-analysis',
        implementation: '25-35g daily, focus on soluble types'
      },
      {
        name: 'Protein Distribution',
        description: 'Even protein across meals',
        impact: 'Glucose stability ↑30%',
        evidence: 'Multiple RCTs',
        implementation: '25-30g protein per meal'
      },
      {
        name: 'Meal Timing',
        description: 'Time-restricted eating',
        impact: 'HbA1c ↓0.1-0.3%',
        evidence: 'TRE systematic review',
        implementation: '14-16 hour overnight fast'
      }
    ]
  },
  {
    category: 'Movement',
    icon: <Activity className="h-5 w-5 text-blue-600" />,
    strategies: [
      {
        name: 'Post-Meal Walks',
        description: 'Immediate glucose uptake',
        impact: 'Glucose spike ↓20-30%',
        evidence: 'Diabetes Care studies',
        implementation: '10-15 min after each meal'
      },
      {
        name: 'Resistance Training',
        description: 'Muscle glucose disposal',
        impact: 'HbA1c ↓0.3-0.6%',
        evidence: 'Exercise meta-analysis',
        implementation: '3x/week, compound movements'
      },
      {
        name: 'Zone 2 Cardio',
        description: 'Mitochondrial efficiency',
        impact: 'Insulin sensitivity ↑25%',
        evidence: 'Exercise physiology',
        implementation: '150+ min/week moderate intensity'
      }
    ]
  },
  {
    category: 'Monitoring',
    icon: <Clock className="h-5 w-5 text-purple-600" />,
    strategies: [
      {
        name: 'Continuous Glucose Monitor',
        description: 'Real-time glucose tracking',
        impact: 'HbA1c ↓0.2-0.5%',
        evidence: 'CGM outcome studies',
        implementation: 'FreeStyle Libre or Dexcom'
      },
      {
        name: 'Time in Range',
        description: 'Glucose 70-180 mg/dL',
        impact: 'Complication risk ↓40%',
        evidence: 'DCCT/EDIC follow-up',
        implementation: 'Target >70% time in range'
      },
      {
        name: 'Glucose Variability',
        description: 'Minimize glucose swings',
        impact: 'Oxidative stress ↓50%',
        evidence: 'Variability research',
        implementation: 'CV <36%, stable patterns'
      }
    ]
  }
];

export function HbA1cBiomarker() {
  const currentValue = 5.1;
  const optimalTarget = 5.0;
  const normalTarget = 5.7;
  const currentTIR = 78;
  
  const getReferenceCategory = (value: number) => {
    if (value < 5.0) return 'optimal';
    if (value < 5.7) return 'normal';
    if (value < 6.5) return 'prediabetic';
    return 'diabetic';
  };

  const currentCategory = getReferenceCategory(currentValue);
  const progressToOptimal = Math.max(0, 100 - ((currentValue - optimalTarget) / (normalTarget - optimalTarget)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HbA1c (Hemoglobin A1c)</h1>
          <p className="text-gray-600 mt-1">3-month average blood glucose and metabolic health marker</p>
        </div>
        <Badge className={`${
          currentCategory === 'optimal' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
          currentCategory === 'normal' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          currentCategory === 'prediabetic' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
          'bg-red-100 text-red-800 border-red-200'
        }`}>
          {REFERENCE_RANGES[currentCategory as keyof typeof REFERENCE_RANGES].label}
        </Badge>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why HbA1c Matters for Longevity</h3>
              <p className="text-gray-700 text-sm mb-3">
                HbA1c reflects glucose binding to red blood cells over 2-3 months. It's the gold standard for 
                diabetes diagnosis and management, but optimal levels for longevity are lower than standard targets.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-500" />
                  <span>Reflects 2-3 month glucose average</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span>HbA1c &lt;5.0%: Optimal metabolic health</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Predicts cardiovascular outcomes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Current HbA1c
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{currentValue}</span>
                <span className="text-lg text-gray-500">%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Optimal: &lt;{optimalTarget}</span>
                  <span className="font-medium text-emerald-600">{Math.round(progressToOptimal)}%</span>
                </div>
                <Progress value={progressToOptimal} className="h-3" />
              </div>
              <div className="text-sm text-gray-600">
                Last measured: December 2024
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Time in Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{currentTIR}</span>
                <span className="text-lg text-gray-500">%</span>
              </div>
              <div className="text-sm text-purple-700">
                70-180 mg/dL glucose range
              </div>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                Good control
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-600" />
              12-Month Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-emerald-600">-0.7</span>
                <span className="text-lg text-gray-500">%</span>
              </div>
              <div className="text-sm text-emerald-700">
                12% relative reduction
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Excellent progress
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Diabetes Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">&lt;1%</span>
                <span className="text-lg text-gray-500">risk</span>
              </div>
              <div className="text-sm text-blue-700">
                10-year diabetes development
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Minimal risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline and Glucose Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>HbA1c Trend Over Time</CardTitle>
            <p className="text-sm text-gray-600">12-month optimization journey</p>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HBA1C_TIMELINE}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[4.8, 6.0]} />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, 'HbA1c']}
                  />
                  <ReferenceLine y={5.0} stroke="#10b981" strokeDasharray="5 5" label="Optimal" />
                  <ReferenceLine y={5.7} stroke="#f59e0b" strokeDasharray="5 5" label="Prediabetes" />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Glucose Pattern</CardTitle>
            <p className="text-sm text-gray-600">Typical day glucose variability</p>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GLUCOSE_VARIABILITY_DATA}>
                  <XAxis dataKey="time" />
                  <YAxis domain={[70, 200]} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} mg/dL`, name === 'glucose' ? 'Glucose' : 'Target Range']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#e5e7eb" 
                    fill="#f3f4f6" 
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="glucose" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reference Ranges */}
      <Card>
        <CardHeader>
          <CardTitle>Reference Ranges & Risk Categories</CardTitle>
          <p className="text-sm text-gray-600">Understanding your HbA1c levels</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(REFERENCE_RANGES).map(([key, range]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full bg-${range.color}-500`} />
                  <div>
                    <span className="font-medium text-gray-900">{range.label}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {range.min}-{range.max === 15.0 ? '15.0+' : range.max}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {currentValue >= range.min && currentValue < range.max && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-1">
                      Your level
                    </Badge>
                  )}
                  <div className="text-xs text-gray-500">{range.risk}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Strategies */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Evidence-Based Optimization Strategies</h2>
          <p className="text-sm text-gray-600">Proven approaches to optimize glucose control and HbA1c</p>
        </div>

        {OPTIMIZATION_STRATEGIES.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.icon}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.strategies.map((strategy, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{strategy.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {strategy.impact}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Evidence:</span>
                        <span className="font-medium text-gray-900 ml-2">{strategy.evidence}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Implementation:</span>
                        <span className="font-medium text-gray-900 ml-2">{strategy.implementation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-yellow-50 to-emerald-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recommended Next Steps</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Continue current nutrition and exercise protocols</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span>Focus on increasing Time in Range to &gt;80%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>Add post-meal walks to reduce glucose spikes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span>Recheck HbA1c in 3 months to assess progress</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
