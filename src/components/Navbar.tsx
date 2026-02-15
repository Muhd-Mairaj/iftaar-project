'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, LogIn, ChevronDown } from 'lucide-react';
import { useTranslate } from '@tolgee/react';
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-emerald-200/50 group-hover:scale-105 transition-transform">
            <span className="font-bold text-xl leading-none">I</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
            Iftaar<span className="text-primary tracking-normal">Coord</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Selection */}
          <DropdownMenu dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-10 px-3 md:px-4">
                <Globe className="w-4 h-4 text-primary" />
                <span className="hidden md:inline">{locale === 'en' ? 'English' : 'العربية'}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => toggleLanguage('en')}
                className={locale === 'en' ? 'text-primary font-bold' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleLanguage('ar')}
                className={locale === 'ar' ? 'text-primary font-bold' : ''}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Login Button */}
          <Button asChild className="rounded-xl px-5 font-bold shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-95">
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
