'use client';

import { Globe, LogIn } from 'lucide-react';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/Logo';

export function AppHeader({ locale }: { locale: string }) {
  const { t } = useTranslate();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname, { scroll: false });
  };

  return (
    <header className="absolute top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link href={`/${locale}`} className="group flex items-center gap-2">
          <Logo className="w-9 h-9" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80 group-hover:text-primary transition-colors">
            Iftaar<span className="text-primary tracking-normal font-medium opacity-50 lowercase">coord</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        <DropdownMenu dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full gap-2 h-10 px-4 hover:bg-primary/5 text-muted-foreground transition-all font-bold text-[11px] uppercase tracking-widest border border-transparent hover:border-primary/10">
              <Globe className="w-4 h-4 text-primary" />
              {locale === 'en' ? 'English' : 'العربية'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl p-1.5 shadow-2xl border-border/80 bg-card/95 backdrop-blur-xl animate-in zoom-in-95 duration-200"
          >
            <DropdownMenuItem
              onClick={() => toggleLanguage('en')}
              className={cn(
                "rounded-xl h-12 px-4 text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all mb-1 last:mb-0",
                locale === 'en' ? "bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground" : "hover:bg-primary/10 focus:bg-primary/10 focus:text-primary"
              )}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toggleLanguage('ar')}
              className={cn(
                "rounded-xl h-12 px-4 text-sm font-bold cursor-pointer transition-all",
                locale === 'ar' ? "bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground" : "hover:bg-primary/10 focus:bg-primary/10 focus:text-primary"
              )}
            >
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={`/${locale}/login`}>
          <Button size="sm" className="rounded-full h-9 px-4 bg-card/50 backdrop-blur-md border border-border/40 hover:bg-card/80 text-foreground shadow-sm group">
            <LogIn className="w-3 h-3 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t('login')}</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
