'use client';

import { AdvancedPatientDashboard } from '@/components/advanced-patient-dashboard';
import { ClientOnly } from '@/components/client-only';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, User, Activity, Heart, Brain, Info } from 'lucide-react';
import Link from 'next/link';
import { MOCK_DATA } from '@/lib/mock-data';

export default function PatientDemoPage() {
  const patient = MOCK_DATA.patient;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Demo Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/demo">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Demos
                </Button>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Patient Dashboard Demo</h1>
                  <p className="text-xs text-gray-600">Interactive health optimization platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                <User className="w-3 h-3 mr-1" />
                Patient View
              </Badge>
              <div className="text-sm text-right">
                <div className="font-medium">{patient.name}</div>
                <div className="text-gray-600">Demo Patient</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Info Banner */}
      <div className="bg-emerald-50 border-b border-emerald-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Patient Demo Experience
                </p>
                <p className="text-xs text-emerald-700">
                  Explore personalized health insights, risk assessments, and longevity programs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-emerald-700">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>Risk Rings</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>Wearables</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>AI Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <ClientOnly
          fallback={
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Loading Health Dashboard...</h1>
                  <p className="text-gray-600 mt-1">Preparing your personalized health insights</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        >
          <AdvancedPatientDashboard />
        </ClientOnly>
      </div>

      {/* Demo Footer */}
      <div className="border-t bg-white/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>This is a demonstration of the patient experience.</p>
              <p>All data shown is simulated for demo purposes.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/doctor-demo">
                <Button variant="outline" size="sm">
                  View Doctor Demo
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="sm">
                  Back to Demo Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
