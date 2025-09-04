'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  FileText,
  Send
} from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';

interface RiskFactorProps {
  factor: {
    factor: string;
    impact: number;
    direction: 'positive' | 'negative';
    description: string;
    intervention: string;
  };
}

function RiskFactorCard({ factor }: RiskFactorProps) {
  const impactPercentage = factor.impact * 100;
  const isNegative = factor.direction === 'negative';

  return (
    <Card className={`border-l-4 ${
      isNegative ? 'border-l-red-500 bg-red-50' : 'border-l-emerald-500 bg-emerald-50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isNegative ? (
              <TrendingDown className="w-5 h-5 text-red-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            )}
            <h3 className="font-semibold text-gray-900">{factor.factor}</h3>
          </div>
          <Badge className={`${
            isNegative ? 'bg-red-100 text-red-800 border-red-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
          } border`}>
            {impactPercentage.toFixed(0)}% impact
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mb-3">{factor.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Risk Contribution</span>
            <span>{impactPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={impactPercentage} 
            className={`h-2 ${
              isNegative ? '[&>div]:bg-red-500' : '[&>div]:bg-emerald-500'
            }`}
          />
        </div>

        <div className="mt-3 p-2 bg-white rounded border">
          <div className="text-xs font-medium text-gray-700 mb-1">Recommended Intervention:</div>
          <div className="text-xs text-gray-600">{factor.intervention}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DecisionSupport() {
  const riskFactors = MOCK_DATA.longevityRiskFactors;

  const guidelines = [
    {
      id: 1,
      title: 'Consider intensifying lipid-lowering therapy',
      description: 'ApoB ≥ 120 mg/dL with elevated Lp(a) indicates high cardiovascular risk',
      evidence: 'ACC/AHA 2019 Guidelines',
      priority: 'high',
      action: 'Increase statin dose or add ezetimibe'
    },
    {
      id: 2,
      title: 'Implement structured exercise program',
      description: 'VO₂max < 30th percentile for age significantly impacts longevity',
      evidence: 'Mandsager et al. JAMA 2018',
      priority: 'high',
      action: 'Zone 2 cardio 3x/week + resistance training 2x/week'
    },
    {
      id: 3,
      title: 'Address sleep optimization',
      description: 'Poor sleep quality affects multiple longevity pathways',
      evidence: 'Sleep Medicine Reviews 2020',
      priority: 'medium',
      action: 'Sleep hygiene protocol + circadian rhythm optimization'
    },
    {
      id: 4,
      title: 'Monitor glycemic variability',
      description: 'Time in Range < 70% despite normal HbA1c',
      evidence: 'Diabetes Care 2019',
      priority: 'medium',
      action: 'CGM monitoring + dietary intervention'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Decision Support</h2>
          <p className="text-gray-600">Explainable AI insights and evidence-based recommendations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send to Patient
          </Button>
        </div>
      </div>

      {/* SHAP-style Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Top Risk Drivers (SHAP Analysis)</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            AI-identified factors with highest impact on longevity risk
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskFactors.map((factor, index) => (
              <RiskFactorCard key={index} factor={factor} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evidence-Based Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Clinical Guidelines & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guidelines.map((guideline) => (
              <div 
                key={guideline.id}
                className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className={`w-4 h-4 ${
                      guideline.priority === 'high' ? 'text-red-600' :
                      guideline.priority === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                    <h3 className="font-semibold text-gray-900">{guideline.title}</h3>
                  </div>
                  <Badge className={`${getPriorityColor(guideline.priority)} border`}>
                    {guideline.priority} priority
                  </Badge>
                </div>

                <p className="text-sm text-gray-700 mb-2">{guideline.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Evidence: {guideline.evidence}
                  </div>
                  <Button variant="outline" size="sm">
                    <Send className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                </div>

                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-xs font-medium text-blue-800 mb-1">Recommended Action:</div>
                  <div className="text-xs text-blue-700">{guideline.action}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Communication Templates */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Patient Communication</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border">
              <div className="font-medium text-sm mb-1">Lifestyle Reinforcement Message</div>
              <div className="text-sm text-gray-700 mb-2">
                "Great progress on your cardiovascular health! Your ApoB levels have improved significantly. 
                Let's focus on optimizing your sleep quality to further enhance your longevity metrics."
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Send className="w-3 h-3 mr-1" />
                  Send Now
                </Button>
                <Button variant="ghost" size="sm">
                  Customize
                </Button>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <div className="font-medium text-sm mb-1">Exercise Program Update</div>
              <div className="text-sm text-gray-700 mb-2">
                "Based on your latest VO₂max results, I'm recommending we add Zone 2 cardio sessions 
                to your routine. This will help optimize your mitochondrial function and longevity."
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Send className="w-3 h-3 mr-1" />
                  Send Now
                </Button>
                <Button variant="ghost" size="sm">
                  Customize
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
