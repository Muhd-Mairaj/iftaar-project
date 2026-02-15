'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { type InviteUserInput, InviteUserSchema } from '@/lib/validations';

export async function inviteUser(data: InviteUserInput) {
  try {
    const validated = InviteUserSchema.parse(data);
    const supabase = createAdminClient();

    // 1. Invite the user via Auth API
    const { data: inviteData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(validated.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/update-password`,
      });

    if (inviteError) {
      console.error('Invite error:', inviteError);
      return { error: inviteError.message };
    }

    if (!inviteData.user) {
      return { error: 'Failed to create user during invitation' };
    }

    // 2. Insert into profiles table
    // Note: We use the admin client to bypass RLS for this internal operation
    const { error: profileError } = await supabase.from('profiles').insert({
      id: inviteData.user.id,
      email: validated.email,
      role: validated.role,
    });

    if (profileError) {
      console.error('Profile insertion error:', profileError);
      // Attempt to delete the auth user if profile insertion fails to keep things consistent
      await supabase.auth.admin.deleteUser(inviteData.user.id);
      return { error: 'Failed to create user profile' };
    }

    revalidatePath('/[locale]/admin/users', 'page');
    return { success: true };
  } catch (error) {
    console.error('Invite user error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getUsers() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch users error:', error);
    return [];
  }

  return data;
}
