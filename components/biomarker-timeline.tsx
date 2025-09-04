'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, Download } from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';

interface BiomarkerData {
  date: string;
  value: number;
  reference: string;
  percentile: number;
}

interface BiomarkerTimelineProps {
  biomarker: {
    name: string;
    unit: string;
    target: string;
    optimalRange: string;
    longevityTarget: string;
    data: BiomarkerData[];
  };
}

function BiomarkerChart({ biomarker }: BiomarkerTimelineProps) {
  const getStatusColor = (reference: string) => {
    switch (reference) {
      case 'optimal': return 'text-emerald-600';
      case 'normal': return 'text-blue-600';
      case 'borderline': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (reference: string) => {
    switch (reference) {
      case 'optimal': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'borderline': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const latestValue = biomarker.data[biomarker.data.length - 1];
  const previousValue = biomarker.data[biomarker.data.length - 2];
  const trend = previousValue ? ((latestValue.value - previousValue.value) / previousValue.value) * 100 : 0;

  // Extract target value for reference line
  const targetValue = parseFloat(biomarker.target.replace(/[<>]/g, ''));

  return (
    <Card className="relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{
          backgroundImage: `url(${MOCK_DATA.images.medical.biomarkers})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{biomarker.name}</CardTitle>
            <p className="text-sm text-gray-600">Target: {biomarker.target} {biomarker.unit}</p>
          </div>
          <Badge className={`${getStatusBadge(latestValue.reference)} border`}>
            {latestValue.reference}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Current Value and Trend */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">{latestValue.value}</span>
              <span className="text-sm text-gray-500">{biomarker.unit}</span>
            </div>
            <div className="text-sm text-gray-600">
              {latestValue.percentile}th percentile
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-red-600" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            ) : null}
            <span className={`text-sm font-medium ${
              trend > 0 ? 'text-red-600' : trend < 0 ? 'text-emerald-600' : 'text-gray-600'
            }`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={biomarker.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  });
                }}
                formatter={(value: number, name) => [
                  `${value} ${biomarker.unit}`,
                  biomarker.name
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              
              {/* Target reference line */}
              {!isNaN(targetValue) && (
                <ReferenceLine 
                  y={targetValue} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ value: "Target", position: "topRight", fontSize: 10 }}
                />
              )}
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#1d4ed8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Target Ranges */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Standard Target:</span>
            <span className="font-medium">{biomarker.target} {biomarker.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Optimal Range:</span>
            <span className="font-medium text-blue-600">{biomarker.optimalRange} {biomarker.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Longevity Target:</span>
            <span className="font-medium text-emerald-600">{biomarker.longevityTarget} {biomarker.unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BiomarkerTimeline() {
  const biomarkers = MOCK_DATA.longevityBiomarkers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Biomarker Timeline</h2>
          <p className="text-gray-600">Longitudinal tracking of key longevity biomarkers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="12months">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 months</SelectItem>
              <SelectItem value="6months">6 months</SelectItem>
              <SelectItem value="12months">12 months</SelectItem>
              <SelectItem value="24months">24 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Biomarker Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BiomarkerChart biomarker={biomarkers.apob} />
        <BiomarkerChart biomarker={biomarkers.hba1c} />
        <BiomarkerChart biomarker={biomarkers.hscrp} />
        <BiomarkerChart biomarker={biomarkers.vo2max} />
      </div>

      {/* Medication Timeline Overlay */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Intervention Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium text-sm">Atorvastatin 20mg started</div>
                <div className="text-xs text-gray-600">February 2024 • ApoB reduction protocol</div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Effective
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium text-sm">Zone 2 Cardio Program</div>
                <div className="text-xs text-gray-600">March 2024 • VO₂max optimization</div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Ongoing
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
