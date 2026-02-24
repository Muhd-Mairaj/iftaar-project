'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Tables } from '@/types/database.types';

export type Profile = Tables<'profiles'>;
export type ProfileWithStatus = Profile & {
  isAccepted: boolean;
  lastSignIn?: string | null;
};

/**
 * Fetch all user profiles for admin.
 * Uses createAdminClient (service_role) to merge Auth metadata.
 */
export async function getUsers(): Promise<ProfileWithStatus[]> {
  const supabase = createAdminClient();

  // Fetch profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (profileError) {
    console.error('Fetch profiles error:', profileError);
    return [];
  }

  // Fetch auth users to check invitation status
  const { data: authData, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    console.error('Fetch auth users error:', authError);
    return (profiles || []).map(p => ({
      ...p,
      isAccepted: true,
    }));
  }

  // Merge data
  return (profiles || []).map(p => {
    const authUser = authData.users.find(u => u.id === p.id);
    return {
      ...p,
      isAccepted: !!(authUser?.email_confirmed_at || authUser?.last_sign_in_at),
      lastSignIn: authUser?.last_sign_in_at,
    };
  });
}
