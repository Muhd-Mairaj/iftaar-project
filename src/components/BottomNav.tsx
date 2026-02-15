'use client';

import { Home, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslate } from '@tolgee/react';

export function BottomNav({ locale }: { locale: string }) {
  const { t } = useTranslate();
  const pathname = usePathname();
  const isPartners = pathname.includes('/partners');
  const activeTab = isPartners ? 'restaurants' : 'home';

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center bg-card/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] p-1.5 shadow-2xl relative h-14 w-full max-w-[320px] pointer-events-auto">
        {/* Fluid Dot Indicator - Using 'start' for RTL compatibility */}
        <div
          className={cn(
            "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-[1.5rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg shadow-primary/30",
            activeTab === 'home' ? "start-1.5" : "start-[calc(50%+4.5px)]"
          )}
        />

        <Link
          href={`/${locale}`}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 z-10 transition-all duration-500 h-full rounded-[1.5rem] px-2",
            activeTab === 'home' ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          <Home className={cn("w-4 h-4 transition-all flex-shrink-0", activeTab === 'home' ? "scale-110 fill-current" : "scale-100 opacity-60")} />
          <span className={cn(
            "text-[10px] uppercase font-black tracking-widest transition-all duration-500 overflow-hidden whitespace-nowrap",
            activeTab === 'home' ? "opacity-100 max-w-[100px]" : "opacity-0 max-w-0"
          )}>
            {t('nav_home')}
          </span>
        </Link>

        <Link
          href={`/${locale}/partners`}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 z-10 transition-all duration-500 h-full rounded-[1.5rem] px-2",
            activeTab === 'restaurants' ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          <Utensils className={cn("w-4 h-4 transition-all flex-shrink-0", activeTab === 'restaurants' ? "scale-110 fill-current" : "scale-100 opacity-60")} />
          <span className={cn(
            "text-[10px] uppercase font-black tracking-widest transition-all duration-500 overflow-hidden whitespace-nowrap",
            activeTab === 'restaurants' ? "opacity-100 max-w-[100px]" : "opacity-0 max-w-0"
          )}>
            {t('nav_partners')}
          </span>
        </Link>
      </div>
    </nav>
  );
}
