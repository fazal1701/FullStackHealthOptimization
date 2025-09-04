'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Shield,
  Database,
  Link,
  Upload,
  Download,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Users,
  FileText,
  Smartphone,
  Watch,
  Activity,
  Heart,
  Moon,
  Zap,
  Calendar,
  Key,
  Lock,
  Globe
} from 'lucide-react';

interface DeviceConnection {
  id: string;
  name: string;
  vendor: string;
  type: 'wearable' | 'smartphone' | 'scale' | 'cgm';
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync: string;
  dataTypes: string[];
  icon: React.ReactNode;
  batteryLevel?: number;
  firmwareVersion?: string;
  permissions: string[];
}

interface DataExport {
  id: string;
  type: 'full' | 'biomarkers' | 'wearables' | 'habits';
  format: 'JSON' | 'CSV' | 'PDF';
  dateRange: string;
  status: 'pending' | 'processing' | 'ready' | 'expired';
  createdAt: string;
  expiresAt: string;
  fileSize?: string;
}

interface ConsentSetting {
  id: string;
  category: string;
  description: string;
  enabled: boolean;
  required: boolean;
  details: string[];
}

const CONNECTED_DEVICES: DeviceConnection[] = [
  {
    id: 'apple-health-001',
    name: 'iPhone 15 Pro',
    vendor: 'Apple Health',
    type: 'smartphone',
    status: 'connected',
    lastSync: '2 minutes ago',
    dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Workouts'],
    icon: <Smartphone className="h-5 w-5 text-gray-600" />,
    batteryLevel: 87,
    firmwareVersion: 'iOS 17.2',
    permissions: ['Read Health Data', 'Write Workouts']
  },
  {
    id: 'oura-ring-001',
    name: 'Oura Ring Gen 3',
    vendor: 'Oura',
    type: 'wearable',
    status: 'connected',
    lastSync: '15 minutes ago',
    dataTypes: ['Sleep Quality', 'HRV', 'Body Temperature', 'Activity'],
    icon: <Watch className="h-5 w-5 text-purple-600" />,
    batteryLevel: 45,
    firmwareVersion: '2.1.4',
    permissions: ['Read Sleep Data', 'Read Activity Data', 'Read Biometric Data']
  },
  {
    id: 'dexcom-g7-001',
    name: 'Dexcom G7',
    vendor: 'Dexcom',
    type: 'cgm',
    status: 'syncing',
    lastSync: '1 hour ago',
    dataTypes: ['Continuous Glucose', 'Time in Range', 'Glucose Trends'],
    icon: <Zap className="h-5 w-5 text-yellow-600" />,
    batteryLevel: 78,
    firmwareVersion: '1.2.1',
    permissions: ['Read Glucose Data', 'Read Trend Data']
  }
];

const RECENT_EXPORTS: DataExport[] = [
  {
    id: 'export-001',
    type: 'full',
    format: 'JSON',
    dateRange: 'Last 12 months',
    status: 'ready',
    createdAt: '2024-01-15 14:30',
    expiresAt: '2024-01-22 14:30',
    fileSize: '2.4 MB'
  },
  {
    id: 'export-002',
    type: 'biomarkers',
    format: 'CSV',
    dateRange: 'Last 6 months',
    status: 'ready',
    createdAt: '2024-01-10 09:15',
    expiresAt: '2024-01-17 09:15',
    fileSize: '156 KB'
  }
];

const CONSENT_SETTINGS: ConsentSetting[] = [
  {
    id: 'data-processing',
    category: 'Data Processing',
    description: 'Allow processing of health data for personalized insights',
    enabled: true,
    required: true,
    details: [
      'Analyze biomarker trends and patterns',
      'Generate personalized health recommendations',
      'Calculate risk scores and percentiles'
    ]
  },
  {
    id: 'research-participation',
    category: 'Research Participation',
    description: 'Contribute anonymized data to longevity research',
    enabled: false,
    required: false,
    details: [
      'Data is fully anonymized before sharing',
      'Helps advance longevity medicine research',
      'Can be revoked at any time'
    ]
  },
  {
    id: 'clinician-sharing',
    category: 'Clinician Data Sharing',
    description: 'Share health data with your healthcare provider',
    enabled: true,
    required: false,
    details: [
      'Real-time access to biomarker trends',
      'Wearable device data and insights',
      'Medication adherence tracking'
    ]
  },
  {
    id: 'marketing-communications',
    category: 'Marketing Communications',
    description: 'Receive health tips and product updates',
    enabled: false,
    required: false,
    details: [
      'Weekly health optimization tips',
      'New feature announcements',
      'Educational content and research updates'
    ]
  }
];

export function AdvancedAccountData() {
  const [activeTab, setActiveTab] = useState<'devices' | 'data' | 'privacy' | 'account'>('devices');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExportStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const toggleConsent = (settingId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggling consent for ${settingId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account & Data Management</h1>
          <p className="text-gray-600 mt-1">Manage your devices, data, and privacy settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
        </div>
      </div>

      {/* Why It Matters */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Data, Your Control</h3>
              <p className="text-gray-700 text-sm mb-3">
                Maintain complete control over your health data with granular privacy settings, secure device connections, 
                and transparent data usage policies. Export or delete your data at any time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>End-to-end encryption for all data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span>Granular consent management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-purple-500" />
                  <span>Export data in multiple formats</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'devices', label: 'Connected Devices', icon: <Link className="h-4 w-4" /> },
          { id: 'data', label: 'Data Management', icon: <Database className="h-4 w-4" /> },
          { id: 'privacy', label: 'Privacy & Consent', icon: <Shield className="h-4 w-4" /> },
          { id: 'account', label: 'Account Settings', icon: <Settings className="h-4 w-4" /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'devices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Connected Devices</h2>
            <Button>
              <Link className="h-4 w-4 mr-2" />
              Connect New Device
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONNECTED_DEVICES.map((device) => (
              <Card key={device.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {device.icon}
                      <div>
                        <h3 className="font-semibold text-gray-900">{device.name}</h3>
                        <p className="text-sm text-gray-600">{device.vendor}</p>
                      </div>
                    </div>
                    <Badge className={`${getDeviceStatusColor(device.status)} border text-xs`}>
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Last sync: {device.lastSync}
                    </div>
                    
                    {device.batteryLevel && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Battery</span>
                          <span className="font-medium">{device.batteryLevel}%</span>
                        </div>
                        <Progress value={device.batteryLevel} className="h-2" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Data Types</h4>
                      <div className="flex flex-wrap gap-1">
                        {device.dataTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Activity className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>

          {/* CSV Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                CSV Data Import
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload CSV files with lab results, biomarker data, or health metrics
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      Choose CSV File
                    </Button>
                  </label>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Uploading and validating...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Supported formats:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Lab results (date, biomarker, value, unit, reference range)</li>
                        <li>• Wearable data (timestamp, metric, value)</li>
                        <li>• Medication logs (date, medication, dose, adherence)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Exports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
                Data Exports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Biomarkers
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Export Wearables
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Export Habits
                  </Button>
                  <Button variant="outline" size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recent Exports</h4>
                  {RECENT_EXPORTS.map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {exportItem.type.charAt(0).toUpperCase() + exportItem.type.slice(1)} Export
                          </div>
                          <div className="text-sm text-gray-600">
                            {exportItem.dateRange} • {exportItem.format} • {exportItem.fileSize}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getExportStatusColor(exportItem.status)} border text-xs`}>
                          {exportItem.status}
                        </Badge>
                        {exportItem.status === 'ready' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Privacy & Consent Management</h2>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
          </div>

          <div className="space-y-4">
            {CONSENT_SETTINGS.map((setting) => (
              <Card key={setting.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{setting.category}</h3>
                        {setting.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                      <ul className="space-y-1">
                        {setting.details.map((detail, index) => (
                          <li key={index} className="text-xs text-gray-500 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => toggleConsent(setting.id)}
                        disabled={setting.required}
                      />
                      <span className="text-sm text-gray-600">
                        {setting.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Data Deletion</h3>
                  <p className="text-sm text-red-800 mb-3">
                    Permanently delete all your health data from our systems. This action cannot be undone.
                  </p>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Request Data Deletion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="text-sm text-gray-900">sarah.johnson@email.com</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <div className="text-sm text-gray-900">Sarah Johnson</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="text-sm text-gray-900">March 15, 1985</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-green-600" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add extra security to your account</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Login Notifications</div>
                      <div className="text-sm text-gray-600">Get notified of new logins</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
