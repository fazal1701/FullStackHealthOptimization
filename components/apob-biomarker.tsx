'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Calendar,
  Pill,
  Utensils,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

const APOB_TIMELINE = [
  { date: 'Jan 2024', value: 95, reference: 'high', event: 'Baseline' },
  { date: 'Mar 2024', value: 88, reference: 'borderline', event: 'Diet changes' },
  { date: 'Jun 2024', value: 82, reference: 'borderline', event: 'Statin started' },
  { date: 'Sep 2024', value: 76, reference: 'optimal', event: 'Exercise added' },
  { date: 'Dec 2024', value: 74, reference: 'optimal', event: 'Current' }
];

const REFERENCE_RANGES = {
  optimal: { min: 0, max: 60, color: 'emerald', label: 'Optimal (Longevity)' },
  good: { min: 60, max: 80, color: 'blue', label: 'Good (Standard Target)' },
  borderline: { min: 80, max: 100, color: 'yellow', label: 'Borderline High' },
  high: { min: 100, max: 150, color: 'red', label: 'High Risk' }
};

const INTERVENTION_STRATEGIES = [
  {
    category: 'Nutrition',
    icon: <Utensils className="h-5 w-5 text-green-600" />,
    strategies: [
      {
        name: 'Soluble Fiber',
        description: 'Psyllium, β-glucan, pectin',
        impact: 'ApoB ↓15-25%',
        evidence: 'Meta-analysis of 67 RCTs',
        implementation: '10-15g daily with meals'
      },
      {
        name: 'Plant Sterols',
        description: 'Naturally occurring compounds',
        impact: 'ApoB ↓8-15%',
        evidence: 'FDA-approved health claim',
        implementation: '2g daily in fortified foods'
      },
      {
        name: 'Omega-3 EPA',
        description: 'Eicosapentaenoic acid',
        impact: 'ApoB ↓5-10%',
        evidence: 'REDUCE-IT trial',
        implementation: '2-4g daily from fish/supplements'
      }
    ]
  },
  {
    category: 'Medications',
    icon: <Pill className="h-5 w-5 text-blue-600" />,
    strategies: [
      {
        name: 'Statins',
        description: 'HMG-CoA reductase inhibitors',
        impact: 'ApoB ↓30-60%',
        evidence: 'Gold standard, 40+ years data',
        implementation: 'Atorvastatin 20-80mg daily'
      },
      {
        name: 'Ezetimibe',
        description: 'Cholesterol absorption inhibitor',
        impact: 'ApoB ↓15-25%',
        evidence: 'IMPROVE-IT trial',
        implementation: '10mg daily, synergistic with statins'
      },
      {
        name: 'PCSK9 Inhibitors',
        description: 'Monoclonal antibodies',
        impact: 'ApoB ↓50-70%',
        evidence: 'FOURIER, ODYSSEY trials',
        implementation: 'Injection every 2-4 weeks'
      }
    ]
  },
  {
    category: 'Lifestyle',
    icon: <Activity className="h-5 w-5 text-purple-600" />,
    strategies: [
      {
        name: 'Aerobic Exercise',
        description: 'Zone 2 cardio training',
        impact: 'ApoB ↓5-15%',
        evidence: 'Multiple cohort studies',
        implementation: '150+ min/week moderate intensity'
      },
      {
        name: 'Weight Management',
        description: 'Sustainable caloric deficit',
        impact: 'ApoB ↓10-20%',
        evidence: 'Look AHEAD trial',
        implementation: '5-10% body weight reduction'
      },
      {
        name: 'Sleep Optimization',
        description: 'Quality and duration',
        impact: 'ApoB ↓5-10%',
        evidence: 'Sleep Heart Health Study',
        implementation: '7-9 hours, consistent schedule'
      }
    ]
  }
];

export function ApoBBiomarker() {
  const currentValue = 74;
  const optimalTarget = 60;
  const standardTarget = 80;
  
  const getReferenceCategory = (value: number) => {
    if (value <= 60) return 'optimal';
    if (value <= 80) return 'good';
    if (value <= 100) return 'borderline';
    return 'high';
  };

  const currentCategory = getReferenceCategory(currentValue);
  const progressToOptimal = Math.max(0, 100 - ((currentValue - optimalTarget) / (100 - optimalTarget)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ApoB (Apolipoprotein B)</h1>
          <p className="text-gray-600 mt-1">The most important cardiovascular risk biomarker</p>
        </div>
        <Badge className={`${
          currentCategory === 'optimal' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
          currentCategory === 'good' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          currentCategory === 'borderline' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
          'bg-red-100 text-red-800 border-red-200'
        }`}>
          {REFERENCE_RANGES[currentCategory as keyof typeof REFERENCE_RANGES].label}
        </Badge>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why ApoB Matters for Longevity</h3>
              <p className="text-gray-700 text-sm mb-3">
                ApoB measures the number of atherogenic particles that can penetrate artery walls and cause plaque buildup. 
                Unlike LDL-C, ApoB counts particles directly, making it the most accurate predictor of cardiovascular events.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span>Each ApoB particle can cause atherosclerosis</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span>ApoB &lt;60: 40% lower CVD risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Better predictor than LDL cholesterol</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Current Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{currentValue}</span>
                <span className="text-lg text-gray-500">mg/dL</span>
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
              <TrendingDown className="h-5 w-5 text-emerald-600" />
              12-Month Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-emerald-600">-21</span>
                <span className="text-lg text-gray-500">mg/dL</span>
              </div>
              <div className="text-sm text-emerald-700">
                22% reduction from baseline
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
              <Target className="h-5 w-5 text-blue-600" />
              Risk Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">35%</span>
                <span className="text-lg text-gray-500">lower</span>
              </div>
              <div className="text-sm text-blue-700">
                Cardiovascular event risk vs. baseline
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Significant improvement
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>ApoB Trend Over Time</CardTitle>
          <p className="text-sm text-gray-600">12-month optimization journey with interventions</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={APOB_TIMELINE}>
                <XAxis dataKey="date" />
                <YAxis domain={[60, 100]} />
                <Tooltip 
                  formatter={(value, name) => [`${value} mg/dL`, 'ApoB']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <ReferenceLine y={60} stroke="#10b981" strokeDasharray="5 5" label="Optimal" />
                <ReferenceLine y={80} stroke="#3b82f6" strokeDasharray="5 5" label="Standard Target" />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reference Ranges */}
      <Card>
        <CardHeader>
          <CardTitle>Reference Ranges & Risk Categories</CardTitle>
          <p className="text-sm text-gray-600">Understanding your ApoB levels</p>
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
                      {range.min}-{range.max === 150 ? '150+' : range.max} mg/dL
                    </span>
                  </div>
                </div>
                {currentValue >= range.min && currentValue <= range.max && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Your level
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intervention Strategies */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Evidence-Based Intervention Strategies</h2>
          <p className="text-sm text-gray-600">Proven approaches to optimize ApoB levels</p>
        </div>

        {INTERVENTION_STRATEGIES.map((category, categoryIndex) => (
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
      <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recommended Next Steps</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Continue current statin therapy (excellent response)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Maintain high-fiber diet and regular exercise</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Consider ezetimibe addition to reach optimal &lt;60 mg/dL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Recheck ApoB in 6-8 weeks after any therapy changes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
