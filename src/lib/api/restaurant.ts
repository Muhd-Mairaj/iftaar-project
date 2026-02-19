import { createClient } from '@/lib/supabase/client';
import { Database, Enums } from '@/types/database.types';

export type CollectionRequestWithProfile =
  Database['public']['Tables']['collection_requests']['Row'] & {
    profiles: { email: string } | null;
  };

export type CollectionStatus = Enums<'collection_status'> | 'all';

/**
 * Fetch collection requests for restaurant with profiles
 */
export async function getRestaurantCollections({
  pageParam = 0,
  pageSize = 10,
  filter = 'all',
}: {
  pageParam?: number;
  pageSize?: number;
  filter?: CollectionStatus;
}) {
  const supabase = createClient();
  const from = pageParam * pageSize;
  const to = from + pageSize - 1;

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

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data as CollectionRequestWithProfile[];
}

/**
 * Update the status of a collection request
 */
export async function updateCollectionRequestStatus(
  id: string,
  status: Enums<'collection_status'>
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('collection_requests')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

/**
 * Fetch summary stats for the restaurant dashboard
 */
export async function getRestaurantStats() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('collection_requests')
    .select('status');

  if (error) throw error;

  const pendingCount = data?.filter(r => r.status === 'pending').length || 0;
  const approvedCount = data?.filter(r => r.status === 'approved').length || 0;
  const fulfilledCount =
    data?.filter(r => r.status === 'collected').length || 0;

  return {
    pendingCount,
    approvedCount,
    fulfilledCount,
  };
}
