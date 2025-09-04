'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Stethoscope, 
  Heart, 
  Activity, 
  Brain, 
  BarChart3, 
  Users, 
  ArrowRight,
  Play,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DemoLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Health Optimization Platform</h1>
                <p className="text-sm text-gray-600">Clinical-grade longevity medicine</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              Demo Environment
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experience the Future of Preventive Healthcare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive health optimization platform with AI-driven insights, 
            wearable device integration, and personalized longevity protocols.
          </p>
        </div>

        {/* Demo Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Patient Demo */}
          <Card className="relative overflow-hidden border-2 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-4 right-4">
              <Badge className="bg-emerald-500 hover:bg-emerald-600">
                <User className="w-3 h-3 mr-1" />
                Patient View
              </Badge>
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Patient Dashboard</CardTitle>
                  <p className="text-gray-600">Personal health optimization</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Preview Image */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Interactive Health Dashboard</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Risk Assessment Rings</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Wearable Device Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Biomarker Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">AI-Powered Insights</span>
                </div>
              </div>

              {/* Demo User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-emerald-700">SJ</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">39 years old • Low risk profile</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href="/patient-demo" className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Play className="w-4 h-4 mr-2" />
                    Launch Patient Demo
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Demo */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-4 right-4">
              <Badge className="bg-blue-500 hover:bg-blue-600">
                <Stethoscope className="w-3 h-3 mr-1" />
                Doctor View
              </Badge>
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Doctor Dashboard</CardTitle>
                  <p className="text-gray-600">Clinical decision support</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Preview Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Population Health Management</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Cohort Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Biomarker Timeline</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Decision Support AI</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Risk Stratification</span>
                </div>
              </div>

              {/* Demo User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">MC</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dr. Michael Chen</p>
                    <p className="text-sm text-gray-600">Preventive Medicine • 247 patients</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href="/doctor-demo" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Launch Doctor Demo
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Platform Highlights</h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Device Integration</h4>
              <p className="text-sm text-gray-600">Apple Health, Garmin, WHOOP, Oura Ring</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Insights</h4>
              <p className="text-sm text-gray-600">SHAP explainability & risk prediction</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Biomarker Tracking</h4>
              <p className="text-sm text-gray-600">ApoB, HbA1c, VO₂max & more</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Longevity Focus</h4>
              <p className="text-sm text-gray-600">Evidence-based healthspan optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
