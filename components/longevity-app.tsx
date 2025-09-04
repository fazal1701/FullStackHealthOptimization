'use client';

import { useState } from 'react';
import { Navigation, NavigationSection } from '@/components/navigation';
import { PatientDashboard } from '@/components/patient-dashboard';
import { Zone2VO2MaxProgram } from '@/components/zone2-vo2max-program';
import { MetabolicHealthProgram } from '@/components/metabolic-health-program';
import { ApoBBiomarker } from '@/components/apob-biomarker';
import { HbA1cBiomarker } from '@/components/hba1c-biomarker';
import { StudiesUpdates } from '@/components/studies-updates';
import { MedicationsSupplements } from '@/components/medications-supplements';
import { AdvancedAccountData } from '@/components/advanced-account-data';
import { MLExplainability } from '@/components/ml-explainability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Link, 
  Upload, 
  Download, 
  Settings, 
  Shield, 
  Moon, 
  Dumbbell,
  Construction,
  ArrowLeft
} from 'lucide-react';

// Placeholder components for sections not yet implemented
function SleepOptimizationProgram() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sleep Optimization Program</h1>
          <p className="text-gray-600 mt-1">Enhance sleep quality and recovery for longevity</p>
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Coming Soon</h3>
              <p className="text-gray-700 text-sm">
                Comprehensive sleep optimization program with circadian rhythm analysis, 
                sleep efficiency tracking, and evidence-based interventions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StrengthMobilityProgram() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strength & Mobility Program</h1>
          <p className="text-gray-600 mt-1">Build muscle mass and maintain movement quality</p>
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Coming Soon</h3>
              <p className="text-gray-700 text-sm">
                Strength training protocols, mobility assessments, and sarcopenia prevention 
                strategies for healthy aging.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DevicesDataPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Devices & Data</h1>
          <p className="text-gray-600 mt-1">Connect wearables and manage your health data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-blue-600" />
              Connected Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    🍎
                  </div>
                  <div>
                    <div className="font-medium">Apple Health</div>
                    <div className="text-sm text-gray-600">Connected</div>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    💍
                  </div>
                  <div>
                    <div className="font-medium">Oura Ring</div>
                    <div className="text-sm text-gray-600">Connected</div>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Active
                </Badge>
              </div>

              <Button className="w-full" variant="outline">
                <Link className="h-4 w-4 mr-2" />
                Connect New Device
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Data Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload CSV files with lab results or health data
                </p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
              
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AccountConsentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account & Consent</h1>
          <p className="text-gray-600 mt-1">Manage your privacy settings and data permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Privacy Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Data Sharing</div>
                  <div className="text-sm text-gray-600">Share anonymized data for research</div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Export Data</div>
                  <div className="text-sm text-gray-600">Download all your health data</div>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-gray-600">Permanently remove your data</div>
                </div>
                <Button variant="outline" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="text-sm text-gray-600">sarah.johnson@email.com</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Notifications</label>
                <div className="text-sm text-gray-600">Daily insights enabled</div>
              </div>
              
              <Button variant="outline" className="w-full">
                Update Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LongevityApp() {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('home');

  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return <PatientDashboard />;
      case 'zone2-vo2max':
        return <Zone2VO2MaxProgram />;
      case 'metabolic-health':
        return <MetabolicHealthProgram />;
      case 'sleep-optimization':
        return <SleepOptimizationProgram />;
      case 'strength-mobility':
        return <StrengthMobilityProgram />;
      case 'apob':
        return <ApoBBiomarker />;
      case 'hba1c':
        return <HbA1cBiomarker />;
      case 'devices':
        return <DevicesDataPage />;
      case 'account':
        return <AdvancedAccountData />;
      case 'studies':
        return <StudiesUpdates />;
      case 'medications':
        return <MedicationsSupplements />;
      case 'ml-analysis':
        return <MLExplainability />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <Navigation 
          currentSection={currentSection} 
          onSectionChange={setCurrentSection} 
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}
