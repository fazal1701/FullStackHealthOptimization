'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Activity,
  Heart,
  Brain,
  Zap,
  Moon,
  Database,
  Settings,
  FileText,
  Link,
  BarChart3,
  Target,
  Dumbbell,
  Apple
} from 'lucide-react';

export type NavigationSection =
  | 'home'
  | 'programs'
  | 'zone2-vo2max'
  | 'metabolic-health'
  | 'sleep-optimization'
  | 'strength-mobility'
  | 'biomarkers'
  | 'apob'
  | 'hba1c'
  | 'devices'
  | 'account'
  | 'studies'
  | 'medications'
  | 'ml-analysis';

interface NavigationProps {
  currentSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
}

const NAVIGATION_ITEMS = [
  {
    id: 'home' as NavigationSection,
    label: 'Home',
    icon: <Home className="h-4 w-4" />,
    description: 'Dashboard overview'
  },
  {
    id: 'programs' as NavigationSection,
    label: 'Programs',
    icon: <Target className="h-4 w-4" />,
    description: 'Health optimization programs',
    children: [
      {
        id: 'zone2-vo2max' as NavigationSection,
        label: 'Zone 2 & VO₂max',
        icon: <Activity className="h-4 w-4" />,
        description: 'Cardio fitness optimization'
      },
      {
        id: 'metabolic-health' as NavigationSection,
        label: 'Metabolic Health',
        icon: <Zap className="h-4 w-4" />,
        description: 'ApoB & HbA1c optimization'
      },
      {
        id: 'sleep-optimization' as NavigationSection,
        label: 'Sleep Optimization',
        icon: <Moon className="h-4 w-4" />,
        description: 'Sleep quality & recovery'
      },
      {
        id: 'strength-mobility' as NavigationSection,
        label: 'Strength & Mobility',
        icon: <Dumbbell className="h-4 w-4" />,
        description: 'Muscle mass & movement'
      }
    ]
  },
  {
    id: 'biomarkers' as NavigationSection,
    label: 'Biomarker Library',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Lab results & explanations',
    children: [
      {
        id: 'apob' as NavigationSection,
        label: 'ApoB',
        icon: <Heart className="h-4 w-4" />,
        description: 'Cardiovascular risk marker'
      },
      {
        id: 'hba1c' as NavigationSection,
        label: 'HbA1c',
        icon: <Zap className="h-4 w-4" />,
        description: 'Glucose control marker'
      }
    ]
  },
  {
    id: 'devices' as NavigationSection,
    label: 'Devices & Data',
    icon: <Link className="h-4 w-4" />,
    description: 'Connected devices & imports'
  },
  {
    id: 'account' as NavigationSection,
    label: 'Account & Consent',
    icon: <Settings className="h-4 w-4" />,
    description: 'Privacy & data settings'
  },
  {
    id: 'studies' as NavigationSection,
    label: 'Studies & Updates',
    icon: <FileText className="h-4 w-4" />,
    description: 'Latest research & evidence'
  },
  {
    id: 'medications' as NavigationSection,
    label: 'Medications & Supplements',
    icon: <Database className="h-4 w-4" />,
    description: 'Pharmacotherapy guide'
  },
  {
    id: 'ml-analysis' as NavigationSection,
    label: 'AI Risk Analysis',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'ML explainability & predictions'
  }
];

export function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['programs', 'biomarkers']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActive = (itemId: NavigationSection) => currentSection === itemId;
  
  const isParentActive = (item: any) => {
    if (!item.children) return false;
    return item.children.some((child: any) => child.id === currentSection);
  };

  return (
    <Card className="h-fit">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <div key={item.id}>
              <Button
                variant={isActive(item.id) || isParentActive(item) ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  isActive(item.id) || isParentActive(item) 
                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.children) {
                    toggleSection(item.id);
                  } else {
                    onSectionChange(item.id);
                  }
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.children && (
                  <div className="text-xs text-gray-500">
                    {expandedSections.includes(item.id) ? '−' : '+'}
                  </div>
                )}
              </Button>
              
              {item.children && expandedSections.includes(item.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.id}
                      variant={isActive(child.id) ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start ${
                        isActive(child.id) 
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => onSectionChange(child.id)}
                    >
                      <div className="flex items-center gap-2">
                        {child.icon}
                        <span className="text-sm">{child.label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        <div className="mt-6 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Quick Tip</span>
          </div>
          <p className="text-xs text-emerald-700">
            Start with Zone 2 cardio and metabolic health programs for maximum longevity impact.
          </p>
        </div>
      </div>
    </Card>
  );
}
