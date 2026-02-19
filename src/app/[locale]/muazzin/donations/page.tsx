'use client';

import { useTranslate } from '@tolgee/react';
import { DonationsList } from './DonationsList';

export default function DonationsPage() {
  const { t } = useTranslate();

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full gap-6">
      {/* Header — Fixed */}
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('muazzin_nav_donations')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('muazzin_nav_card_donations_desc')}
        </p>
      </div>

      <DonationsList pageSize={10} />
    </div>
  );
}
