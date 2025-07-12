'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, fullName: string, phone?: string, address?: string, city?: string, postalCode?: string) => Promise<any>;
  logout: () => Promise<void>;
  // checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const authHook = useAuth();
  const { initializeUserData } = useStore();

  // Initialize user data when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        initializeUserData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={authHook}>
      {children}
    </AuthContext.Provider>
  );
}