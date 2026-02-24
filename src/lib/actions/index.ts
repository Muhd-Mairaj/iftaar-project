'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

import type { DonationInput } from '@/lib/validations';

export async function submitDonation(
  payload: Omit<DonationInput, 'proof_url'> & { receipt: File }
) {
  try {
    const supabase = await createClient();

    const { quantity, receipt, isRecurring, durationDays } = payload;
    let dailyQuantity = null;
    let totalQuantity = quantity;

    if (isRecurring && durationDays) {
      dailyQuantity = quantity;
      totalQuantity = quantity * durationDays;
    }

    // Basic file validation
    if (receipt.size === 0) {
      return { error: 'Please upload a valid receipt image' };
    }

    const acceptedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/heif',
    ];
    if (!acceptedTypes.includes(receipt.type)) {
      return {
        error:
          'Invalid file type. Please upload an image (JPG, PNG, WebP, HEIC).',
      };
    }

    // 2. File Upload (Supabase Storage)
    const fileExt = receipt.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Convert File to ArrayBuffer for Supabase Upload
    const arrayBuffer = await receipt.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, fileBuffer, {
        contentType: receipt.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: 'Failed to upload receipt. Please try again.' };
    }

    // 3. Database Insertion
    const { error: dbError } = await supabase.from('donations').insert({
      quantity: totalQuantity,
      proof_url: fileName,
      status: 'pending',
      is_recurring: isRecurring,
      duration_days: durationDays,
      daily_quantity: dailyQuantity,
      available_date: new Date().toISOString().split('T')[0], // Defaults to today
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Attempt to cleanup the uploaded file if database insert fails
      await supabase.storage.from('receipts').remove([fileName]);
      return { error: 'Failed to save donation record.' };
    }

    // 4. Success & Revalidation
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Submit donation error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
