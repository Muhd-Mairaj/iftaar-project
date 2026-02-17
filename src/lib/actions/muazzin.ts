'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  type CollectionRequestInput,
  CollectionRequestSchema,
} from '@/lib/validations';
import type { Database } from '@/types/database.types';

type DonationStatus = Database['public']['Enums']['donation_status'];
type CollectionStatus = Database['public']['Enums']['collection_status'];

export type DonationWithSignedUrl =
  Database['public']['Tables']['donations']['Row'] & {
    signed_proof_url: string | null;
  };

export async function getMuazzinDonations(
  page: number,
  pageSize: number,
  status?: DonationStatus | 'all'
): Promise<DonationWithSignedUrl[]> {
  const supabase = await createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('donations')
    .select('*')
    .order('updated_at', { ascending: false })
    .range(from, to);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: donations } = await query;

  if (!donations || donations.length === 0) return [];

  // Batch sign URLs
  const proofPaths = donations.map(d => d.proof_url).filter(Boolean);
  const { data: signedUrls } =
    proofPaths.length > 0
      ? await supabase.storage
          .from('receipts')
          .createSignedUrls(proofPaths, 3600)
      : { data: [] };

  const signedUrlMap = new Map(
    (signedUrls || []).map(entry => [entry.path, entry.signedUrl])
  );

  return donations.map(donation => ({
    ...donation,
    signed_proof_url: signedUrlMap.get(donation.proof_url) || null,
  }));
}

export async function getMuazzinCollectionRequests(
  userId: string,
  page: number,
  pageSize: number,
  status?: CollectionStatus | 'all'
) {
  const supabase = await createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('collection_requests')
    .select('*')
    .eq('created_by', userId)
    .order('updated_at', { ascending: false })
    .range(from, to);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching muazzin collection requests:', error);
    return [];
  }

  return data || [];
}

export async function createCollectionRequest(data: CollectionRequestInput) {
  const validated = CollectionRequestSchema.parse(data);
  const supabase = await createClient();

  // Get current user for created_by
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('collection_requests').insert({
    quantity: validated.quantity,
    target_date: validated.target_date,
    status: 'pending',
    created_by: user?.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/muazzin', 'page');
  return { success: true };
}

export async function reviewDonation(
  id: string,
  status: 'approved' | 'rejected'
) {
  const supabase = await createClient();
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

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/muazzin/donations', 'page');
  return { success: true };
}
