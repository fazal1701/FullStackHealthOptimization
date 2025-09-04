'use client';

import { PatientSummary } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CohortHeatmapProps {
  patients: PatientSummary[];
}

export function CohortHeatmap({ patients }: CohortHeatmapProps) {
  // Calculate risk distribution
  const riskDistribution = patients.reduce((acc, patient) => {
    acc[patient.overallRisk] = (acc[patient.overallRisk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'Low Risk', count: riskDistribution.low || 0, color: '#10b981' },
    { name: 'Moderate Risk', count: riskDistribution.moderate || 0, color: '#f59e0b' },
    { name: 'High Risk', count: riskDistribution.high || 0, color: '#ef4444' }
  ];

  // Calculate age distribution
  const ageGroups = patients.reduce((acc, patient) => {
    const ageGroup = patient.age < 40 ? '<40' : patient.age < 60 ? '40-60' : '60+';
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate wearable status
  const wearableStats = patients.reduce((acc, patient) => {
    acc[patient.wearableStatus] = (acc[patient.wearableStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{patients.length}</div>
          <div className="text-sm text-gray-600">Total Patients</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{riskDistribution.high || 0}</div>
          <div className="text-sm text-gray-600">High Risk</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{wearableStats.active || 0}</div>
          <div className="text-sm text-gray-600">Active Wearables</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(patients.reduce((sum, p) => sum + p.medicationCompliance, 0) / patients.length)}%
          </div>
          <div className="text-sm text-gray-600">Avg Compliance</div>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="h-64">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Distribution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Grid Heatmap */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Patient Risk Heatmap</h4>
        <div className="grid grid-cols-8 gap-1">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className={`h-8 w-8 rounded border-2 flex items-center justify-center text-xs font-bold ${
                patient.overallRisk === 'low' ? 'bg-emerald-200 border-emerald-300 text-emerald-800' :
                patient.overallRisk === 'moderate' ? 'bg-yellow-200 border-yellow-300 text-yellow-800' :
                'bg-red-200 border-red-300 text-red-800'
              }`}
              title={`${patient.name} - ${patient.overallRisk} risk`}
            >
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-emerald-200 border border-emerald-300 rounded"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span>Moderate Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-red-200 border border-red-300 rounded"></div>
            <span>High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}