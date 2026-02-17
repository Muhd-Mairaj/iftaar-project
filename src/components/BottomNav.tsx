'use client';

import { useTranslate } from '@tolgee/react';
import {
  Boxes,
  HeartHandshake,
  Home,
  LayoutDashboard,
  Users,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: typeof Home;
}

export function BottomNav({ locale }: { locale: string }) {
  const { t } = useTranslate();
  const pathname = usePathname();
  const { role } = useAuth();

  const isMuazzin = role === 'muazzin';
  const isSuperAdmin = role === 'super_admin';

  const tabs: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      {
        id: 'home',
        href: `/${locale}`,
        label: t('nav_home'),
        icon: Home,
      },
      {
        id: 'restaurants',
        href: `/${locale}/partners`,
        label: t('nav_partners'),
        icon: Utensils,
      },
    ];

    if (isMuazzin) {
      items.push(
        {
          id: 'dashboard',
          href: `/${locale}/muazzin`,
          label: t('muazzin_nav_dashboard'),
          icon: LayoutDashboard,
        },
        {
          id: 'donations',
          href: `/${locale}/muazzin/donations`,
          label: t('muazzin_nav_donations'),
          icon: HeartHandshake,
        },
        {
          id: 'collections',
          href: `/${locale}/muazzin/collections`,
          label: t('muazzin_nav_collections'),
          icon: Boxes,
        }
      );
    }

    if (isSuperAdmin) {
      items.push({
        id: 'users',
        href: `/${locale}/admin/users`,
        label: t('admin_nav_users') || 'Users',
        icon: Users,
      });
    }

    return items;
  }, [isMuazzin, isSuperAdmin, locale, t]);

  // Determine active tab
  const activeIndex = useMemo(() => {
    const activeId = (() => {
      switch (true) {
        case pathname.includes('/muazzin/donations'):
          return 'donations';
        case pathname.includes('/muazzin/collections'):
          return 'collections';
        case pathname.includes('/muazzin'):
          return 'dashboard';
        case pathname.includes('/admin/users'):
          return 'users';
        case pathname.includes('/partners'):
          return 'restaurants';
        default:
          return 'home';
      }
    })();

    return tabs.findIndex(t => t.id === activeId);
  }, [pathname, tabs]);

  const tabCount = tabs.length;

  // Calculate indicator position and width
  const indicatorWidth = `calc((100% - ${(tabCount + 1) * 6}px) / ${tabCount})`;
  const indicatorOffset = `calc(${activeIndex} * (100% - 12px) / ${tabCount} + 6px)`;

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className={cn(
          'flex items-center bg-card/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] p-1.5 shadow-2xl relative h-14 pointer-events-auto',
          isMuazzin || isSuperAdmin
            ? 'w-full max-w-[420px]'
            : 'w-full max-w-[320px]'
        )}
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1.5 bottom-1.5 bg-primary rounded-[1.5rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg shadow-primary/30"
          style={{
            width: indicatorWidth,
            insetInlineStart: indicatorOffset,
          }}
        />

        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tabs[activeIndex]?.id === tab.id;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 z-10 transition-all duration-500 h-full rounded-[1.5rem] px-1',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-all flex-shrink-0',
                  isActive ? 'scale-110 fill-current' : 'scale-100 opacity-60'
                )}
              />
              {!isMuazzin && (
                <span
                  className={cn(
                    'text-[10px] uppercase font-black tracking-widest transition-all duration-500 overflow-hidden whitespace-nowrap',
                    isActive ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0'
                  )}
                >
                  {tab.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
