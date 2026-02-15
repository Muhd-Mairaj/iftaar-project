'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from '@tolgee/react';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
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
import { loginUser } from '@/lib/actions';
import { createClient } from '@/lib/supabase/client';
import { LoginInput, LoginSchema } from '@/lib/validations';

export default function LoginPage() {
  const { t } = useTranslate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsSubmitting(true);
    try {
      const result = await loginUser(data);

      if (result?.error) {
        alert(result.error);
        return;
      }

      // Check role and redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'muazzin') {
          router.push('/muazzin/dashboard');
        } else if (profile?.role === 'restaurant_admin') {
          router.push('/restaurant/dashboard');
        } else if (profile?.role === 'super_admin') {
          router.push('/admin/users'); // Redirect to future admin dashboard
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error(error);
      alert(t('error_unexpected'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-4 shadow-xl shadow-primary/5 border border-primary/20 backdrop-blur-sm">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t('login')}
          </h1>
          <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto opacity-80">
            {t('login_desc')}
          </p>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                      {t('email_label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        className="bg-background/50 border-input/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold text-destructive ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                      {t('password_label')}
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary hover:bg-primary/90 text-primary-foreground group mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  t('login_button')
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
