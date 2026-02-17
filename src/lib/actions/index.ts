'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function submitDonation(formData: FormData) {
  try {
    const supabase = await createClient();

    // 1. Extract and Validate
    const quantityStr = formData.get('quantity');
    const receiptFile = formData.get('receipt') as File;

    if (!quantityStr || !receiptFile) {
      return { error: 'Missing required fields' };
    }

    const quantity = Number.parseInt(quantityStr as string, 10);

    // Basic file validation
    if (receiptFile.size === 0) {
      return { error: 'Please upload a valid receipt image' };
    }

    // 2. File Upload (Supabase Storage)
    const fileExt = receiptFile.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Convert File to ArrayBuffer for Supabase Upload
    const arrayBuffer = await receiptFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, fileBuffer, {
        contentType: receiptFile.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: 'Failed to upload receipt. Please try again.' };
    }

    // 3. Database Insertion
    const { error: dbError } = await supabase.from('donations').insert({
      quantity,
      proof_url: fileName,
      status: 'pending',
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
