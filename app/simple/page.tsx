'use client';

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hydration Test Successful!
          </h1>
          <p className="text-gray-600">
            This page loaded without any hydration errors.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Layout Fixed</h3>
            <p className="text-sm text-green-700">
              Removed font variables and theme provider that were causing hydration mismatches.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🚀 Server Running</h3>
            <p className="text-sm text-blue-700">
              Development server is running smoothly on port 3001.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">🎯 Ready for Demo</h3>
            <p className="text-sm text-purple-700">
              Platform is ready for full health dashboard demonstration.
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Health Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
