'use client';

import { DoctorDashboard } from '@/components/doctor-dashboard';
import { ClientOnly } from '@/components/client-only';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Stethoscope, Users, BarChart3, Brain, Info } from 'lucide-react';
import Link from 'next/link';
import { MOCK_DATA } from '@/lib/mock-data';

export default function DoctorDemoPage() {
  const doctor = MOCK_DATA.doctor;

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
                  <h1 className="text-lg font-bold text-gray-900">Doctor Dashboard Demo</h1>
                  <p className="text-xs text-gray-600">Clinical decision support platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Stethoscope className="w-3 h-3 mr-1" />
                Doctor View
              </Badge>
              <div className="text-sm text-right">
                <div className="font-medium">{doctor.name}</div>
                <div className="text-gray-600">Demo Doctor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Clinical Dashboard Demo
                </p>
                <p className="text-xs text-blue-700">
                  Explore population health management, biomarker analytics, and AI-powered decision support
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-blue-700">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Cohort Analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                <span>Biomarkers</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>Decision Support</span>
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
                  <h1 className="text-3xl font-bold text-gray-900">Loading Clinical Dashboard...</h1>
                  <p className="text-gray-600 mt-1">Preparing population health analytics</p>
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
          <DoctorDashboard />
        </ClientOnly>
      </div>

      {/* Demo Footer */}
      <div className="border-t bg-white/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>This is a demonstration of the clinical experience.</p>
              <p>All patient data shown is simulated for demo purposes.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/patient-demo">
                <Button variant="outline" size="sm">
                  View Patient Demo
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
