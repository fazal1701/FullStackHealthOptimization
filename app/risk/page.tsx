import { getJSON } from '@/lib/fetch';
import dynamic from 'next/dynamic';
import { EducationPanel } from '@/components/education-panel';
import { useQueryState } from 'nuqs/parsers';
import type { RiskScore, FeatureAttribution } from '@/lib/types';

const AttributionBar = dynamic(() => import('@/components/charts/attribution-bar').then(m => m.AttributionBar), { ssr: false });
const SHAPWaterfall = dynamic(() => import('@/components/charts/waterfall').then(m => m.SHAPWaterfall), { ssr: false });

// --- Server fetches (mocked for now) ---
async function getRiskData(userId: string) {
  // Replace with real API calls
  const risk: RiskScore = {
    id: 'r1', userId: 'patient-1', model: 'cvd10y', score: 0.08, band: 'low', ci95: [0.06, 0.11], computedAt: '2024-06-01'
  };
  const attributions: FeatureAttribution[] = [
    { riskId: 'r1', feature: 'ApoB', contribution: -0.02, direction: 'neg' },
    { riskId: 'r1', feature: 'VO2max', contribution: -0.01, direction: 'neg' },
    { riskId: 'r1', feature: 'Sleep', contribution: 0.01, direction: 'pos' }
  ];
  return { risk, attributions };
}

export default async function RiskPage({ searchParams }: { searchParams: { view?: string } }) {
  // In real app, get userId from session/auth
  const { risk, attributions } = await getRiskData('patient-1');
  const view = searchParams.view === 'clinician' ? 'clinician' : 'patient';

  // --- Patient View ---
  // Plain-language bullets, AttributionBar
  // --- Clinician View ---
  // SHAPWaterfall, raw table, guideline links
  // --- Evidence Panel ---

  return (
    <main className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <header className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Risk Analysis</h1>
        <div className="ml-auto flex gap-2">
          <a href="?view=patient" className={`px-3 py-1 rounded ${view === 'patient' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>Patient</a>
          <a href="?view=clinician" className={`px-3 py-1 rounded ${view === 'clinician' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>Clinician</a>
        </div>
      </header>
      <section className="rounded-lg border p-4">
        <div className="font-semibold mb-1">10y CVD Risk</div>
        <div className="text-2xl font-bold text-green-700">{(risk.score * 100).toFixed(1)}%</div>
        <div className="text-xs text-gray-500">95% CI: {(risk.ci95[0] * 100).toFixed(1)}–{(risk.ci95[1] * 100).toFixed(1)}%</div>
        <div className="mt-4">
          {view === 'patient' ? (
            <>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>Your ApoB is in the optimal range.</li>
                <li>VO₂max is above average for your age.</li>
                <li>Sleep quality is good.</li>
              </ul>
              <AttributionBar attributions={attributions} />
            </>
          ) : (
            <>
              <SHAPWaterfall attributions={attributions} baseline={0.10} score={risk.score} />
              <table className="mt-4 w-full text-xs border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2">Feature</th>
                    <th className="p-2">Contribution</th>
                    <th className="p-2">Direction</th>
                  </tr>
                </thead>
                <tbody>
                  {attributions.map(a => (
                    <tr key={a.feature}>
                      <td className="p-2">{a.feature}</td>
                      <td className="p-2">{a.contribution.toFixed(3)}</td>
                      <td className="p-2">{a.direction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-xs text-blue-700 underline">
                <a href="https://www.ahajournals.org/doi/10.1161/CIR.0000000000000678" target="_blank" rel="noopener noreferrer">ACC/AHA 2019 Primary Prevention Guideline</a>
              </div>
            </>
          )}
        </div>
      </section>
      <EducationPanel
        mode={view}
        evidence={[
          { summary: 'ApoB tracks atherogenic particle burden more directly than LDL-C.', citation: 'Ference 2017 (Lancet)', url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(17)32290-4/fulltext', details: 'NNT=20, 95% CI 0.7–1.2' },
          { summary: 'Lp(a) is genetically determined; once-in-lifetime testing is recommended.', citation: 'ESC/EAS 2022', url: 'https://academic.oup.com/eurheartj/article/43/39/3925/6727710', details: 'Screening yield: 1 in 5' }
        ]}
      />
    </main>
  );
} 