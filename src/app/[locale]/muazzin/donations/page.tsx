import { getTolgee } from '@/i18n';
import { getMuazzinDonations } from '@/lib/actions/muazzin';
import { DonationsList } from './DonationsList';

const PAGE_SIZE = 10;

export default async function DonationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTolgee(locale);

  // Fetch first page of donations using the standardized server action
  const donationsWithUrls = await getMuazzinDonations(0, PAGE_SIZE, 'pending');

  return (
    <>
      {/* Fixed header */}
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('muazzin_nav_donations')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('muazzin_nav_card_donations_desc')}
        </p>
      </div>

      {/* Scrollable list fills remaining space */}
      <DonationsList
        initialDonations={donationsWithUrls}
        locale={locale}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}
