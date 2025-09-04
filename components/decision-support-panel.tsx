'use client';

import { DecisionSupport, PatientSummary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  FileText,
  Send,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DecisionSupportPanelProps {
  decisionSupport: DecisionSupport;
  patient: PatientSummary;
}

export function DecisionSupportPanel({ decisionSupport, patient }: DecisionSupportPanelProps) {
  return (
    <div className="space-y-6">
      {/* Confidence Score */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold">AI Decision Support</h4>
          <p className="text-sm text-gray-600">
            Analysis updated {new Date(decisionSupport.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{decisionSupport.confidence}%</div>
          <div className="text-xs text-gray-500">Confidence</div>
        </div>
      </div>

      {/* Top SHAP Factors */}
      <div>
        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Top Risk Drivers (SHAP Analysis)
        </h5>
        <div className="space-y-3">
          {decisionSupport.topFactors.slice(0, 5).map((factor, index) => (
            <div key={factor.feature} className="flex items-center gap-3">
              <div className="w-20 text-sm font-medium">{factor.feature}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Progress
                    value={Math.abs(factor.impact) * 100}
                    className="flex-1 h-2"
                  />
                  <div className={`flex items-center gap-1 text-sm ${
                    factor.impact > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {factor.impact > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(factor.impact).toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {factor.value} - {factor.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Clinical Recommendations
          </h5>
          <div className="space-y-2">
            {decisionSupport.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">{rec}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Evidence-Based Guidelines
          </h5>
          <div className="space-y-2">
            {decisionSupport.guidelines.map((guideline, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">{guideline}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Send Plan to Patient
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          View Audit Log
        </Button>
      </div>

      {/* Model Information */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="font-medium mb-1">Model Information:</div>
        <div>
          This analysis uses a validated machine learning model trained on longitudinal health data.
          SHAP (SHapley Additive exPlanations) values show the contribution of each feature to the risk prediction.
          Recommendations are based on current clinical guidelines and should be considered alongside clinical judgment.
        </div>
      </div>
    </div>
  );
}