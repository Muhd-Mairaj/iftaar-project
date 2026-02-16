import { createClient } from '@/lib/supabase/server';
import { getTolgee } from '@/i18n';
import { DonationsList } from './DonationsList';

const PAGE_SIZE = 10;

export default async function DonationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTolgee(locale);
  const supabase = await createClient();

  // Fetch first page of donations
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  // Generate signed URLs in a single batch
  const proofPaths = (donations || [])
    .map(d => d.proof_url)
    .filter(Boolean);

  const { data: signedUrls } = proofPaths.length > 0
    ? await supabase.storage.from('receipts').createSignedUrls(proofPaths, 3600)
    : { data: [] };

  const signedUrlMap = new Map(
    (signedUrls || []).map(entry => [entry.path, entry.signedUrl])
  );

  const donationsWithUrls = (donations || []).map(donation => ({
    ...donation,
    signed_proof_url: signedUrlMap.get(donation.proof_url) || null,
  }));

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      {/* Fixed header */}
      <div className="flex-none">
        <h1 className="text-3xl font-black">{t('muazzin_nav_donations')}</h1>
        <p className="text-muted-foreground font-medium">
          {t('muazzin_nav_card_donations_desc')}
        </p>
      </div>

      {/* Scrollable list fills remaining space */}
      <DonationsList
        initialDonations={donationsWithUrls}
        locale={locale}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
