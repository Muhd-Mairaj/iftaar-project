import { getTolgee } from '@/i18n';
import { getMuazzinCollectionRequests } from '@/lib/actions/muazzin';
import { createClient } from '@/lib/supabase/server';
import { CollectionTabs } from './CollectionTabs';

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTolgee(locale);
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive font-bold">Error loading user profile</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try logging in again.
        </p>
      </div>
    );
  }

  // Fetch first page of collections using the standardized server action
  const collections = await getMuazzinCollectionRequests(user.id, 0, 10);

  return (
    <>
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('muazzin_nav_collections')}
        </h1>
      </div>

      <CollectionTabs
        initialCollections={collections || []}
        locale={locale}
        userId={user.id}
      />
    </>
  );
}
