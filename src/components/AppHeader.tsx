'use client';

import { Globe, LogIn } from 'lucide-react';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
            <Button variant="ghost" size="sm" className="rounded-full gap-1 h-9 px-3 hover:bg-primary/5 text-muted-foreground transition-colors font-bold text-[10px] uppercase tracking-widest">
              <Globe className="w-3 h-3 text-primary" />
              {locale === 'en' ? 'EN' : 'AR'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 rounded-2xl p-1 shadow-2xl border-border/40 bg-card/80 backdrop-blur-xl">
            <DropdownMenuItem onClick={() => toggleLanguage('en')} className="rounded-xl text-[10px] font-bold uppercase tracking-widest">English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleLanguage('ar')} className="rounded-xl text-[10px] font-bold uppercase tracking-widest leading-none">العربية</DropdownMenuItem>
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
