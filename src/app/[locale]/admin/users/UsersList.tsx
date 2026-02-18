'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import {
  Loader2,
  Send,
  Trash2,
  User,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  deleteUser,
  type ProfileWithStatus,
  resendInvite,
} from '@/lib/actions/admin';
import { cn } from '@/lib/utils';

interface UsersListProps {
  users: ProfileWithStatus[];
  isLoading: boolean;
  filter: 'all' | 'active' | 'pending';
}

export function UsersList({ users, isLoading, filter }: UsersListProps) {
  const { t } = useTranslate();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;

  const [actionId, setActionId] = useState<string | null>(null);

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        t('confirm_delete_user') || 'Are you sure you want to delete this user?'
      )
    )
      return;

    setActionId(userId);
    try {
      const result = await deleteUser(userId);
      if (result.error) {
        alert(result.error);
      } else {
        queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      }
    } catch (error) {
      console.error(error);
      alert(t('error_unexpected'));
    } finally {
      setActionId(null);
    }
  };

  const handleResend = async (user: ProfileWithStatus) => {
    setActionId(user.id);
    try {
      const result = await resendInvite(user.email, user.role, locale);
      if (result.error) {
        alert(result.error);
      } else {
        alert(t('invited_success'));
      }
    } catch (error) {
      console.error(error);
      alert(t('error_unexpected'));
    } finally {
      setActionId(null);
    }
  };

  const displayUsers = useMemo(() => {
    if (filter === 'all') return users;
    return users.filter(u =>
      filter === 'active' ? u.isAccepted : !u.isAccepted
    );
  }, [users, filter]);

  if (displayUsers.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-4">
        <Users className="w-16 h-16 opacity-20" />
        <p className="font-medium text-lg">{t('no_users_found')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {displayUsers.map(user => (
        <Card
          key={user.id}
          className="bg-card/40 backdrop-blur-xl border shadow-xl shadow-black/5 overflow-hidden group relative transition-all duration-300 hover:border-primary/20"
        >
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate text-foreground/90 leading-tight">
                    {user.email}
                  </p>
                  <div className="flex flex-row justify-between mt-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                      {user.role === 'super_admin'
                        ? 'Super Admin'
                        : user.role === 'muazzin'
                          ? t('role_muazzin')
                          : t('role_restaurant_admin')}
                    </p>
                    {/* <span className="text-muted-foreground/30 text-[10px]">•</span> */}
                    <div
                      className={cn(
                        'flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter',
                        user.isAccepted ? 'text-emerald-500' : 'text-amber-500'
                      )}
                    >
                      {user.isAccepted ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          {t('user_status_active')}
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" />
                          {t('user_status_pending')}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-medium border-t border-border/50 pt-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-muted-foreground/40 font-mono">
                    ID: {user.id.slice(0, 8)}
                  </span>
                  <span className="text-muted-foreground font-bold truncate">
                    {user.lastSignIn
                      ? `${t('last_login')}: ${new Date(user.lastSignIn).toLocaleDateString()}`
                      : `${t('invited_on')}: ${new Date(user.created_at || '').toLocaleDateString()}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!user.isAccepted && (
                    <Button
                      variant="ghost"
                      disabled={actionId === user.id}
                      onClick={() => handleResend(user)}
                      className="h-9 px-3 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all active:scale-95 bg-primary/5 flex items-center gap-2 font-black text-[10px] uppercase tracking-wider"
                    >
                      {actionId === user.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      {t('resend_invite')}
                    </Button>
                  )}
                  {user.role !== 'super_admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={actionId === user.id}
                      onClick={() => handleDelete(user.id)}
                      className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/40 transition-all active:scale-95 bg-destructive/5"
                      title={t('delete_user')}
                    >
                      {actionId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
