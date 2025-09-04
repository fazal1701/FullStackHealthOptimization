'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Brain, CheckCircle } from 'lucide-react';

/**
 * Simple health status component to verify chunk loading is working
 */
export const HealthStatus: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Heart className="h-5 w-5" />
            Cardiovascular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-700">Low Risk</div>
              <div className="text-sm text-green-600">15th percentile</div>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Excellent
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Activity className="h-5 w-5" />
            Metabolic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-700">Moderate</div>
              <div className="text-sm text-yellow-600">45th percentile</div>
            </div>
            <Badge variant="outline" className="text-yellow-700 border-yellow-300">
              Good
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Brain className="h-5 w-5" />
            Neurocognitive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-700">Low Risk</div>
              <div className="text-sm text-blue-600">25th percentile</div>
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Excellent
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * System status component to show platform health
 */
export const SystemStatus: React.FC = () => {
  const services = [
    { name: 'Frontend', status: 'online', url: 'http://localhost:3001' },
    { name: 'Backend API', status: 'online', url: 'http://localhost:8000' },
    { name: 'ML Pipeline', status: 'ready', url: 'http://localhost:8000/docs' },
    { name: 'Device Sync', status: 'ready', url: 'N/A' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  service.status === 'online' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <span className="font-medium">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={service.status === 'online' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
                {service.url !== 'N/A' && (
                  <a 
                    href={service.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
