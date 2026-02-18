'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { type InviteUserInput, InviteUserSchema } from '@/lib/validations';
import { type Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export async function inviteUser(data: InviteUserInput, locale: string) {
  try {
    const validated = InviteUserSchema.parse(data);
    const supabase = createAdminClient();

    // 1. Invite the user via Auth API
    const { data: inviteData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(validated.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/update-password`,
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

export type ProfileWithStatus = Profile & {
  isAccepted: boolean;
  lastSignIn?: string | null;
};

export async function deleteUser(userId: string) {
  try {
    const supabase = createAdminClient();

    // 1. Delete auth user (cascades to profile if schema is right, but manual for safety here)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 2. Delete profile (just in case)
    await supabase.from('profiles').delete().eq('id', userId);

    revalidatePath('/[locale]/admin/users', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Delete user error:', error);
    return { error: error.message || 'Failed to delete user' };
  }
}

export async function resendInvite(
  email: string,
  role: string,
  locale: string
) {
  // We can reuse inviteUser logic
  return inviteUser({ email, role: role as any }, locale);
}

export async function getUsers(): Promise<ProfileWithStatus[]> {
  const supabase = createAdminClient();

  // 1. Fetch profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profileError) {
    console.error('Fetch profiles error:', profileError);
    return [];
  }

  // 2. Fetch auth users to check invitation status
  // Note: listUsers is paginated, but for now we fetch the first 1000
  const { data: authData, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    console.error('Fetch auth users error:', authError);
    // Return profiles even if auth fetch fails
    return (profiles || []).map(p => ({
      ...p,
      isAccepted: true,
    }));
  }

  // 3. Merge data
  return (profiles || []).map(p => {
    const authUser = authData.users.find(u => u.id === p.id);
    return {
      ...p,
      isAccepted: !!(authUser?.email_confirmed_at || authUser?.last_sign_in_at),
      lastSignIn: authUser?.last_sign_in_at,
    };
  });
}
