'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MOCK_DATA } from '@/lib/mock-data';

interface RiskRingProps {
  category: {
    name: string;
    score: number;
    status: 'excellent' | 'good' | 'moderate' | 'poor';
    color: string;
    description: string;
    factors: string[];
    target: string;
  };
}

function RiskRing({ category }: RiskRingProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-500';
      case 'good': return 'bg-blue-500';
      case 'moderate': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryImage = (name: string) => {
    const images = MOCK_DATA.images;
    switch (name.toLowerCase()) {
      case 'cardiovascular': return images.riskCategories.cardiovascular;
      case 'metabolic': return images.riskCategories.metabolic;
      case 'neurocognitive': return images.riskCategories.neurocognitive;
      default: return images.medical.biomarkers;
    }
  };

  // Convert percentile to progress (lower percentile = better = higher progress)
  const progressValue = Math.max(0, 100 - category.score);

  return (
    <Card className="relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getCategoryImage(category.name)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
          <Badge className={`${getStatusColor(category.status)} border`}>
            {category.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{category.description}</p>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Risk Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(progressValue / 100) * 314} 314`}
                className={`${
                  category.status === 'excellent' ? 'text-emerald-500' :
                  category.status === 'good' ? 'text-blue-500' :
                  category.status === 'moderate' ? 'text-yellow-500' :
                  'text-red-500'
                } transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {category.score}
              </span>
              <span className="text-xs text-gray-500">percentile</span>
            </div>
          </div>
        </div>

        {/* Target and Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target: {category.target}</span>
            <span className={`font-medium ${
              category.status === 'excellent' ? 'text-emerald-600' :
              category.status === 'good' ? 'text-blue-600' :
              category.status === 'moderate' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {progressValue}% optimal
            </span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2"
          />
        </div>

        {/* Key Factors */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Key Factors</h4>
          <div className="flex flex-wrap gap-1">
            {category.factors.map((factor, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1"
              >
                {factor}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskRings() {
  const riskCategories = MOCK_DATA.longevityRiskCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Longevity Risk Assessment</h2>
          <p className="text-gray-600">Your health optimization scores across key longevity domains</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
          Overall: Excellent
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskRing category={riskCategories.cardiovascular} />
        <RiskRing category={riskCategories.metabolic} />
        <RiskRing category={riskCategories.neurocognitive} />
      </div>

      {/* Summary Insights */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 text-sm font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Excellent Progress!</h3>
              <p className="text-gray-700 text-sm">
                Your cardiovascular risk is in the top 15th percentile. Continue your current exercise routine 
                and consider adding Zone 2 cardio for further mitochondrial optimization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
