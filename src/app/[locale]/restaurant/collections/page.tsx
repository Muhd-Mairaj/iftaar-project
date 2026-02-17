import { getTolgee } from '@/i18n';
import { getCollectionRequests } from '@/lib/actions/restaurant';
import { RestaurantCollectionsList } from './RestaurantCollectionsList';

const PAGE_SIZE = 10;

export default async function RestaurantCollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTolgee(locale);
  const requests = await getCollectionRequests(0, PAGE_SIZE - 1, 'pending');

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6 animate-in fade-in duration-500">
      <header className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('restaurant_collections_title')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('restaurant_collections_desc')}
        </p>
      </header>

      <RestaurantCollectionsList
        initialRequests={requests}
        locale={locale}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
