import { Suspense } from 'react';
import { ListSkeleton } from '@/components/skeletons';
import { getTolgee } from '@/i18n';
import { getMuazzinDonations } from '@/lib/actions/muazzin';
import { DonationsList } from './DonationsList';

const PAGE_SIZE = 10;

/**
 * PART A: Async Data Component
 * Moves the database fetching logic into a child.
 */
async function DonationsDataLoader({ locale }: { locale: string }) {
  // Fetch first page of donations using the standardized server action
  const donationsWithUrls = await getMuazzinDonations(0, PAGE_SIZE, 'pending');

  return (
    <DonationsList
      initialDonations={donationsWithUrls}
      locale={locale}
      pageSize={PAGE_SIZE}
    />
  );
}

/**
 * PART B: Main Page Component
 * Renders the layout/shell immediately.
 */
export default async function DonationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTolgee(locale);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6 animate-in fade-in duration-500">
      {/* Fixed header - Renders instantly */}
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('muazzin_nav_donations')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('muazzin_nav_card_donations_desc')}
        </p>
      </div>

      {/* Suspense boundary - Shows skeleton while DB query resolves */}
      <Suspense fallback={<ListSkeleton count={6} />}>
        <DonationsDataLoader locale={locale} />
      </Suspense>
    </div>
  );
}
