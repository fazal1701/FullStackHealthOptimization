import { getJSON } from '@/lib/fetch';
import { EducationPanel } from '@/components/education-panel';
import { VendorChip } from '@/components/vendor-chip';
import type { UserProfile, DeviceLink, Vital, LabResult, RiskScore } from '@/lib/types';

// --- Server fetches (mocked for now) ---
async function getDashboardData(userId: string) {
  // Only use mock data for demo
  const user: UserProfile = {
    id: 'patient-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'patient',
    plan: 'pro'
  };
  const devices: DeviceLink[] = [
    { userId: 'patient-1', vendor: 'fitbit', status: 'linked', lastSync: '2024-06-01', quality: 0.98 },
    { userId: 'patient-1', vendor: 'oura', status: 'linked', lastSync: '2024-06-01', quality: 0.95 }
  ];
  const vitals: Vital[] = [
    { id: 'v1', userId: 'patient-1', kind: 'sbp', value: 118, unit: 'mmHg', takenAt: '2024-06-01' },
    { id: 'v2', userId: 'patient-1', kind: 'dbp', value: 76, unit: 'mmHg', takenAt: '2024-06-01' }
  ];
  const labs: LabResult[] = [
    { id: 'l1', userId: 'patient-1', kind: 'apob', value: 72, unit: 'mg/dL', collectedAt: '2024-05-28' }
  ];
  const risk: RiskScore = {
    id: 'r1', userId: 'patient-1', model: 'cvd10y', score: 0.08, band: 'low', ci95: [0.06, 0.11], computedAt: '2024-06-01'
  };
  return { user, devices, vitals, labs, risk };
}

export default async function DashboardPage() {
  // Always use mock user for demo
  const { user, devices, vitals, labs, risk } = await getDashboardData('patient-1');

  // --- Patient Hero ---
  // Uses Next.js Image for SVG, explicit size to prevent CLS
  // --- Device Chips ---
  // Shows device link status and quality
  // --- Tiles ---
  // Latest vitals, last labs, risk sparkline
  // --- Education Strip ---
  // Inline evidence with links

  return (
    <main className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <header className="flex items-center gap-6">
        <img src="/images/patient-hero.svg" alt="Patient Hero" width={96} height={96} />
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <div className="flex gap-2 mt-2">
            {devices.map(d => (
              <VendorChip key={d.vendor} vendor={d.vendor} status={d.status} quality={d.quality} />
            ))}
          </div>
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="font-semibold mb-1">Latest Vitals</div>
          <ul className="text-sm space-y-1">
            {vitals.map(v => (
              <li key={v.id}>{v.kind.toUpperCase()}: {v.value} {v.unit}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <div className="font-semibold mb-1">Last Lab</div>
          <ul className="text-sm space-y-1">
            {labs.map(l => (
              <li key={l.id}>{l.kind.toUpperCase()}: {l.value} {l.unit}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <div className="font-semibold mb-1">Risk (10y CVD)</div>
          <div className="text-2xl font-bold text-green-700">{(risk.score * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500">95% CI: {(risk.ci95[0] * 100).toFixed(1)}–{(risk.ci95[1] * 100).toFixed(1)}%</div>
          {/* <RiskSparkline data={...} /> */}
        </div>
      </section>
      <EducationPanel
        mode="patient"
        evidence={[
          { summary: 'ApoB tracks atherogenic particle burden more directly than LDL-C.', citation: 'Ference 2017 (Lancet)', url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(17)32290-4/fulltext' },
          { summary: 'Higher VO₂max associates with lower all-cause mortality.', citation: 'JAMA evidence', url: 'https://jamanetwork.com/journals/jama/fullarticle/2708496' },
          { summary: 'Better sleep (7–9h) relates to cardiometabolic risk reduction.', citation: 'Cappuccio et al.', url: 'https://www.sleepfoundation.org/how-sleep-works/sleep-and-health' }
        ]}
      />
    </main>
  );
} 