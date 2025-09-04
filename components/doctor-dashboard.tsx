'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  FileText,
  Filter,
  Calendar,
  Activity,
  Heart,
  Brain,
  BarChart3,
  Stethoscope,
  MessageSquare
} from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';
import { CohortOverview } from '@/components/cohort-overview';
import { BiomarkerTimeline } from '@/components/biomarker-timeline';
import { DecisionSupport } from '@/components/decision-support';

export function DoctorDashboard() {
  const doctor = MOCK_DATA.doctor;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. {doctor.name}</h1>
          <p className="text-gray-600 mt-1">
            Longevity Medicine Specialist • Managing 247 patients
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="cohort" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cohort" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Cohort Overview</span>
          </TabsTrigger>
          <TabsTrigger value="biomarkers" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Biomarker Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="decision-support" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Decision Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cohort" className="space-y-6">
          <CohortOverview />
        </TabsContent>

        <TabsContent value="biomarkers" className="space-y-6">
          <BiomarkerTimeline />
        </TabsContent>

        <TabsContent value="decision-support" className="space-y-6">
          <DecisionSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
}