import { getJSON } from '@/lib/fetch';
// import { ModelCard } from '@/components/model-card'; // TODO: implement

// --- Server fetches (mocked for now) ---
async function getAdminData() {
  // Replace with real API calls
  const jobs = [
    { id: 'j1', type: 'wearables', status: 'completed', started: '2024-06-01', finished: '2024-06-01' },
    { id: 'j2', type: 'labs', status: 'pending', started: '2024-06-02', finished: null }
  ];
  const model = {
    version: '1.0.2', auc: 0.81, calibrationSlope: 0.97, subgroup: { gapFNR: 0.02, gapFPR: 0.01 }
  };
  const sagemaker = { lastTraining: '2024-06-01', status: 'success', latencyMs: 120 };
  return { jobs, model, sagemaker };
}

export default async function AdminPage() {
  const { jobs, model, sagemaker } = await getAdminData();

  // --- Ingestion Jobs ---
  // --- Model Registry ---
  // --- SageMaker Status ---
  // --- Latency Stats ---

  return (
    <main className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </header>
      <section className="rounded-lg border p-4">
        <div className="font-semibold mb-1">Ingestion Jobs</div>
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Started</th>
              <th className="p-2">Finished</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td className="p-2">{j.type}</td>
                <td className="p-2">{j.status}</td>
                <td className="p-2">{j.started}</td>
                <td className="p-2">{j.finished ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="rounded-lg border p-4">
        <div className="font-semibold mb-1">Model Registry</div>
        <div>Version: <span className="font-mono">{model.version}</span></div>
        <div>AUC: <span className="font-mono">{model.auc}</span></div>
        <div>Calibration Slope: <span className="font-mono">{model.calibrationSlope}</span></div>
        <div>Subgroup Gaps: FNR {model.subgroup.gapFNR}, FPR {model.subgroup.gapFPR}</div>
        {/* <ModelCard model={model} /> */}
      </section>
      <section className="rounded-lg border p-4">
        <div className="font-semibold mb-1">SageMaker Training</div>
        <div>Last Training: {sagemaker.lastTraining}</div>
        <div>Status: {sagemaker.status}</div>
        <div>Latency: {sagemaker.latencyMs} ms</div>
      </section>
    </main>
  );
} 