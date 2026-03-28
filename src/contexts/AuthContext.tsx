import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useSubdomain } from './SubdomainContext';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  isFleetOwner: boolean;
  isClient: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { subdomain } = useSubdomain();
  
  // Mock user data for UI refinement
  const mockUser = {
    id: 'mock-user-id-123',
    email: 'dev@linkedupcars.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  } as User;

  const mockProfile = {
    id: 'mock-user-id-123',
    email: 'dev@linkedupcars.com',
    full_name: 'Linkedup Dev',
    role: subdomain === 'admin' ? 'admin' : subdomain === 'fleet' ? 'fleet_owner' : 'client'
  };

  const [user, setUser] = useState<User | null>(mockUser);
  const [profile, setProfile] = useState<any | null>(mockProfile);
  const [loading, setLoading] = useState(false);

  // Update profile role when subdomain changes
  useEffect(() => {
    setProfile({
      ...mockProfile,
      role: subdomain === 'admin' ? 'admin' : subdomain === 'fleet' ? 'fleet_owner' : 'client'
    });
  }, [subdomain]);

  const signOut = async () => {
    console.log('Mock sign out');
  };

  const isAdmin = profile?.role === 'admin';
  const isFleetOwner = profile?.role === 'fleet_owner';
  const isClient = profile?.role === 'client';

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAdmin, 
      isFleetOwner, 
      isClient,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
