'use client';

import { useTranslate } from '@tolgee/react';
import { Globe, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

export function AppHeader({ locale }: { locale: string }) {
  const { t } = useTranslate();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const toggleLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    // biome-ignore lint/suspicious/noDocumentCookie: most compatible way to set NEXT_LOCALE for middleware
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname, { scroll: false });
  };

  const handleLogout = async () => {
    setIsLogoutDialogOpen(false);
    await logout();
  };

  return (
    <header className="flex-none z-50 h-16 flex items-center justify-between px-6 bg-background/50 backdrop-blur-md border-b border-white/5 shadow-sm select-none">
      <div className="flex items-center gap-2">
        <Link href={`/${locale}`} className="group flex items-center gap-2">
          <Logo className="w-9 h-9" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80 group-hover:text-primary transition-colors">
            {t('app_name_main')}
            <span className="text-primary tracking-normal font-medium opacity-50 lowercase">
              {t('app_name_sub')}
            </span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full gap-2 h-10 px-4 hover:bg-primary/5 text-muted-foreground transition-all font-bold text-[11px] uppercase tracking-widest border border-transparent hover:border-primary/10"
            >
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
                'rounded-xl h-12 px-4 text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all mb-1 last:mb-0',
                locale === 'en'
                  ? 'bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground'
                  : 'hover:bg-primary/10 focus:bg-primary/10 focus:text-primary'
              )}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toggleLanguage('ar')}
              className={cn(
                'rounded-xl h-12 px-4 text-sm font-bold cursor-pointer transition-all',
                locale === 'ar'
                  ? 'bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground'
                  : 'hover:bg-primary/10 focus:bg-primary/10 focus:text-primary'
              )}
            >
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <Dialog
            open={isLogoutDialogOpen}
            onOpenChange={setIsLogoutDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10 rounded-[2rem] p-6 shadow-2xl">
              <DialogHeader className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                  <LogOut className="w-6 h-6 text-destructive" />
                </div>
                <DialogTitle className="text-xl font-black">
                  {t('logout_confirm_title')}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {t('logout_confirm_desc')}
                </p>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="rounded-xl h-12 font-bold hover:bg-muted"
                  >
                    {t('cancel')}
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="rounded-xl h-12 font-bold shadow-lg shadow-destructive/20"
                >
                  {t('logout_button')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Link href={`/${locale}/login`}>
            <Button
              size="sm"
              className="rounded-full h-9 px-4 bg-card/50 backdrop-blur-md border border-border/40 hover:bg-card/80 text-foreground shadow-sm group"
            >
              <LogIn className="w-3 h-3 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {t('login')}
              </span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
