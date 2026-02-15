'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type UserRole = Database['public']['Enums']['user_role'] | 'public';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setRole('public');
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          setRole('public');
        } else {
          setRole(profile.role);
        }
      } catch (err) {
        setRole('public');
      } finally {
        setLoading(false);
      }
    }

    getRole();
  }, [supabase]);

  return { role, loading };
}
