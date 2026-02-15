import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import '../globals.css';
import { TolgeeNextProvider } from '@/components/TolgeeNextProvider';
import QueryProvider from '@/providers/QueryProvider';
import { ALL_LOCALES } from '@/i18n';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';

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
  const fontClass = locale === 'ar' ? cairo.variable : inter.variable;

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
      <body className={`${fontClass} font-sans antialiased`}>
        <TolgeeNextProvider locale={locale}>
          <QueryProvider>
            <Navbar locale={locale} />
            <main className="min-h-screen">
              {children}
            </main>
          </QueryProvider>
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
