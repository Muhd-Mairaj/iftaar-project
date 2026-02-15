'use client';

import { useTranslate } from '@tolgee/react';
import { DonationForm } from '@/components/DonationForm';
import { Heart, ShieldCheck, Sparkle } from 'lucide-react';

export default function PublicDonationPage() {
  const { t } = useTranslate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 arabesque-pattern pointer-events-none opacity-40" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-lantern/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-lg mx-auto space-y-8 py-12">
          {/* Minimal Header */}
          <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/10">
              <Sparkle className="w-3 h-3 text-lantern" />
              {t('hero_badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              {t('hero_title_prefix')}{' '}
              <span className="text-primary italic relative">
                {t('hero_title_accent')}
                <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-lantern/20 rounded-full" />
              </span>
            </h1>

            <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium leading-relaxed opacity-80">
              {t('hero_subtitle')}
            </p>
          </header>

          {/* Centered Action Card */}
          <div className="relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {/* Soft shadow glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/20 to-lantern/20 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000" />

            <div className="relative bg-card/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-2xl">
              <div className="mb-8 flex items-center justify-between border-b border-border/40 pb-6">
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight">
                    {t('form_title')}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    {t('form_desc')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
              </div>

              <DonationForm />
            </div>
          </div>

          {/* Minimal Trust Indicators */}
          <section className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-card/20 border border-border/40 text-center space-y-2 group transition-colors hover:bg-card/40">
              <ShieldCheck className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                {t('info_secure_title')}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-card/20 border border-border/40 text-center space-y-2 group transition-colors hover:bg-card/40">
              <div className="text-sm font-black text-primary group-hover:scale-110 transition-transform">1,240+</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                {t('stats_title')}
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="py-8 text-center relative z-10 border-t border-border/5">
        <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.4em]">
          {t('trust_footer')}
        </p>
      </footer>
    </div>
  );
}
