'use client';
import dynamic from 'next/dynamic';
import type { RiskScore, FeatureAttribution } from '@/lib/types';

const AttributionBar = dynamic(() => import('@/components/charts/attribution-bar').then(m => m.AttributionBar), { ssr: false });
const SHAPWaterfall = dynamic(() => import('@/components/charts/waterfall').then(m => m.SHAPWaterfall), { ssr: false });

export function RiskChartsClient({ attributions, risk, view }: { attributions: FeatureAttribution[]; risk: RiskScore; view: string }) {
  if (view === 'patient') {
    return <AttributionBar attributions={attributions} />;
  }
  return <SHAPWaterfall attributions={attributions} baseline={0.10} score={risk.score} />;
} 