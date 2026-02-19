'use client';

import { useTranslate } from '@tolgee/react';
import { RestaurantCollectionsList } from './RestaurantCollectionsList';

export default function RestaurantCollectionsPage() {
  const { t } = useTranslate();

  return (
    <>
      <header className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('restaurant_collections_title')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('restaurant_collections_desc')}
        </p>
      </header>

      <RestaurantCollectionsList pageSize={10} />
    </>
  );
}
