'use client';

import { PatientSummary } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MOCK_DATA } from '@/lib/mock-data';
import { Calendar, Activity, Pill, TrendingUp } from 'lucide-react';

interface PatientDrillDownProps {
  patient: PatientSummary;
}

export function PatientDrillDown({ patient }: PatientDrillDownProps) {
  // Mock biomarker timeline data
  const biomarkerData = MOCK_DATA.biomarkerTimeline;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Info Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{patient.name}</h3>
          <p className="text-sm text-gray-600">{patient.age} years old, {patient.sex}</p>
        </div>
        <Badge className={`${
          patient.overallRisk === 'low' ? 'bg-emerald-100 text-emerald-700' :
          patient.overallRisk === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {patient.overallRisk.toUpperCase()} RISK
        </Badge>
      </div>

      {/* Risk Scores */}
      <div className="grid grid-cols-3 gap-4">
        {patient.riskScores.map((risk) => (
          <div key={risk.category} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 capitalize mb-1">
              {risk.category.replace('_', ' ')}
            </div>
            <div className={`text-xl font-bold ${getRiskColor(risk.level)}`}>
              {risk.percentile}th
            </div>
            <div className="text-xs text-gray-500">percentile</div>
          </div>
        ))}
      </div>

      {/* Biomarker Timeline */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Biomarker Timeline
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={biomarkerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="apoB"
                stroke="#ef4444"
                strokeWidth={2}
                name="ApoB (mg/dL)"
              />
              <Line
                type="monotone"
                dataKey="hba1c"
                stroke="#3b82f6"
                strokeWidth={2}
                name="HbA1c (%)"
              />
              <Line
                type="monotone"
                dataKey="hs_crp"
                stroke="#f59e0b"
                strokeWidth={2}
                name="hs-CRP (mg/L)"
              />
              {/* Medication start markers */}
              <ReferenceLine x="2024-06-01" stroke="#10b981" strokeDasharray="5 5" />
              <ReferenceLine x="2024-07-15" stroke="#8b5cf6" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 bg-red-500"></div>
            <span>ApoB</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 bg-blue-500"></div>
            <span>HbA1c</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 bg-yellow-500"></div>
            <span>hs-CRP</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 bg-green-500 opacity-50"></div>
            <span>Statin started</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 bg-purple-500 opacity-50"></div>
            <span>Metformin added</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Appointments */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Activity
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Last Visit:</span>
              <span className="font-medium">{patient.lastVisit?.toLocaleDateString()}</span>
            </div>
            {patient.nextAppointment && (
              <div className="flex justify-between">
                <span>Next Appointment:</span>
                <span className="font-medium text-blue-600">{patient.nextAppointment.toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Medication Compliance:</span>
              <span className={`font-medium ${
                patient.medicationCompliance >= 90 ? 'text-green-600' :
                patient.medicationCompliance >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {patient.medicationCompliance}%
              </span>
            </div>
          </div>
        </div>

        {/* Wearable Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Wearable Data
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant="outline" className={`${
                patient.wearableStatus === 'active' ? 'bg-green-100 text-green-700' :
                patient.wearableStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {patient.wearableStatus}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              {patient.wearableStatus === 'active' && 'All devices syncing properly'}
              {patient.wearableStatus === 'partial' && 'Some devices need attention'}
              {patient.wearableStatus === 'inactive' && 'No recent data received'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}