'use client';

import { useTranslate } from '@tolgee/react';
import { DonationForm } from '@/components/DonationForm';
import { Heart, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PublicDonationPage() {
  const { t } = useTranslate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 arabesque-pattern pointer-events-none opacity-50" />

      <div className="max-w-4xl mx-auto py-24 px-6 relative z-10">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
            <Heart className="w-3 h-3 fill-current text-primary" />
            {t('hero_badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-4 leading-tight">
            {t('hero_title_prefix')}{' '}
            <span className="text-primary italic">{t('hero_title_accent')}</span>{' '}
            {t('hero_title_suffix')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            {t('hero_subtitle')}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Info Section */}
          <div className="lg:col-span-2 space-y-8 py-4">
            <div className="flex gap-4 group">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">
                  {t('info_secure_title')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                  {t('info_secure_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">
                  {t('info_community_title')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                  {t('info_community_desc')}
                </p>
              </div>
            </div>

            <Card className="p-8 bg-primary/5 border-primary/10 relative overflow-hidden transition-all hover:bg-primary/[0.07] group">
              <div className="text-4xl font-black text-primary mb-1 tracking-tight group-hover:scale-105 transition-transform origin-left">1,240+</div>
              <div className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">
                {t('stats_title')}
              </div>
              {/* Subtle decorative glow */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-lantern/20 rounded-full blur-2xl animate-pulse" />
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <Card className="p-8 md:p-12 relative overflow-hidden border-border/40">
              {/* Glow effect */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-8">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  {t('form_title')}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {t('form_desc')}
                </p>
              </div>

              <DonationForm />
            </Card>
          </div>
        </div>

        <footer className="mt-24 text-center">
          <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.4em] selection:bg-primary/20">
            {t('trust_footer')}
          </p>
        </footer>
      </div>
    </div>
  );
}
