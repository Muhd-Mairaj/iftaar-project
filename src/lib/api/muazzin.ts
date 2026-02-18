import { createClient } from '@/lib/supabase/client';
import { Enums, Tables } from '@/types/database.types';

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
    .order('updated_at', { ascending: false })
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

  const { error } = await supabase
    .from('donations')
    .update({
      status,
      reviewed_by: user?.id,
    })
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

/**
 * Fetch collection requests for a muazzin
 */
export async function getMuazzinCollections({
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
    .range(from, to);

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
