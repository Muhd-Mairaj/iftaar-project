'use client';

import { Home, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const isPartners = pathname.includes('/partners');
  const activeTab = isPartners ? 'restaurants' : 'home';

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center bg-card/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] p-1.5 shadow-2xl relative h-14 w-full max-w-[280px] pointer-events-auto">
        {/* Fluid Dot Indicator */}
        <div
          className={cn(
            "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-[1.5rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg shadow-primary/30",
            activeTab === 'home' ? "left-1.5" : "left-[calc(50%+4.5px)]"
          )}
        />

        <Link
          href={`/${locale}`}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 z-10 transition-all duration-500 h-full rounded-[1.5rem]",
            activeTab === 'home' ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          <Home className={cn("w-4 h-4 transition-all", activeTab === 'home' ? "scale-110 fill-current" : "scale-100 opacity-60")} />
          <span className={cn("text-[9px] uppercase font-black tracking-[0.2em] transition-all", activeTab === 'home' ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>Home</span>
        </Link>

        <Link
          href={`/${locale}/partners`}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 z-10 transition-all duration-500 h-full rounded-[1.5rem]",
            activeTab === 'restaurants' ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          <Utensils className={cn("w-4 h-4 transition-all", activeTab === 'restaurants' ? "scale-110 fill-current" : "scale-100 opacity-60")} />
          <span className={cn("text-[9px] uppercase font-black tracking-[0.2em] transition-all", activeTab === 'restaurants' ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>Partners</span>
        </Link>
      </div>
    </nav>
  );
}
