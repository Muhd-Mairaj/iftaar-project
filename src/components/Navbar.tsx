'use client';

import { useTranslate } from '@tolgee/react';
import { ChevronDown, Globe, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar({ locale }: { locale: string }) {
  const { t } = useTranslate();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
            <span className="font-bold text-xl leading-none">I</span>
          </div>
          <span className="font-black text-xl tracking-tight text-foreground hidden sm:block">
            Iftaar
            <span className="text-primary tracking-normal font-medium">
              Coord
            </span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Selection */}
          <DropdownMenu dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-xl gap-2 h-10 px-3 md:px-4 hover:bg-primary/5 transition-colors"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">
                  {locale === 'en' ? 'English' : 'العربية'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-xl p-1 shadow-xl border-border/50 bg-card"
            >
              <DropdownMenuItem
                onClick={() => toggleLanguage('en')}
                className={`rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                  locale === 'en'
                    ? 'bg-primary/10 text-primary font-bold focus:bg-primary/20 focus:text-primary'
                    : 'focus:bg-primary/5 focus:text-primary'
                }`}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleLanguage('ar')}
                className={`rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                  locale === 'ar'
                    ? 'bg-primary/10 text-primary font-bold focus:bg-primary/20 focus:text-primary'
                    : 'focus:bg-primary/5 focus:text-primary'
                }`}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Login Button */}
          <Button
            asChild
            className="rounded-xl px-6 h-10 font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Link href={`/${locale}/login`}>
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
