import { createClient } from '@/lib/supabase/client';
import { Database, Enums, Tables } from '@/types/database.types';

export type Donation = Tables<'donations'>;
type DonationStatus = Enums<'donation_status'>;
export type DonationWithSignedUrl = Donation & {
  signed_proof_url: string | null;
};
export type CollectionRequest = Tables<'collection_requests'>;

/**
 * Fetch donations for a muazzin with infinite scroll support and batch-signed URLs
 */
export async function getDonations({
  page = 0,
  pageSize = 10,
  status = 'all',
}: {
  page?: number;
  pageSize?: number;
  status?: DonationStatus | 'all';
}) {
  const supabase = createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('donations')
    .select('*')
    .is('parent_donation_id', null)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: donations, error } = await query;
  if (error) throw error;
  if (!donations || donations.length === 0) return [];

  // Batch sign URLs
  const proofPaths = donations.map(d => d.proof_url).filter(Boolean);
  const { data: signedUrls, error: signError } =
    proofPaths.length > 0
      ? await supabase.storage
          .from('receipts')
          .createSignedUrls(proofPaths, 3600)
      : { data: [], error: null };

  if (signError) throw signError;

  const signedUrlMap = new Map(
    (signedUrls || []).map(entry => [entry.path, entry.signedUrl])
  );

  return donations.map(donation => ({
    ...donation,
    signed_proof_url: signedUrlMap.get(donation.proof_url) || null,
  })) as DonationWithSignedUrl[];
}

/**
 * Review a donation (approve/reject)
 */
export async function reviewDonation(
  id: string,
  status: 'approved' | 'rejected'
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // First fetch the donation to see if it's recurring
  const { data: donation, error: fetchError } = await supabase
    .from('donations')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await supabase
    .from('donations')
    .update({
      status,
      reviewed_by: user?.id,
    })
    .eq('id', id);

  if (error) throw error;

  if (status === 'approved' && donation.is_recurring) {
    const durationDays = donation.duration_days || 0;
    const dailyQuantity = donation.daily_quantity || 0;

    if (durationDays > 0 && dailyQuantity > 0) {
      const childRows: Database['public']['Tables']['donations']['Insert'][] =
        [];
      const today = new Date();

      for (let i = 0; i < durationDays; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const isoDate = targetDate.toISOString().split('T')[0];

        childRows.push({
          quantity: dailyQuantity,
          proof_url: donation.proof_url,
          status: 'approved',
          is_recurring: false,
          parent_donation_id: donation.id,
          available_date: isoDate,
          reviewed_by: user?.id,
        });
      }

      if (childRows.length > 0) {
        const { error: bulkError } = await supabase
          .from('donations')
          .insert(childRows);

        if (bulkError) {
          console.error('Failed to insert recurring donations', bulkError);
        }
      }
    } else {
      console.warn(
        'Invalid durationDays or dailyQuantity, skipping child row generation'
      );
    }
  }

  return { success: true };
}

/**
 * Fetch collection requests for a muazzin
 */
export async function getMuazzinCollectionRequests({
  userId,
  pageParam = 0,
  pageSize = 10,
  filter = 'all',
}: {
  userId: string;
  pageParam?: number;
  pageSize?: number;
  filter?: Enums<'collection_status'> | 'all';
}) {
  const supabase = createClient();
  const from = pageParam * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('collection_requests')
    .select('*')
    .eq('created_by', userId)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .range(from, to);

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Fetch summary stats for the muazzin dashboard
 */
export async function getMuazzinStats() {
  const supabase = createClient();

  // Fetch summary stats
  const [
    { count: pendingCount },
    { data: approvedDonations },
    { data: collectionRequests },
  ] = await Promise.all([
    supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('donations')
      .select('quantity')
      .eq('status', 'approved')
      .eq('is_recurring', false)
      .lte('available_date', new Date().toISOString().split('T')[0]),
    supabase.from('collection_requests').select('quantity'),
  ]);

  const totalApprovedPackets = (approvedDonations ?? []).reduce(
    (sum, d) => sum + (d.quantity || 0),
    0
  );
  const totalCollectedPackets = (collectionRequests ?? []).reduce(
    (sum, c) => sum + (c.quantity || 0),
    0
  );
  const packetsAvailable = Math.max(
    0,
    totalApprovedPackets - totalCollectedPackets
  );

  return {
    pendingCount: pendingCount || 0,
    totalCollectedPackets,
    packetsAvailable,
  };
}

/**
 * Creates a new collection request for a Muazzin
 */
export async function createCollectionRequest(data: any) {
  const supabase = createClient();

  // Get current user for created_by
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('collection_requests').insert({
    quantity: data.quantity,
    target_date: data.target_date,
    status: 'pending',
    created_by: user?.id,
  });

  if (error) throw new Error(error.message);

  return { success: true };
}
