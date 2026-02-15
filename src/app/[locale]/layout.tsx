import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { TolgeeNextProvider } from '@/components/TolgeeNextProvider';
import QueryProvider from '@/providers/QueryProvider';
import { ALL_LOCALES, DEFAULT_LOCALE } from '@/i18n';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Iftar Food Coordination',
  description: 'Coordinate Ramadan Iftar food packet donations',
};

export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!ALL_LOCALES.includes(locale)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={inter.className}>
        <TolgeeNextProvider locale={locale}>
          <QueryProvider>
            <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
              {children}
            </main>
          </QueryProvider>
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
