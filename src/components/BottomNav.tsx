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
  const isRestaurantAdmin = role === 'restaurant_admin';

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

    if (isRestaurantAdmin) {
      items.push(
        {
          id: 'restaurant_dashboard',
          href: `/${locale}/restaurant`,
          label: t('nav_dashboard') || 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'restaurant_collections',
          href: `/${locale}/restaurant/collections`,
          label: t('muazzin_nav_collections'),
          icon: Boxes,
        }
      );
    }

    return items;
  }, [isMuazzin, isSuperAdmin, isRestaurantAdmin, locale, t]);

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
        case pathname.includes('/restaurant/collections'):
          return 'restaurant_collections';
        case pathname.includes('/restaurant'):
          return 'restaurant_dashboard';
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
    <footer className="flex-none z-50 bg-background/80 backdrop-blur-lg border-t border-white/5 px-4">
      <div
        className={cn(
          'flex items-center bg-card/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative h-14 mx-auto select-none',
          isMuazzin || isSuperAdmin || isRestaurantAdmin
            ? 'w-full max-w-[440px]'
            : 'w-full max-w-[340px]'
        )}
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1.5 bottom-1.5 bg-primary rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg shadow-primary/30"
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
                'flex-1 flex flex-col items-center justify-center gap-1 z-10 transition-all duration-300 h-full rounded-[2rem] px-1',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-all duration-300 shrink-0',
                  isActive
                    ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                    : 'scale-100 opacity-50'
                )}
              />
              {!(isMuazzin || isRestaurantAdmin) && (
                <span
                  className={cn(
                    'text-[8px] font-black uppercase tracking-widest transition-all duration-300',
                    isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-1'
                  )}
                >
                  {tab.label.split(' ').pop()}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
