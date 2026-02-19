'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import { Loader2, Mail, PlusCircle, ShieldCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ListSkeleton } from '@/components/Skeletons';
import { StatusFilter } from '@/components/StatusFilter';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUsers, inviteUser } from '@/lib/actions/admin';
import { InviteUserInput, InviteUserSchema } from '@/lib/validations';
import { UsersList } from './UsersList';

export default function AdminUsersPage() {
  const { t } = useTranslate();
  const params = useParams();
  const locale = params.locale as string;
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'pending'
  >('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin_users'],
    queryFn: getUsers,
  });

  const form = useForm<InviteUserInput>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: '',
      role: 'muazzin',
    },
  });

  async function onSubmit(data: InviteUserInput) {
    setIsSubmitting(true);
    try {
      const result = await inviteUser(data, locale);

      if (result?.error) {
        alert(result.error);
      } else {
        alert(t('invited_success'));
        setIsDialogOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      }
    } catch (error) {
      console.error(error);
      alert(t('error_unexpected'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 flex-none">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            {t('admin_dashboard_title')}
          </h1>
          <p className="text-sm text-muted-foreground font-medium opacity-80">
            {t('users_list_title')}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <PlusCircle className="w-5 h-5 mr-2" />
              {t('invite_user_title')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl rounded-[2rem] p-0 overflow-hidden shadow-2xl">
            <div className="p-6 pb-0">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-center">
                  {t('invite_user_title')}
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-6 pt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                          {t('email_label')}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder={t('email_placeholder')}
                              className="bg-background/50 border-input/50 h-12 rounded-2xl pl-10 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                              {...field}
                            />
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground/50" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] font-bold text-destructive ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                          {t('user_role_label')}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-input/50 h-12 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all font-medium">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl bg-card/95 backdrop-blur-xl">
                            <SelectItem
                              value="muazzin"
                              className="focus:bg-primary/10 rounded-lg cursor-pointer py-3 font-medium"
                            >
                              {t('role_muazzin')}
                            </SelectItem>
                            <SelectItem
                              value="restaurant_admin"
                              className="focus:bg-primary/10 rounded-lg cursor-pointer py-3 font-medium"
                            >
                              {t('role_restaurant_admin')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                      t('invite_button')
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <StatusFilter
        options={['all', 'active', 'pending'] as const}
        value={statusFilter}
        onChange={setStatusFilter}
        fullWidth
        getLabel={option => {
          if (option === 'all') return t('all');
          if (option === 'active') return t('user_status_active');
          if (option === 'pending') return t('user_status_pending');
          return option; // Fallback
        }}
      />

      {/* Content Section */}
      <div className="flex-1 min-h-0 border rounded-xl shadow-xl shadow-black/5 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pt-2 pb-6">
          {isLoading ? (
            <div className="p-6">
              <ListSkeleton />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-destructive gap-4">
              <p className="font-black text-xl">{t('error_unexpected')}</p>
              <Button
                variant="outline"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ['admin_users'] })
                }
                className="rounded-xl border-destructive/20 hover:bg-destructive/5"
              >
                {t('try_again')}
              </Button>
            </div>
          ) : (
            <UsersList
              users={users}
              isLoading={isLoading}
              filter={statusFilter}
            />
          )}
        </div>
      </div>
    </>
  );
}
