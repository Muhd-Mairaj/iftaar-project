'use client';

import { useTranslate } from '@tolgee/react';
import { Loader2, User, Users } from 'lucide-react';
import { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UsersListProps {
  users: Profile[];
  isLoading: boolean;
}

export function UsersList({ users, isLoading }: UsersListProps) {
  const { t } = useTranslate();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-4">
        <Users className="w-16 h-16 opacity-20" />
        <p className="font-medium text-lg">{t('no_users_found')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
      {users.map(user => (
        <div
          key={user.id}
          className="bg-background/60 hover:bg-background/80 transition-colors border border-border/50 rounded-3xl p-5 flex flex-col gap-4 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <div
              className={`w-2 h-2 rounded-full ${user.role === 'super_admin'
                  ? 'bg-purple-500'
                  : user.role === 'muazzin'
                    ? 'bg-primary'
                    : 'bg-orange-500'
                } animate-pulse`}
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
            <span>{new Date(user.created_at || '').toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
