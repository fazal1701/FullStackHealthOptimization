'use client';

import { HealthStatus, SystemStatus } from '@/components/health-status';

export default function TestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Health Platform Test Page
            </h1>
            <p className="text-lg text-gray-600">
              Verifying chunk loading and component functionality
            </p>
          </div>

          {/* Health Status */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Health Overview</h2>
            <HealthStatus />
          </div>

          {/* System Status */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Platform Status</h2>
            <SystemStatus />
          </div>

          {/* Success Message */}
          <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-600 text-lg font-semibold mb-2">
              ✅ Chunk Loading Successful!
            </div>
            <p className="text-green-700">
              All components loaded successfully without chunk loading errors.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
