'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Pin,
  ExternalLink,
  Heart,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3
} from 'lucide-react';

interface Study {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  studyType: 'RCT' | 'Cohort' | 'Meta-analysis' | 'Systematic Review';
  population: string;
  sampleSize: number;
  followUp: string;
  primaryOutcome: string;
  effectSize: number;
  confidenceInterval: [number, number];
  pValue: number;
  arr: number; // Absolute Risk Reduction
  rrr: number; // Relative Risk Reduction
  nnt: number; // Number Needed to Treat
  nnh?: number; // Number Needed to Harm
  limitations: string[];
  clinicalImplication: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'medications' | 'mental-health' | 'risk-factors';
  tags: string[];
  qualityScore: number; // 1-10
  isPinned: boolean;
  relevantBiomarkers: string[];
}

const STUDY_CATEGORIES = [
  { id: 'all', label: 'All Studies', icon: <BookOpen className="h-4 w-4" />, count: 247 },
  { id: 'exercise', label: 'Exercise', icon: <Activity className="h-4 w-4" />, count: 45 },
  { id: 'nutrition', label: 'Nutrition', icon: <Apple className="h-4 w-4" />, count: 67 },
  { id: 'sleep', label: 'Sleep', icon: <Moon className="h-4 w-4" />, count: 23 },
  { id: 'medications', label: 'Medications', icon: <Pill className="h-4 w-4" />, count: 89 },
  { id: 'mental-health', label: 'Mental Health', icon: <Brain className="h-4 w-4" />, count: 15 },
  { id: 'risk-factors', label: 'Risk Factors', icon: <Heart className="h-4 w-4" />, count: 8 }
];

const FEATURED_STUDIES: Study[] = [
  {
    id: 'reduce-it-2019',
    title: 'Cardiovascular Risk Reduction with Icosapent Ethyl for Hypertriglyceridemia',
    authors: 'Bhatt DL, Steg PG, Miller M, et al.',
    journal: 'New England Journal of Medicine',
    year: 2019,
    studyType: 'RCT',
    population: 'Patients with elevated triglycerides on statin therapy',
    sampleSize: 8179,
    followUp: '4.9 years median',
    primaryOutcome: 'Composite of cardiovascular death, nonfatal MI, nonfatal stroke, coronary revascularization, or unstable angina',
    effectSize: 0.75, // Hazard Ratio
    confidenceInterval: [0.68, 0.83],
    pValue: 0.000001,
    arr: 4.8, // 4.8% absolute risk reduction
    rrr: 25, // 25% relative risk reduction
    nnt: 21, // Number needed to treat for 5 years
    limitations: [
      'Single EPA formulation studied',
      'Predominantly male population (71%)',
      'High baseline triglycerides required'
    ],
    clinicalImplication: 'EPA 4g daily reduces cardiovascular events in high-risk patients with elevated triglycerides despite statin therapy',
    category: 'medications',
    tags: ['EPA', 'Omega-3', 'Cardiovascular', 'Primary Prevention'],
    qualityScore: 9,
    isPinned: false,
    relevantBiomarkers: ['Triglycerides', 'ApoB', 'hs-CRP']
  },
  {
    id: 'zone2-longevity-2023',
    title: 'Zone 2 Exercise Training and Mitochondrial Function in Healthy Adults',
    authors: 'San-Millán I, Brooks GA, et al.',
    journal: 'Cell Metabolism',
    year: 2023,
    studyType: 'RCT',
    population: 'Healthy adults aged 40-65',
    sampleSize: 156,
    followUp: '12 weeks',
    primaryOutcome: 'Mitochondrial respiratory capacity and fat oxidation',
    effectSize: 1.8, // Cohen's d
    confidenceInterval: [1.2, 2.4],
    pValue: 0.001,
    arr: 35, // 35% improvement in fat oxidation
    rrr: 45, // 45% relative improvement
    nnt: 3, // 3 people need to train for meaningful improvement
    limitations: [
      'Short-term follow-up',
      'Healthy population only',
      'Single training modality'
    ],
    clinicalImplication: 'Zone 2 training 3x/week significantly improves mitochondrial function and metabolic flexibility',
    category: 'exercise',
    tags: ['Zone 2', 'Mitochondria', 'Fat Oxidation', 'VO2max'],
    qualityScore: 8,
    isPinned: true,
    relevantBiomarkers: ['VO2max', 'Lactate Threshold', 'RER']
  },
  {
    id: 'time-restricted-eating-2024',
    title: 'Time-Restricted Eating and Metabolic Health: A Systematic Review',
    authors: 'Wilkinson MJ, Manoogian EN, et al.',
    journal: 'Annual Review of Nutrition',
    year: 2024,
    studyType: 'Meta-analysis',
    population: 'Adults with metabolic dysfunction',
    sampleSize: 2847, // Combined from 23 studies
    followUp: '8-52 weeks',
    primaryOutcome: 'HbA1c, insulin sensitivity, weight loss',
    effectSize: -0.4, // HbA1c reduction
    confidenceInterval: [-0.6, -0.2],
    pValue: 0.0001,
    arr: 0.3, // 0.3% HbA1c reduction
    rrr: 5.2, // 5.2% relative reduction
    nnt: 4, // 4 people need TRE for meaningful HbA1c improvement
    limitations: [
      'Heterogeneous protocols (12-16h fasting)',
      'Variable adherence reporting',
      'Limited long-term data'
    ],
    clinicalImplication: 'Time-restricted eating (14-16h) improves glycemic control and insulin sensitivity in metabolically unhealthy adults',
    category: 'nutrition',
    tags: ['Intermittent Fasting', 'TRE', 'HbA1c', 'Insulin Sensitivity'],
    qualityScore: 7,
    isPinned: false,
    relevantBiomarkers: ['HbA1c', 'Fasting Glucose', 'HOMA-IR']
  }
];

export function StudiesUpdates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);
  const [pinnedStudies, setPinnedStudies] = useState<string[]>(['zone2-longevity-2023']);

  const filteredStudies = FEATURED_STUDIES.filter(study => {
    const matchesCategory = selectedCategory === 'all' || study.category === selectedCategory;
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const togglePin = (studyId: string) => {
    setPinnedStudies(prev => 
      prev.includes(studyId) 
        ? prev.filter(id => id !== studyId)
        : [...prev, studyId]
    );
  };

  const getStudyTypeColor = (type: string) => {
    switch (type) {
      case 'RCT': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Meta-analysis': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cohort': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Systematic Review': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'nutrition': return <Apple className="h-4 w-4 text-green-600" />;
      case 'sleep': return <Moon className="h-4 w-4 text-purple-600" />;
      case 'medications': return <Pill className="h-4 w-4 text-red-600" />;
      case 'mental-health': return <Brain className="h-4 w-4 text-indigo-600" />;
      case 'risk-factors': return <Heart className="h-4 w-4 text-pink-600" />;
      default: return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Studies & Updates</h1>
          <p className="text-gray-600 mt-1">Evidence-based research for clinical decision making</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            PubMed Search
          </Button>
        </div>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Evidence-Based Medicine Matters</h3>
              <p className="text-gray-700 text-sm mb-3">
                Stay current with the latest research to provide optimal patient care. Each study is analyzed for 
                clinical relevance, effect sizes, and practical implementation in longevity medicine.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Effect sizes with 95% confidence intervals</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>NNT/NNH for clinical decision making</span>
                </div>
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4 text-purple-500" />
                  <span>Pin studies to patient protocols</span>
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
            <Input
              placeholder="Search studies, authors, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {STUDY_CATEGORIES.map((category) => (
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

      {/* Pinned Studies */}
      {pinnedStudies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pin className="h-5 w-5 text-purple-600" />
              Pinned Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              {pinnedStudies.length} studies pinned for quick reference
            </div>
          </CardContent>
        </Card>
      )}

      {/* Studies List */}
      <div className="space-y-4">
        {filteredStudies.map((study) => (
          <StudyCard
            key={study.id}
            study={study}
            isExpanded={expandedStudy === study.id}
            onToggleExpand={() => setExpandedStudy(expandedStudy === study.id ? null : study.id)}
            isPinned={pinnedStudies.includes(study.id)}
            onTogglePin={() => togglePin(study.id)}
            getCategoryIcon={getCategoryIcon}
            getStudyTypeColor={getStudyTypeColor}
          />
        ))}
      </div>
    </div>
  );
}

interface StudyCardProps {
  study: Study;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  getCategoryIcon: (category: string) => React.ReactNode;
  getStudyTypeColor: (type: string) => string;
}

function StudyCard({
  study,
  isExpanded,
  onToggleExpand,
  isPinned,
  onTogglePin,
  getCategoryIcon,
  getStudyTypeColor
}: StudyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(study.category)}
              <Badge className={`${getStudyTypeColor(study.studyType)} border text-xs`}>
                {study.studyType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Quality: {study.qualityScore}/10
              </Badge>
              <span className="text-sm text-gray-500">{study.year}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 leading-tight">
              {study.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {study.authors} • {study.journal}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>n={study.sampleSize.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{study.followUp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePin}
              className={isPinned ? 'text-purple-600' : 'text-gray-400'}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onToggleExpand}>
              {isExpanded ? 'Collapse' : 'View Study'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Key Results */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <div className="text-sm font-medium text-emerald-900">Effect Size</div>
                <div className="text-lg font-bold text-emerald-700">
                  {study.effectSize > 0 ? '+' : ''}{study.effectSize}
                </div>
                <div className="text-xs text-emerald-600">
                  95% CI: [{study.confidenceInterval[0]}, {study.confidenceInterval[1]}]
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900">ARR vs RRR</div>
                <div className="text-lg font-bold text-blue-700">
                  {study.arr}% / {study.rrr}%
                </div>
                <div className="text-xs text-blue-600">
                  Absolute / Relative
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900">NNT</div>
                <div className="text-lg font-bold text-purple-700">
                  {study.nnt}
                </div>
                <div className="text-xs text-purple-600">
                  Number Needed to Treat
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="text-sm font-medium text-orange-900">P-value</div>
                <div className="text-lg font-bold text-orange-700">
                  {study.pValue < 0.001 ? '<0.001' : study.pValue.toFixed(3)}
                </div>
                <div className="text-xs text-orange-600">
                  Statistical significance
                </div>
              </div>
            </div>

            {/* Study Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Study Population</h4>
                <p className="text-sm text-gray-700 mb-3">{study.population}</p>

                <h4 className="font-semibold text-gray-900 mb-2">Primary Outcome</h4>
                <p className="text-sm text-gray-700">{study.primaryOutcome}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Relevant Biomarkers</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {study.relevantBiomarkers.map((biomarker, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {biomarker}
                    </Badge>
                  ))}
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {study.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinical Implication */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Clinical Implication</h4>
                  <p className="text-sm text-green-800">{study.clinicalImplication}</p>
                </div>
              </div>
            </div>

            {/* Limitations */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Study Limitations</h4>
                  <ul className="space-y-1">
                    {study.limitations.map((limitation, index) => (
                      <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                        <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Pin className="h-4 w-4 mr-2" />
                Pin to Patient Plan
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Paper
              </Button>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Add to Reading List
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
