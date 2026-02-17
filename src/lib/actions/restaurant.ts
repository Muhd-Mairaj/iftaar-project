'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

type CollectionStatus = Database['public']['Enums']['collection_status'];

export async function getCollectionRequests(
  from = 0,
  to = 9,
  status?: CollectionStatus
): Promise<
  (Database['public']['Tables']['collection_requests']['Row'] & {
    profiles: { email: string } | null;
  })[]
> {
  const supabase = await createClient();

  let query = supabase
    .from('collection_requests')
    .select(`
      *,
      profiles!collection_requests_created_by_fkey (
        email
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching collection requests:', error);
    return [];
  }

  return data;
}

export async function updateCollectionStatus(
  id: string,
  status: CollectionStatus
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('collection_requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating collection status:', error);
    return { error: error.message };
  }

  revalidatePath('/[locale]/restaurant/collections', 'page');
  revalidatePath('/[locale]/restaurant', 'page');
  return { success: true };
}
