'use client';

import { useTranslate } from '@tolgee/react';
import { Sparkle } from 'lucide-react';
import { DonationForm } from '@/components/DonationForm';

export default function PublicDonationPage() {
  const { t } = useTranslate();

  return (
    <div className="flex-grow flex flex-col items-center justify-center relative z-10 overflow-y-auto min-h-[60vh]">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
        <header className="text-center flex flex-col gap-1.5 animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-[0.2em] border border-primary/10 mx-auto">
            <Sparkle className="w-2.5 h-2.5 text-lantern" />
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

        <div className="relative bg-card/30 backdrop-blur-3xl border dark:border-white/5 rounded-[2.5rem] p-4 shadow-xl shadow-black/5 overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <DonationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
