import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database.types';

export type Profile = Tables<'profiles'>;

/**
 * Fetch all user profiles for admin
 */
export async function getUsers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
