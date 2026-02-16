'use client';

import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type UserRole = Database['public']['Enums']['user_role'] | 'public';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isSessionReady: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let authListener: { subscription: { unsubscribe: () => void } } | null =
      null;

    async function fetchRole(userId: string) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!mounted) return;

      if (error || !profile) {
        setRole('public');
      } else {
        setRole(profile.role);
      }
      setLoading(false);
    }

    async function initialize() {
      try {
        // 1. If there are hash tokens (invite/reset link), set the session FIRST.
        //    This runs BEFORE getUser so there is zero lock contention.
        if (typeof window !== 'undefined' && window.location.hash) {
          const hash = window.location.hash.replace(/^#/, '');
          const params = new URLSearchParams(hash);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;

            // Clean URL so tokens aren't visible
            const cleanUrl =
              window.location.pathname + window.location.search;
            window.history.replaceState(null, '', cleanUrl);
          }
        }

        // 2. Now get the user (lock is free, no contention)
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(user);

        if (user) {
          setIsSessionReady(true);
          await fetchRole(user.id);
        } else {
          setRole('public');
        }
      } catch (error) {
        console.error('Auth init error:', error);
        if (mounted) setRole('public');
      } finally {
        if (mounted) setLoading(false);
      }

      // 3. Register listener AFTER init is complete (avoids concurrent lock acquisition)
      if (!mounted) return;

      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!mounted) return;

          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            setIsSessionReady(true);
            fetchRole(currentUser.id);
          } else {
            setRole('public');
            setIsSessionReady(false);
            setLoading(false);
          }
        }
      );
      authListener = data;
    }

    initialize();

    return () => {
      mounted = false;
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    setLoading(true);
    // Optimistic update
    setUser(null);
    setRole('public');
    setIsSessionReady(false);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }

    router.push('/');
    router.refresh();
    setLoading(false);
  };

  const refresh = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { error } = await supabase.auth.refreshSession();
      if (error) console.error('Session refresh error', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, isSessionReady, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
