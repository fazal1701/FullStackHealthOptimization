import { getJSON } from '@/lib/fetch';
import dynamic from 'next/dynamic';
import { VendorFilter } from '@/components/filters/vendor-filter';
import type { BiometricSample, DeviceLink } from '@/lib/types';

// --- Server fetches (mocked for now) ---
async function getMetricsData(userId: string) {
  // Only use mock data for demo
  const biometrics: BiometricSample[] = [
    { id: 'b1', userId: 'patient-1', source: 'fitbit', metric: 'steps', value: 8500, unit: 'steps', takenAt: '2024-06-01' },
    { id: 'b2', userId: 'patient-1', source: 'oura', metric: 'sleep_score', value: 82, unit: 'score', takenAt: '2024-06-01' }
  ];
  const vendors: DeviceLink['vendor'][] = ['fitbit', 'oura', 'whoop', 'garmin', 'apple'];
  return { biometrics, vendors };
}

export default async function MetricsPage({ searchParams }: { searchParams: Record<string, string> }) {
  // Always use mock user for demo
  const { biometrics, vendors } = await getMetricsData('patient-1');

  return (
    <main className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <header className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Biometrics</h1>
        <div className="ml-auto">
          <VendorFilter vendors={vendors} />
        </div>
      </header>
      <section className="rounded-lg border p-4">
        <div className="font-semibold mb-1">Recent Samples</div>
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">Metric</th>
              <th className="p-2">Value</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Source</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {biometrics.map(b => (
              <tr key={b.id}>
                <td className="p-2">{b.metric}</td>
                <td className="p-2">{b.value}</td>
                <td className="p-2">{b.unit}</td>
                <td className="p-2">{b.source}</td>
                <td className="p-2">{b.takenAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <TrendSparkline data={...} /> */}
      </section>
      {/* <CSVUploadIsland /> */}
    </main>
  );
} 