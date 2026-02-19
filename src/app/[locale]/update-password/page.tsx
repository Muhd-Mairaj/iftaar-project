'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from '@tolgee/react';
import { Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { syncUserRole } from '@/lib/actions/admin';
import { createClient } from '@/lib/supabase/client';
import {
  type UpdatePasswordInput,
  UpdatePasswordSchema,
} from '@/lib/validations';
import { useAuth } from '@/providers/AuthProvider';

export default function UpdatePasswordPage() {
  const { t } = useTranslate();
  const router = useRouter();
  const { isSessionReady, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const supabase = createClient();

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: UpdatePasswordInput) {
    if (!isSessionReady) return;

    setSubmitting(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (!user) {
        throw new Error('No user found');
      }

      // Fetch user role to redirect appropriately
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = profile?.role;

      // Ensure metadata is synced for middleware RBAC
      if (role && user.app_metadata?.role !== role) {
        await syncUserRole(user.id, role);
      }

      if (role === 'muazzin') {
        router.replace('/muazzin');
      } else if (role === 'restaurant_admin') {
        router.replace('/restaurant');
      } else {
        router.replace('/');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      alert(error.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !isSessionReady) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden min-h-[60vh]">
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">
            Verifying secure link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center relative overflow-hidden min-h-[60vh]">
      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-4 shadow-xl shadow-primary/5 border border-primary/20 backdrop-blur-sm">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t('update_password_title')}
          </h1>
          <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto opacity-80">
            {t('update_password_desc')}
          </p>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                      {t('new_password_label')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          className="bg-background/50 border-input/50 h-12 rounded-2xl pr-10 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-destructive ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                      {t('confirm_password_label')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="bg-background/50 border-input/50 h-12 rounded-2xl pr-10 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-destructive ml-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary hover:bg-primary/90 text-primary-foreground group mt-2"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  t('update_password_button')
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
