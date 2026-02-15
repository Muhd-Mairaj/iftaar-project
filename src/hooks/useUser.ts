'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/actions';

type UserRole = Database['public']['Enums']['user_role'] | 'public';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUserAndRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        if (!user) {
          setRole('public');
          setLoading(false);
          return;
        }

        await fetchRole(user.id);
      } catch (error) {
        console.error('Error fetching user:', error);
        setRole('public');
      } finally {
        setLoading(false);
      }
    }

    async function fetchRole(userId: string) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        setRole('public');
      } else {
        setRole(profile.role);
      }
    }

    getUserAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRole(session.user.id);
        } else {
          setRole('public');
        }
        setLoading(false); // Ensure loading is false after auth change
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    setLoading(true);
    await logoutUser();
    await supabase.auth.signOut(); // Ensure client-side session is also cleared
    setUser(null);
    setRole('public');
    router.refresh();
    setLoading(false);
  };

  return { user, role, loading, logout };
}
