'use server';

import { createClient } from '@/lib/supabase/server';
import { DonationSchema, DonationInput, CollectionRequestSchema, CollectionRequestInput } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function submitDonation(data: DonationInput) {
  const validated = DonationSchema.parse(data);
  const supabase = await createClient();

  const { error } = await supabase
    .from('donations')
    .insert({
      quantity: validated.quantity,
      proof_url: validated.proof_url,
      status: 'pending',
    });

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]', 'layout');
  return { success: true };
}

export async function createCollectionRequest(data: CollectionRequestInput) {
  const validated = CollectionRequestSchema.parse(data);
  const supabase = await createClient();

  // Get current user for created_by
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('collection_requests')
    .insert({
      quantity: validated.quantity,
      target_date: validated.target_date,
      status: 'pending',
      created_by: user?.id,
    });

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/muazzin/dashboard', 'page');
  return { success: true };
}
