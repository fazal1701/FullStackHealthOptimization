'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, Brain, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Health Optimization Platform</h1>
          <p className="text-gray-700">
            AI-driven dashboard aggregating wearable, clinical, and lifestyle data to forecast and prevent
            risks across cardiovascular, cancer, neurodegenerative, and metabolic disease.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/login"><Button>Login</Button></Link>
            <Link href="/patient-demo"><Button variant="outline">Patient Demo</Button></Link>
            <Link href="/doctor-demo"><Button variant="outline">Doctor Demo</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link href="/patient-demo" className="group overflow-hidden rounded-xl border bg-gradient-to-br from-emerald-500/10 to-blue-500/10 hover:from-emerald-500/20 hover:to-blue-500/20 transition shadow-sm">
            <div className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Patient Experience</h3>
                <p className="text-sm text-gray-600">Personalized insights, risk rings, and wearable trends.</p>
              </div>
            </div>
          </Link>

          <Link href="/doctor-demo" className="group overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-500/10 to-blue-500/10 hover:from-indigo-500/20 hover:to-blue-500/20 transition shadow-sm">
            <div className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Clinician Dashboard</h3>
                <p className="text-sm text-gray-600">Population risk stratification and decision support.</p>
              </div>
            </div>
          </Link>

          <div className="overflow-hidden rounded-xl border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-sm">
            <div className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Multi-device Integration</h3>
                <p className="text-sm text-gray-600">Fitbit, Oura, WHOOP, Apple Health, Garmin with quality scoring.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


