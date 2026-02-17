'use client';

import { useTranslate } from '@tolgee/react';
import {
  HeartHandshake,
  History,
  Home,
  LayoutDashboard,
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
          icon: History,
        }
      );
    }

    return items;
  }, [isMuazzin, locale, t]);

  // Determine active tab
  const activeIndex = useMemo(() => {
    if (pathname.includes('/muazzin/donations'))
      return tabs.findIndex(t => t.id === 'donations');
    if (pathname.includes('/muazzin/collections'))
      return tabs.findIndex(t => t.id === 'collections');
    if (pathname.includes('/muazzin'))
      return tabs.findIndex(t => t.id === 'dashboard');
    if (pathname.includes('/partners'))
      return tabs.findIndex(t => t.id === 'restaurants');
    return tabs.findIndex(t => t.id === 'home');
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
          isMuazzin ? 'w-full max-w-[420px]' : 'w-full max-w-[320px]'
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
