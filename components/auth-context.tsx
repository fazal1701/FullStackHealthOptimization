'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_DATA } from '@/lib/mock-data';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check for stored auth on mount
    const storedUser = localStorage.getItem('longevitylab-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('longevitylab-user');
      }
    }
    setIsLoading(false);
  }, [mounted]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Mock authentication - in real app, this would call your auth API
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUsers = [
      { ...MOCK_DATA.patient, role: 'patient' as const, password: 'patient123' },
      { ...MOCK_DATA.doctor, role: 'doctor' as const, password: 'doctor123' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && (u as any).password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser as any;
      setUser(userWithoutPassword as AuthUser);
      localStorage.setItem('longevitylab-user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('longevitylab-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}