import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import '../globals.css';
import { notFound } from 'next/navigation';
import { TolgeeNextProvider } from '@/components/TolgeeNextProvider';
import { ALL_LOCALES } from '@/i18n';
import { cn } from '@/lib/utils';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'Iftar Food Coordination',
  description: 'Coordinate Ramadan Iftar food packet donations',
};

export function generateStaticParams() {
  return ALL_LOCALES.map(locale => ({ locale }));
}

import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!ALL_LOCALES.includes(locale)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? cairo.variable : inter.variable;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${cairo.variable}`}
    >
      <body
        className={cn(
          fontClass,
          'font-sans antialiased text-foreground bg-background h-[100dvh] w-full overflow-hidden select-none'
        )}
      >
        <TolgeeNextProvider locale={locale}>
          <QueryProvider>
            {/* Background Ambience Shared across pages */}
            <div className="fixed inset-0 arabesque-pattern pointer-events-none opacity-30 px-6 overflow-hidden z-0">
              <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[30%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[30%] bg-lantern/5 blur-[100px] rounded-full pointer-events-none" />
            </div>

            <AppHeader locale={locale} />

            <main className="relative z-10 h-full w-full overflow-y-auto pt-[4.5rem] pb-24">
              {children}
            </main>

            <BottomNav locale={locale} />
          </QueryProvider>
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
