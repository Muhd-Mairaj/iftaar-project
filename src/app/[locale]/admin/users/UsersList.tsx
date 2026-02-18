'use client';

import { useTranslate } from '@tolgee/react';
import { User, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UsersListProps {
  users: Profile[];
  isLoading: boolean;
}

export function UsersList({ users, isLoading }: UsersListProps) {
  const { t } = useTranslate();

  if (users.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-4">
        <Users className="w-16 h-16 opacity-20" />
        <p className="font-medium text-lg">{t('no_users_found')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map(user => (
        <Card
          key={user.id}
          className="bg-card/40 backdrop-blur-xl border shadow-xl shadow-black/5 overflow-hidden group relative transition-all duration-300 hover:border-primary/20"
        >
          <CardContent className="p-5">
            <div className="absolute top-0 right-0 p-5 opacity-50 group-hover:opacity-100 transition-opacity">
              <div
                className={`w-2 h-2 rounded-full ${user.role === 'super_admin'
                    ? 'bg-purple-500'
                    : user.role === 'muazzin'
                      ? 'bg-primary'
                      : 'bg-orange-500'
                  } animate-pulse`}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10 group-hover:scale-110 transition-transform duration-300">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
