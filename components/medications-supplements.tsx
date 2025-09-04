'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Pill,
  Heart,
  Zap,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingDown,
  TrendingUp,
  Clock,
  Share,
  Download,
  Search,
  Filter,
  Beaker,
  Target,
  Shield,
  Calendar
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  class: string;
  category: 'lipids' | 'glycemia' | 'blood-pressure' | 'hormones' | 'supplements';
  mechanism: string;
  mechanismDetail: string;
  expectedBiomarkerShifts: {
    biomarker: string;
    change: string;
    timeframe: string;
    magnitude: string;
  }[];
  monitoringLabs: {
    lab: string;
    frequency: string;
    reason: string;
  }[];
  commonSideEffects: string[];
  seriousSideEffects: string[];
  contraindications: string[];
  lifestyleSynergy: string[];
  dosing: {
    starting: string;
    target: string;
    maximum: string;
  };
  evidenceLevel: 'A' | 'B' | 'C';
  costTier: 'Low' | 'Medium' | 'High';
  patientFriendlyDescription: string;
}

const MEDICATION_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: <Pill className="h-4 w-4" />, count: 24 },
  { id: 'lipids', label: 'Lipid Management', icon: <Heart className="h-4 w-4" />, count: 8 },
  { id: 'glycemia', label: 'Glucose Control', icon: <Zap className="h-4 w-4" />, count: 6 },
  { id: 'blood-pressure', label: 'Blood Pressure', icon: <Activity className="h-4 w-4" />, count: 5 },
  { id: 'hormones', label: 'Hormone Therapy', icon: <Users className="h-4 w-4" />, count: 3 },
  { id: 'supplements', label: 'Supplements', icon: <Beaker className="h-4 w-4" />, count: 2 }
];

const FEATURED_MEDICATIONS: Medication[] = [
  {
    id: 'atorvastatin',
    name: 'Lipitor',
    genericName: 'Atorvastatin',
    class: 'HMG-CoA Reductase Inhibitor (Statin)',
    category: 'lipids',
    mechanism: 'Inhibits cholesterol synthesis in the liver',
    mechanismDetail: 'Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis, leading to upregulation of LDL receptors and increased clearance of atherogenic particles.',
    expectedBiomarkerShifts: [
      { biomarker: 'LDL-C', change: '↓30-60%', timeframe: '4-6 weeks', magnitude: 'Large' },
      { biomarker: 'ApoB', change: '↓25-50%', timeframe: '4-6 weeks', magnitude: 'Large' },
      { biomarker: 'Total Cholesterol', change: '↓25-40%', timeframe: '4-6 weeks', magnitude: 'Moderate' },
      { biomarker: 'hs-CRP', change: '↓15-30%', timeframe: '8-12 weeks', magnitude: 'Moderate' }
    ],
    monitoringLabs: [
      { lab: 'Lipid Panel', frequency: 'Every 6-8 weeks initially, then every 3-6 months', reason: 'Assess efficacy and titrate dose' },
      { lab: 'ALT/AST', frequency: 'Baseline, 6-12 weeks, then annually', reason: 'Monitor for hepatotoxicity' },
      { lab: 'CK', frequency: 'If muscle symptoms develop', reason: 'Rule out rhabdomyolysis' }
    ],
    commonSideEffects: ['Muscle aches (5-10%)', 'Headache (2-5%)', 'GI upset (2-3%)', 'Fatigue (1-2%)'],
    seriousSideEffects: ['Rhabdomyolysis (<0.1%)', 'Hepatotoxicity (<1%)', 'New-onset diabetes (0.2%)'],
    contraindications: ['Active liver disease', 'Pregnancy/breastfeeding', 'Concurrent strong CYP3A4 inhibitors'],
    lifestyleSynergy: ['High-fiber diet enhances LDL reduction', 'Exercise amplifies anti-inflammatory effects', 'Avoid grapefruit juice (CYP3A4 inhibition)'],
    dosing: {
      starting: '20mg daily',
      target: '40-80mg daily',
      maximum: '80mg daily'
    },
    evidenceLevel: 'A',
    costTier: 'Low',
    patientFriendlyDescription: 'A cholesterol-lowering medication that helps prevent heart attacks and strokes by reducing harmful cholesterol particles in your blood. Most people tolerate it well with minimal side effects.'
  },
  {
    id: 'metformin',
    name: 'Glucophage',
    genericName: 'Metformin',
    class: 'Biguanide',
    category: 'glycemia',
    mechanism: 'Reduces hepatic glucose production and improves insulin sensitivity',
    mechanismDetail: 'Activates AMPK pathway, inhibits gluconeogenesis in liver, enhances peripheral glucose uptake, and may have anti-aging effects through mTOR inhibition.',
    expectedBiomarkerShifts: [
      { biomarker: 'HbA1c', change: '↓0.5-1.5%', timeframe: '8-12 weeks', magnitude: 'Moderate' },
      { biomarker: 'Fasting Glucose', change: '↓20-40 mg/dL', timeframe: '4-8 weeks', magnitude: 'Moderate' },
      { biomarker: 'Weight', change: '↓2-5 lbs', timeframe: '12-24 weeks', magnitude: 'Small' },
      { biomarker: 'HOMA-IR', change: '↓15-25%', timeframe: '8-12 weeks', magnitude: 'Moderate' }
    ],
    monitoringLabs: [
      { lab: 'HbA1c', frequency: 'Every 3 months initially, then every 6 months', reason: 'Assess glycemic control' },
      { lab: 'eGFR/Creatinine', frequency: 'Every 6-12 months', reason: 'Monitor kidney function' },
      { lab: 'Vitamin B12', frequency: 'Annually', reason: 'Metformin can reduce B12 absorption' }
    ],
    commonSideEffects: ['GI upset (10-25%)', 'Diarrhea (5-15%)', 'Nausea (5-10%)', 'Metallic taste (2-5%)'],
    seriousSideEffects: ['Lactic acidosis (<0.1%)', 'Vitamin B12 deficiency (5-10% long-term)'],
    contraindications: ['eGFR <30 mL/min', 'Severe heart failure', 'Active alcohol abuse', 'Acute illness with hypoxia'],
    lifestyleSynergy: ['Take with meals to reduce GI side effects', 'Exercise enhances insulin sensitivity', 'High-fiber diet improves glucose control'],
    dosing: {
      starting: '500mg twice daily with meals',
      target: '1000mg twice daily',
      maximum: '2550mg daily (divided doses)'
    },
    evidenceLevel: 'A',
    costTier: 'Low',
    patientFriendlyDescription: 'A diabetes medication that helps your body use insulin better and prevents your liver from making too much sugar. It may also have anti-aging benefits and help with weight management.'
  },
  {
    id: 'omega3-epa',
    name: 'Vascepa',
    genericName: 'Icosapent Ethyl (EPA)',
    class: 'Omega-3 Fatty Acid',
    category: 'supplements',
    mechanism: 'Anti-inflammatory and triglyceride-lowering effects',
    mechanismDetail: 'EPA reduces triglyceride synthesis, has anti-inflammatory effects on vascular endothelium, stabilizes atherosclerotic plaques, and may reduce thrombosis risk.',
    expectedBiomarkerShifts: [
      { biomarker: 'Triglycerides', change: '↓15-30%', timeframe: '4-8 weeks', magnitude: 'Moderate' },
      { biomarker: 'hs-CRP', change: '↓10-20%', timeframe: '8-12 weeks', magnitude: 'Small' },
      { biomarker: 'ApoB', change: '↓5-10%', timeframe: '8-12 weeks', magnitude: 'Small' },
      { biomarker: 'Omega-3 Index', change: '↑50-100%', timeframe: '4-8 weeks', magnitude: 'Large' }
    ],
    monitoringLabs: [
      { lab: 'Lipid Panel', frequency: 'Every 3-6 months', reason: 'Monitor triglyceride response' },
      { lab: 'Omega-3 Index', frequency: 'Every 6-12 months', reason: 'Assess tissue incorporation' }
    ],
    commonSideEffects: ['Fishy aftertaste (5-10%)', 'GI upset (2-5%)', 'Burping (2-5%)'],
    seriousSideEffects: ['Increased bleeding risk (rare)', 'Atrial fibrillation (rare, high doses)'],
    contraindications: ['Allergy to fish/shellfish', 'Active bleeding disorders'],
    lifestyleSynergy: ['Take with meals to improve absorption', 'Refrigerate to maintain potency', 'Combine with antioxidants (vitamin E)'],
    dosing: {
      starting: '2g daily with meals',
      target: '4g daily (2g twice daily)',
      maximum: '4g daily'
    },
    evidenceLevel: 'A',
    costTier: 'Medium',
    patientFriendlyDescription: 'A purified fish oil supplement that reduces inflammation and triglycerides. Clinical studies show it can significantly reduce heart attack and stroke risk in high-risk patients.'
  }
];

export function MedicationsSupplements() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);
  const [patientFriendlyMode, setPatientFriendlyMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedications = FEATURED_MEDICATIONS.filter(med => {
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.class.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lipids': return 'bg-red-100 text-red-800 border-red-200';
      case 'glycemia': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blood-pressure': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hormones': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'supplements': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications & Supplements</h1>
          <p className="text-gray-600 mt-1">Evidence-based pharmacotherapy for longevity optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Patient-Friendly Mode</span>
            <Switch
              checked={patientFriendlyMode}
              onCheckedChange={setPatientFriendlyMode}
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Guide
          </Button>
        </div>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Pill className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Precision Pharmacotherapy Matters</h3>
              <p className="text-gray-700 text-sm mb-3">
                Optimize medication selection and monitoring with evidence-based protocols. Each medication includes 
                mechanism of action, expected biomarker changes, monitoring requirements, and lifestyle synergies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span>Expected biomarker shifts with timeframes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Monitoring protocols and safety guidelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share className="h-4 w-4 text-blue-500" />
                  <span>Patient-friendly explanations available</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search medications, classes, or indications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {MEDICATION_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {category.icon}
              {category.label}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Medications List */}
      <div className="space-y-4">
        {filteredMedications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            isExpanded={expandedMedication === medication.id}
            onToggleExpand={() => setExpandedMedication(expandedMedication === medication.id ? null : medication.id)}
            patientFriendlyMode={patientFriendlyMode}
            getCategoryColor={getCategoryColor}
            getEvidenceLevelColor={getEvidenceLevelColor}
          />
        ))}
      </div>
    </div>
  );
}

interface MedicationCardProps {
  medication: Medication;
  isExpanded: boolean;
  onToggleExpand: () => void;
  patientFriendlyMode: boolean;
  getCategoryColor: (category: string) => string;
  getEvidenceLevelColor: (level: string) => string;
}

function MedicationCard({
  medication,
  isExpanded,
  onToggleExpand,
  patientFriendlyMode,
  getCategoryColor,
  getEvidenceLevelColor
}: MedicationCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getCategoryColor(medication.category)} border text-xs`}>
                {medication.category.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge className={`${getEvidenceLevelColor(medication.evidenceLevel)} border text-xs`}>
                Evidence Level {medication.evidenceLevel}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {medication.costTier} Cost
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {medication.name} ({medication.genericName})
            </h3>
            <p className="text-sm text-gray-600 mb-2">{medication.class}</p>
            <p className="text-sm text-gray-700">
              {patientFriendlyMode ? medication.patientFriendlyDescription : medication.mechanism}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onToggleExpand}>
            {isExpanded ? 'Collapse' : 'View Details'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {!patientFriendlyMode && (
              <>
                {/* Mechanism of Action */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Beaker className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Mechanism of Action</h4>
                      <p className="text-sm text-blue-800">{medication.mechanismDetail}</p>
                    </div>
                  </div>
                </div>

                {/* Expected Biomarker Shifts */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Expected Biomarker Changes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {medication.expectedBiomarkerShifts.map((shift, index) => (
                      <div key={index} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-emerald-900">{shift.biomarker}</span>
                          <span className="text-lg font-bold text-emerald-700">{shift.change}</span>
                        </div>
                        <div className="text-xs text-emerald-600">
                          {shift.timeframe} • {shift.magnitude} effect
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monitoring Requirements */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Monitoring Protocol</h4>
                  <div className="space-y-2">
                    {medication.monitoringLabs.map((lab, index) => (
                      <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-medium text-yellow-900">{lab.lab}</span>
                            <p className="text-sm text-yellow-700 mt-1">{lab.reason}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {lab.frequency}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Dosing Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900">Starting Dose</div>
                <div className="text-lg font-bold text-purple-700">{medication.dosing.starting}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">Target Dose</div>
                <div className="text-lg font-bold text-blue-700">{medication.dosing.target}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="text-sm font-medium text-orange-900">Maximum Dose</div>
                <div className="text-lg font-bold text-orange-700">{medication.dosing.maximum}</div>
              </div>
            </div>

            {/* Side Effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Common Side Effects</h4>
                <ul className="space-y-1">
                  {medication.commonSideEffects.map((effect, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <Info className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Serious Side Effects</h4>
                <ul className="space-y-1">
                  {medication.seriousSideEffects.map((effect, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lifestyle Synergy */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Lifestyle Synergy</h4>
                  <ul className="space-y-1">
                    {medication.lifestyleSynergy.map((synergy, index) => (
                      <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        {synergy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Share className="h-4 w-4 mr-2" />
                Share with Patient
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Monograph
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Add to Protocol
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
