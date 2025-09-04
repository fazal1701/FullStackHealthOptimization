'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Share,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, ScatterPlot, Scatter } from 'recharts';

interface SHAPFeature {
  feature: string;
  importance: number;
  direction: 'positive' | 'negative';
  currentValue: number;
  optimalRange: [number, number];
  unit: string;
  description: string;
  actionable: boolean;
}

interface RiskPrediction {
  category: string;
  currentRisk: number;
  percentile: number;
  sdBand: 'green' | 'yellow' | 'orange' | 'red';
  confidence: number;
  timeHorizon: string;
  topDrivers: string[];
}

interface CounterfactualScenario {
  id: string;
  name: string;
  description: string;
  interventions: {
    biomarker: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    timeframe: string;
  }[];
  expectedRiskReduction: number;
  confidence: [number, number]; // 95% CI
  feasibility: 'high' | 'medium' | 'low';
  evidenceLevel: 'A' | 'B' | 'C';
}

const SHAP_FEATURES: SHAPFeature[] = [
  {
    feature: 'ApoB',
    importance: 0.34,
    direction: 'negative',
    currentValue: 74,
    optimalRange: [40, 60],
    unit: 'mg/dL',
    description: 'Atherogenic particle count - primary cardiovascular risk driver',
    actionable: true
  },
  {
    feature: 'VO₂max',
    importance: 0.28,
    direction: 'positive',
    currentValue: 48,
    optimalRange: [50, 65],
    unit: 'ml/kg/min',
    description: 'Cardiorespiratory fitness - protective against all-cause mortality',
    actionable: true
  },
  {
    feature: 'HbA1c',
    importance: 0.22,
    direction: 'negative',
    currentValue: 5.1,
    optimalRange: [4.5, 5.0],
    unit: '%',
    description: 'Glucose control - metabolic health indicator',
    actionable: true
  },
  {
    feature: 'Sleep Efficiency',
    importance: 0.18,
    direction: 'positive',
    currentValue: 87,
    optimalRange: [90, 95],
    unit: '%',
    description: 'Sleep quality - impacts recovery and longevity',
    actionable: true
  },
  {
    feature: 'HRV (RMSSD)',
    importance: 0.15,
    direction: 'positive',
    currentValue: 45,
    optimalRange: [50, 80],
    unit: 'ms',
    description: 'Autonomic nervous system balance - stress resilience',
    actionable: true
  },
  {
    feature: 'Age',
    importance: 0.12,
    direction: 'negative',
    currentValue: 39,
    optimalRange: [25, 35],
    unit: 'years',
    description: 'Chronological age - non-modifiable risk factor',
    actionable: false
  }
];

const RISK_PREDICTIONS: RiskPrediction[] = [
  {
    category: 'Cardiovascular Disease',
    currentRisk: 8.2,
    percentile: 25,
    sdBand: 'green',
    confidence: 0.89,
    timeHorizon: '10-year',
    topDrivers: ['ApoB', 'VO₂max', 'Blood Pressure']
  },
  {
    category: 'Type 2 Diabetes',
    currentRisk: 2.1,
    percentile: 15,
    sdBand: 'green',
    confidence: 0.92,
    timeHorizon: '10-year',
    topDrivers: ['HbA1c', 'BMI', 'Family History']
  },
  {
    category: 'All-Cause Mortality',
    currentRisk: 12.5,
    percentile: 20,
    sdBand: 'green',
    confidence: 0.85,
    timeHorizon: '20-year',
    topDrivers: ['VO₂max', 'ApoB', 'Sleep Quality']
  }
];

const COUNTERFACTUAL_SCENARIOS: CounterfactualScenario[] = [
  {
    id: 'scenario-1',
    name: 'Optimal ApoB Target',
    description: 'Achieve longevity-optimal ApoB through medication optimization',
    interventions: [
      {
        biomarker: 'ApoB',
        currentValue: 74,
        targetValue: 55,
        unit: 'mg/dL',
        timeframe: '6-8 weeks'
      }
    ],
    expectedRiskReduction: 28,
    confidence: [22, 34],
    feasibility: 'high',
    evidenceLevel: 'A'
  },
  {
    id: 'scenario-2',
    name: 'VO₂max Improvement',
    description: 'Increase cardiorespiratory fitness through Zone 2 training',
    interventions: [
      {
        biomarker: 'VO₂max',
        currentValue: 48,
        targetValue: 52,
        unit: 'ml/kg/min',
        timeframe: '12-16 weeks'
      }
    ],
    expectedRiskReduction: 18,
    confidence: [12, 24],
    feasibility: 'medium',
    evidenceLevel: 'A'
  },
  {
    id: 'scenario-3',
    name: 'Combined Optimization',
    description: 'Multi-modal intervention targeting top 3 risk drivers',
    interventions: [
      {
        biomarker: 'ApoB',
        currentValue: 74,
        targetValue: 55,
        unit: 'mg/dL',
        timeframe: '6-8 weeks'
      },
      {
        biomarker: 'VO₂max',
        currentValue: 48,
        targetValue: 52,
        unit: 'ml/kg/min',
        timeframe: '12-16 weeks'
      },
      {
        biomarker: 'Sleep Efficiency',
        currentValue: 87,
        targetValue: 92,
        unit: '%',
        timeframe: '4-6 weeks'
      }
    ],
    expectedRiskReduction: 42,
    confidence: [35, 49],
    feasibility: 'medium',
    evidenceLevel: 'B'
  }
];

export function MLExplainability() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const getSDBandColor = (band: string) => {
    switch (band) {
      case 'green': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case 'high': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const shapData = SHAP_FEATURES.map(feature => ({
    name: feature.feature,
    importance: feature.importance,
    direction: feature.direction
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Risk Analysis & Explainability</h1>
          <p className="text-gray-600 mt-1">Machine learning insights with transparent explanations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Technical Details</span>
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showTechnicalDetails ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why AI Explainability Matters in Healthcare</h3>
              <p className="text-gray-700 text-sm mb-3">
                Transparent AI helps you understand which factors drive your health risks and what interventions 
                will have the greatest impact. SHAP analysis reveals feature importance while counterfactual 
                scenarios show achievable health improvements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  <span>SHAP feature importance analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>Counterfactual goal setting</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span>Confidence intervals for predictions</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RISK_PREDICTIONS.map((risk, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{risk.category}</span>
                <Badge className={`${getSDBandColor(risk.sdBand)} border text-xs`}>
                  {risk.sdBand.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{risk.currentRisk}%</span>
                  <span className="text-sm text-gray-500">{risk.timeHorizon}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Population Percentile</span>
                    <span className="font-medium text-blue-600">{risk.percentile}th</span>
                  </div>
                  <Progress value={risk.percentile} className="h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  Confidence: {Math.round(risk.confidence * 100)}%
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Top Drivers</h4>
                  <div className="flex flex-wrap gap-1">
                    {risk.topDrivers.map((driver, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {driver}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SHAP Feature Importance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Feature Importance Analysis (SHAP)
          </CardTitle>
          <p className="text-sm text-gray-600">
            Top factors influencing your cardiovascular risk prediction
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SHAP_FEATURES.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {feature.direction === 'positive' ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium text-gray-900">{feature.feature}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {feature.currentValue} {feature.unit}
                    </div>
                    {!feature.actionable && (
                      <Badge variant="outline" className="text-xs">
                        Non-modifiable
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {Math.round(feature.importance * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">importance</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={feature.importance * 100} className="flex-1 h-2" />
                  <div className="text-xs text-gray-500 w-16">
                    Target: {feature.optimalRange[0]}-{feature.optimalRange[1]}
                  </div>
                </div>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Counterfactual Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Counterfactual Analysis: "What If" Scenarios
          </CardTitle>
          <p className="text-sm text-gray-600">
            Projected risk reductions from specific interventions with confidence intervals
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {COUNTERFACTUAL_SCENARIOS.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedScenario === scenario.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                        <Badge className={`${getFeasibilityColor(scenario.feasibility)} border text-xs`}>
                          {scenario.feasibility} feasibility
                        </Badge>
                        <Badge className={`${getEvidenceLevelColor(scenario.evidenceLevel)} border text-xs`}>
                          Evidence {scenario.evidenceLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                          <div className="text-sm font-medium text-emerald-900">Risk Reduction</div>
                          <div className="text-2xl font-bold text-emerald-700">
                            {scenario.expectedRiskReduction}%
                          </div>
                          <div className="text-xs text-emerald-600">
                            95% CI: {scenario.confidence[0]}-{scenario.confidence[1]}%
                          </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="text-sm font-medium text-blue-900">Interventions</div>
                          <div className="text-2xl font-bold text-blue-700">
                            {scenario.interventions.length}
                          </div>
                          <div className="text-xs text-blue-600">
                            Biomarker targets
                          </div>
                        </div>

                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                          <div className="text-sm font-medium text-purple-900">Timeline</div>
                          <div className="text-lg font-bold text-purple-700">
                            {Math.max(...scenario.interventions.map(i => parseInt(i.timeframe.split('-')[1])))} weeks
                          </div>
                          <div className="text-xs text-purple-600">
                            Maximum timeframe
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {selectedScenario === scenario.id ? 'Collapse' : 'View Details'}
                    </Button>
                  </div>

                  {selectedScenario === scenario.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Intervention Details</h4>
                      <div className="space-y-3">
                        {scenario.interventions.map((intervention, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{intervention.biomarker}</span>
                              <Badge variant="outline" className="text-xs">
                                {intervention.timeframe}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">Current:</span>
                                <span className="font-medium">{intervention.currentValue} {intervention.unit}</span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">Target:</span>
                                <span className="font-medium text-green-700">{intervention.targetValue} {intervention.unit}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Target className="h-4 w-4 mr-2" />
                          Set as Goals
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share with Clinician
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Analysis
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Information */}
      {showTechnicalDetails && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Model Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Model Architecture</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Gradient Boosting (XGBoost) for risk prediction</li>
                  <li>• Random Forest for feature importance ranking</li>
                  <li>• SHAP (SHapley Additive exPlanations) for explainability</li>
                  <li>• Isotonic regression for probability calibration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• AUC-ROC: 0.847 (95% CI: 0.821-0.873)</li>
                  <li>• Calibration slope: 0.98 (well-calibrated)</li>
                  <li>• Brier score: 0.089 (excellent discrimination)</li>
                  <li>• Training cohort: n=47,832 patients</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Feature Engineering</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Z-score normalization for age/sex adjustment</li>
                  <li>• Rolling averages for wearable metrics (7d, 30d)</li>
                  <li>• Biomarker trend analysis (slope, variability)</li>
                  <li>• Interaction terms for synergistic effects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Validation & Monitoring</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 5-fold cross-validation during training</li>
                  <li>• External validation on independent cohort</li>
                  <li>• Continuous monitoring for data drift</li>
                  <li>• Fairness metrics across demographic groups</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
