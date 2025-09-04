'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Users,
  Filter,
  Search,
  TrendingUp,
  AlertTriangle,
  Heart,
  Activity,
  Brain,
  Download
} from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';
import Link from 'next/link';

const RISK_COLORS = {
  low: '#10b981',      // emerald-500
  moderate: '#f59e0b', // amber-500
  high: '#ef4444'      // red-500
};

const AGE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

export function CohortOverview() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all-ages');
  
  const cohortData = MOCK_DATA.cohortData;
  const patientSummaries = MOCK_DATA.patientSummaries;

  // Local demo condition mapping per patient id
  const patientConditions: Record<string, string[]> = {
    'patient-1': ['Pre-diabetes'],
    'patient-2': ['Hypertension', 'Dyslipidemia'],
    'patient-3': ['Metabolic Syndrome']
  };

  // Apply filters to patients
  const filteredPatients = patientSummaries.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

    const conditionMatch = selectedFilter === 'all'
      ? true
      : (patientConditions[p.id] || []).some(c => c.toLowerCase() === selectedFilter.toLowerCase());

    const ageMatch = (() => {
      if (ageFilter === 'all-ages') return true;
      const [minS, maxS] = ageFilter.split('-');
      const min = parseInt(minS, 10);
      const max = parseInt(maxS, 10);
      return p.age >= min && p.age <= max;
    })();

    return nameMatch && conditionMatch && ageMatch;
  });

  // Derive cohort aggregates from filtered patients
  const derivedRisk = filteredPatients.reduce(
    (acc, p) => {
      acc[p.overallRisk] = (acc[p.overallRisk] || 0) + 1;
      return acc;
    },
    { low: 0, moderate: 0, high: 0 } as Record<'low' | 'moderate' | 'high', number>
  );

  const derivedAges = filteredPatients.reduce((acc, p) => {
    const bucket = p.age < 40 ? '30-40' : p.age < 50 ? '40-50' : p.age < 60 ? '50-60' : '60-70';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const derivedConditions = filteredPatients.reduce((acc, p) => {
    for (const c of patientConditions[p.id] || []) {
      acc[c] = (acc[c] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalFiltered = filteredPatients.length || 0;

  // Prepare data for charts (use derived when filtered, fallback to static when no patients)
  const riskDistributionData = (
    totalFiltered > 0
      ? [
          { name: 'Low Risk', value: derivedRisk.low, color: RISK_COLORS.low },
          { name: 'Moderate Risk', value: derivedRisk.moderate, color: RISK_COLORS.moderate },
          { name: 'High Risk', value: derivedRisk.high, color: RISK_COLORS.high }
        ]
      : [
          { name: 'Low Risk', value: cohortData.riskDistribution.low, color: RISK_COLORS.low },
          { name: 'Moderate Risk', value: cohortData.riskDistribution.moderate, color: RISK_COLORS.moderate },
          { name: 'High Risk', value: cohortData.riskDistribution.high, color: RISK_COLORS.high }
        ]
  );

  const ageBuckets = ['30-40', '40-50', '50-60', '60-70'];

  const ageGroupData = (
    totalFiltered > 0
      ? ageBuckets.map((b) => ({ age: b, count: derivedAges[b] || 0 }))
      : ageBuckets.map((b) => ({ age: b, count: (cohortData.ageGroups as Record<string, number>)[b] || 0 }))
  );

  const conditionsData = (
    totalFiltered > 0
      ? Object.entries(derivedConditions).map(([condition, count]) => ({ condition, count }))
      : Object.entries(cohortData.conditions).map(([condition, count]) => ({ condition, count }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cohort Overview</h2>
          <p className="text-gray-600">Population health analytics and risk stratification</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/demo">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{cohortData.totalPatients}</div>
                <div className="text-sm text-gray-600">Total Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {((cohortData.riskDistribution.low / cohortData.totalPatients) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Low Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {cohortData.longevityMetrics.averageBiologicalAge.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Bio Age</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {cohortData.longevityMetrics.topPerformers}
                </div>
                <div className="text-sm text-gray-600">Top Performers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="pre-diabetes">Pre-diabetes</SelectItem>
                <SelectItem value="hypertension">Hypertension</SelectItem>
                <SelectItem value="dyslipidemia">Dyslipidemia</SelectItem>
                <SelectItem value="metabolic-syndrome">Metabolic Syndrome</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-ages">All Ages</SelectItem>
                <SelectItem value="30-40">30-40</SelectItem>
                <SelectItem value="40-50">40-50</SelectItem>
                <SelectItem value="50-60">50-60</SelectItem>
                <SelectItem value="60-70">60-70</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} patients`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {riskDistributionData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGroupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`${value} patients`, 'Count']}
                    labelFormatter={(label) => `Age Group: ${label}`}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conditions Prevalence */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Condition Prevalence</CardTitle>
              <span className="text-xs text-gray-500">Model: ConditionRisk-XGB v1.2</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionsData}
                    dataKey="count"
                    nameKey="condition"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {conditionsData.map((_, i) => (
                      <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number, _n, p: any) => [`${v} patients`, p?.payload?.condition]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Longevity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Longevity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <div>
                  <div className="font-medium text-emerald-800">Average Biological Age</div>
                  <div className="text-sm text-emerald-600">vs Chronological Age</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-800">
                    {cohortData.longevityMetrics.averageBiologicalAge}
                  </div>
                  <div className="text-sm text-emerald-600">
                    vs {cohortData.longevityMetrics.averageChronologicalAge}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-800">Healthspan Projection</div>
                  <div className="text-sm text-blue-600">Average years</div>
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {cohortData.longevityMetrics.healthspanProjection}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium text-yellow-800">Top 10% Performers</div>
                  <div className="text-sm text-yellow-600">Across all metrics</div>
                </div>
                <div className="text-lg font-bold text-yellow-800">
                  {cohortData.longevityMetrics.topPerformers}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{
            backgroundImage: `url(${MOCK_DATA.images.medical.analytics})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Patients</CardTitle>
            <Link href="/doctor-demo">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="flex items-center space-x-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={patient.avatar} alt={patient.name} />
                  <AvatarFallback>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{patient.name}</div>
                  <div className="text-sm text-gray-600">{patient.age} years • {patient.sex}</div>
                </div>
                <Badge
                  className={`${
                    patient.overallRisk === 'low' ? 'bg-emerald-100 text-emerald-700' :
                    patient.overallRisk === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  } border-0`}
                >
                  {patient.overallRisk}
                </Badge>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div className="col-span-full text-sm text-gray-600">No patients match your filters.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* High-Risk Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span>High-Risk Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <div className="font-medium text-red-800">3 patients with ApoB &gt;120 mg/dL</div>
                <div className="text-sm text-red-600">Require immediate lipid intervention</div>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700"
                onClick={() => { setSelectedFilter('dyslipidemia'); }}>
                Review
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div>
                <div className="font-medium text-red-800">5 patients with declining HRV trends</div>
                <div className="text-sm text-red-600">Stress management protocols needed</div>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700"
                onClick={() => { setSelectedFilter('hypertension'); }}>
                Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
