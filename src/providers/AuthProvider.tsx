'use client';

import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
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
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function getUserAndRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(user);

        if (!user) {
          setRole('public');
          setLoading(false);
          return;
        }

        await fetchRole(user.id);
      } catch (error) {
        console.error('Error fetching user:', error);
        if (mounted) setRole('public');
      } finally {
        if (mounted) setLoading(false);
      }
    }

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
    }

    getUserAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchRole(currentUser.id);
        } else {
          setRole('public');
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase, pathname]);

  const logout = async () => {
    setLoading(true);
    // Optimistic update
    setUser(null);
    setRole('public');

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
    // Manual refresh function if needed
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      // Re-fetch role logic... or rely on listener if session refreshed
      // Usually refreshing session triggers listener
      const { error } = await supabase.auth.refreshSession();
      if (error) console.error('Session refresh error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
