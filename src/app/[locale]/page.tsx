'use client';

import { useTranslate } from '@tolgee/react';
import { Sparkle } from 'lucide-react';
import { DonationForm } from '@/components/DonationForm';

export default function PublicDonationPage() {
  const { t } = useTranslate();

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 h-full relative z-10 overflow-hidden">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <header className="text-center space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/10 mx-auto">
            <Sparkle className="w-3 h-3 text-lantern" />
            {t('hero_badge')}
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight leading-none text-balance">
            {t('hero_title_accent')}{' '}
            <span className="text-primary italic">
              {t('hero_title_suffix')}
            </span>
          </h1>
          <p className="text-[11px] text-muted-foreground max-w-[220px] mx-auto font-medium leading-relaxed opacity-60 italic text-balance">
            {t('hero_subtitle')}
          </p>
        </header>

        <div className="relative bg-card/30 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[3rem] p-6 shadow-2xl overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <DonationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
