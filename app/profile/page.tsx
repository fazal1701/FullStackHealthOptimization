import { getJSON } from '@/lib/fetch';
import type { UserProfile } from '@/lib/types';

// --- Server fetches (mocked for now) ---
async function getProfileData(userId: string) {
  // Replace with real API calls
  const user: UserProfile = {
    id: 'patient-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'patient',
    plan: 'pro'
  };
  return { user };
}

export default async function ProfilePage() {
  // In real app, get userId from session/auth
  const { user } = await getProfileData('patient-1');

  // --- Profile Form ---
  // Allows updating name, units, notification prefs
  // Tag-based revalidation (TODO: implement server action)

  return (
    <main className="max-w-lg mx-auto py-8 px-4 space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" defaultValue={user.name} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Units</label>
          <select className="w-full border rounded px-3 py-2">
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lb, in)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notifications</label>
          <input type="checkbox" className="mr-2" /> Email me about important updates
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
      </form>
    </main>
  );
} 