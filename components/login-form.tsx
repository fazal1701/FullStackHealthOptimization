'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth-context';
import { Loader2, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    } else {
      if (email === 'dr.chen@healthcenter.com') router.push('/doctor-demo');
      else router.push('/patient-demo');
    }
  };

  const launchDemo = async (role: 'patient' | 'doctor') => {
    setError('');
    const creds = role === 'patient'
      ? { e: 'sarah.johnson@email.com', p: 'patient123', path: '/patient-demo' }
      : { e: 'dr.chen@healthcenter.com', p: 'doctor123', path: '/doctor-demo' };

    setEmail(creds.e);
    setPassword(creds.p);

    const ok = await login(creds.e, creds.p);
    if (ok) router.push(creds.path);
    else setError('Demo login failed');
  };

  const fillDemoCredentials = (role: 'patient' | 'doctor') => {
    if (role === 'patient') {
      setEmail('sarah.johnson@email.com');
      setPassword('patient123');
    } else {
      setEmail('dr.chen@healthcenter.com');
      setPassword('doctor123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <CardTitle className="text-2xl">LongevityLab</CardTitle>
          <p className="text-gray-600">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">Try the Demo:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => launchDemo('patient')}
                disabled={isLoading}
              >
                Patient Demo
              </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
                onClick={() => launchDemo('doctor')}
                disabled={isLoading}
            >
                Doctor Demo
            </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Or prefill then Sign In:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" size="xs" onClick={() => fillDemoCredentials('patient')}>Prefill Patient</Button>
              <Button variant="ghost" size="xs" onClick={() => fillDemoCredentials('doctor')}>Prefill Doctor</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}