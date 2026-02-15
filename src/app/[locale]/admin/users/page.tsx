'use client';

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
import { Database } from '@/types/database.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslate } from '@tolgee/react';
import {
  Loader2,
  Mail,
  PlusCircle,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminUsersPage() {
  const { t } = useTranslate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<InviteUserInput>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: '',
      role: 'muazzin',
    },
  });

  useEffect(() => {
    // Check if user is super_admin, otherwise redirect
    // For now, we rely on the component mounting to fetch data
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    const data = await getUsers();
    setUsers(data as unknown as Profile[]);
    setIsLoading(false);
  }

  async function onSubmit(data: InviteUserInput) {
    setIsSubmitting(true);
    try {
      const result = await inviteUser(data);

      if (result?.error) {
        alert(result.error);
      } else {
        alert(t('invited_success'));
        setIsDialogOpen(false);
        form.reset();
        fetchUsers(); // Refresh list
      }
    } catch (error) {
      console.error(error);
      alert(t('error_unexpected'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 pb-24 space-y-8 relative overflow-hidden">
      {/* Admin Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              {t('admin_dashboard_title')}
            </h1>
            <p className="text-muted-foreground font-medium pl-1">
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
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
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
                            <SelectContent className="rounded-xl border-white/10 bg-card/95 backdrop-blur-xl">
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

        {/* Users List */}
        <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-1 shadow-xl min-h-[400px]">
          {isLoading ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-4">
              <Users className="w-16 h-16 opacity-20" />
              <p className="font-medium text-lg">{t('no_users_found')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
              {users.map(user => (
                <div
                  key={user.id}
                  className="bg-background/60 hover:bg-background/80 transition-colors border border-border/50 rounded-3xl p-5 flex flex-col gap-4 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div
                      className={`w-2 h-2 rounded-full ${user.role === 'super_admin' ? 'bg-purple-500' : user.role === 'muazzin' ? 'bg-primary' : 'bg-orange-500'} animate-pulse`}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-foreground/90">
                        {user.email}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                        {user.role === 'super_admin'
                          ? 'Super Admin'
                          : user.role === 'muazzin'
                            ? t('role_muazzin')
                            : t('role_restaurant_admin')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground/60 px-1 border-t border-border/40 pt-3 mt-auto">
                    <span>ID: {user.id.slice(0, 8)}...</span>
                    <span>
                      {new Date(user.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
