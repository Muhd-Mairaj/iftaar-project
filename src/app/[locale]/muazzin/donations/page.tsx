import { Suspense } from 'react';
import { ListSkeleton } from '@/components/skeletons';
import { getTolgee } from '@/i18n';
import { createClient } from '@/lib/supabase/server';
import { DonationsList } from './DonationsList';

const PAGE_SIZE = 10;

/**
 * PART A: Async Data Component
 * Moves the database fetching logic into a child.
 */
async function DonationsDataLoader({ locale }: { locale: string }) {
  const supabase = await createClient();

  // Fetch first page of donations
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  // Generate signed URLs in a single batch
  const proofPaths = (donations || []).map(d => d.proof_url).filter(Boolean);

  const { data: signedUrls } =
    proofPaths.length > 0
      ? await supabase.storage
        .from('receipts')
        .createSignedUrls(proofPaths, 3600)
      : { data: [] };

  const signedUrlMap = new Map(
    (signedUrls || []).map(entry => [entry.path, entry.signedUrl])
  );

  const donationsWithUrls = (donations || []).map(donation => ({
    ...donation,
    signed_proof_url: signedUrlMap.get(donation.proof_url) || null,
  }));

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
