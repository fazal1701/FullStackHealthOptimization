'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Apple,
  Utensils,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

const BIOMARKER_TIMELINE = [
  { month: 'Jan', apoB: 95, hba1c: 5.8, tir: 65 },
  { month: 'Mar', apoB: 88, hba1c: 5.6, tir: 68 },
  { month: 'Jun', apoB: 82, hba1c: 5.4, tir: 72 },
  { month: 'Sep', apoB: 76, hba1c: 5.2, tir: 75 },
  { month: 'Dec', apoB: 74, hba1c: 5.1, tir: 78 }
];

const INTERVENTION_PROTOCOLS = [
  {
    category: 'Nutrition',
    interventions: [
      {
        name: 'Fiber Optimization',
        target: '35-40g daily',
        current: '28g',
        impact: 'ApoB ↓15-25%, HbA1c ↓0.2-0.4%',
        status: 'in-progress' as const,
        description: 'Soluble fiber (psyllium, β-glucan) for lipid and glucose control'
      },
      {
        name: 'Protein Timing',
        target: '1.6g/kg, 30g per meal',
        current: '1.2g/kg',
        impact: 'Glucose stability, muscle preservation',
        status: 'needs-attention' as const,
        description: 'Optimize protein distribution for metabolic health'
      },
      {
        name: 'Time-Restricted Eating',
        target: '14-16 hour fast',
        current: '12 hours',
        impact: 'Insulin sensitivity ↑20-30%',
        status: 'good' as const,
        description: 'Enhance metabolic flexibility and glucose control'
      }
    ]
  },
  {
    category: 'Movement',
    interventions: [
      {
        name: 'Post-Meal Walks',
        target: '10-15 min after meals',
        current: '2/3 meals',
        impact: 'Glucose spike ↓20-30%',
        status: 'good' as const,
        description: 'Immediate glucose uptake and improved insulin sensitivity'
      },
      {
        name: 'Resistance Training',
        target: '3x/week, compound movements',
        current: '2x/week',
        impact: 'Muscle glucose uptake ↑40%',
        status: 'in-progress' as const,
        description: 'Build muscle mass for glucose disposal'
      }
    ]
  }
];

const CURRENT_METRICS = {
  apoB: { value: 74, target: 60, optimal: 50, unit: 'mg/dL' },
  hba1c: { value: 5.1, target: 5.0, optimal: 4.8, unit: '%' },
  tir: { value: 78, target: 80, optimal: 85, unit: '%' },
  insulinSensitivity: { value: 85, target: 90, optimal: 95, unit: 'score' }
};

export function MetabolicHealthProgram() {
  const apoBProgress = ((95 - CURRENT_METRICS.apoB.value) / (95 - CURRENT_METRICS.apoB.target)) * 100;
  const hba1cProgress = ((5.8 - CURRENT_METRICS.hba1c.value) / (5.8 - CURRENT_METRICS.hba1c.target)) * 100;
  const tirProgress = (CURRENT_METRICS.tir.value / CURRENT_METRICS.tir.target) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'needs-attention': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metabolic Health Program</h1>
          <p className="text-gray-600 mt-1">ApoB & HbA1c optimization for cardiovascular and metabolic longevity</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
          Month 11 of 12
        </Badge>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Info className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Metabolic Health Matters for Longevity</h3>
              <p className="text-gray-700 text-sm mb-3">
                ApoB and HbA1c are primary drivers of cardiovascular disease and metabolic dysfunction. 
                Optimizing these biomarkers can reduce disease risk by 50-70% and extend healthspan significantly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>ApoB &lt;60: 40% lower CVD risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>HbA1c &lt;5.0%: Optimal glucose control</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>TIR &gt;80%: Reduced complications</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              ApoB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{CURRENT_METRICS.apoB.value}</span>
                <span className="text-sm text-gray-500">{CURRENT_METRICS.apoB.unit}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target: {CURRENT_METRICS.apoB.target}</span>
                  <span className="font-medium text-emerald-600">{Math.round(apoBProgress)}%</span>
                </div>
                <Progress value={Math.min(apoBProgress, 100)} className="h-2" />
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
              <Zap className="h-5 w-5 text-yellow-600" />
              HbA1c
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{CURRENT_METRICS.hba1c.value}</span>
                <span className="text-sm text-gray-500">{CURRENT_METRICS.hba1c.unit}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target: {CURRENT_METRICS.hba1c.target}</span>
                  <span className="font-medium text-blue-600">{Math.round(hba1cProgress)}%</span>
                </div>
                <Progress value={Math.min(hba1cProgress, 100)} className="h-2" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Near optimal
              </Badge>
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
                <span className="text-3xl font-bold text-gray-900">{CURRENT_METRICS.tir.value}</span>
                <span className="text-sm text-gray-500">{CURRENT_METRICS.tir.unit}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target: {CURRENT_METRICS.tir.target}</span>
                  <span className="font-medium text-purple-600">{Math.round(tirProgress)}%</span>
                </div>
                <Progress value={tirProgress} className="h-2" />
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
              <Activity className="h-5 w-5 text-green-600" />
              Insulin Sensitivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{CURRENT_METRICS.insulinSensitivity.value}</span>
                <span className="text-sm text-gray-500">{CURRENT_METRICS.insulinSensitivity.unit}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target: {CURRENT_METRICS.insulinSensitivity.target}</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Excellent
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>12-Month Biomarker Trends</CardTitle>
          <p className="text-sm text-gray-600">ApoB, HbA1c, and Time in Range improvements</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BIOMARKER_TIMELINE}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="apoB" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="ApoB (mg/dL)"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="hba1c" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="HbA1c (%)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="tir" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Time in Range (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Intervention Protocols */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Active Intervention Protocols</h2>
          <p className="text-sm text-gray-600">Evidence-based strategies for metabolic optimization</p>
        </div>

        {INTERVENTION_PROTOCOLS.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.category === 'Nutrition' ? (
                  <Utensils className="h-5 w-5 text-green-600" />
                ) : (
                  <Activity className="h-5 w-5 text-blue-600" />
                )}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.interventions.map((intervention, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    intervention.status === 'good' ? 'bg-emerald-50 border-emerald-200' :
                    intervention.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(intervention.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{intervention.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{intervention.description}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(intervention.status)} border`}>
                        {intervention.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current:</span>
                        <span className="font-medium text-gray-900 ml-2">{intervention.current}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Target:</span>
                        <span className="font-medium text-gray-900 ml-2">{intervention.target}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected Impact:</span>
                        <span className="font-medium text-emerald-700 ml-2">{intervention.impact}</span>
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
              <ArrowRight className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps for Optimization</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Increase protein to 1.6g/kg body weight (priority)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Add third resistance training session per week</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Consider ApoB recheck in 6-8 weeks to assess statin optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Maintain current fiber and time-restricted eating protocols</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
