import { getTolgee } from '@/i18n';
import { createClient } from '@/lib/supabase/server';
import { CollectionForm } from './CollectionForm';
import { CollectionsList } from './CollectionsList';

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

  const { data: collections, error: queryError } = await supabase
    .from('collection_requests')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })
    .range(0, 9);

  if (queryError) {
    console.error('Query error:', queryError);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6 animate-in fade-in duration-500">
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('muazzin_nav_collections')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('muazzin_nav_card_collections_desc')}
        </p>
      </div>

      {/* Form section — fixed at top */}
      <div className="flex-none space-y-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            {t('create_request')}
          </h2>
          <p className="text-[11px] text-muted-foreground font-medium opacity-70">
            {t('plan_goal_desc')}
          </p>
        </div>
        <CollectionForm />
      </div>

      {/* History section — scrollable */}
      <div className="flex flex-col flex-1 min-h-0 gap-3">
        <div className="flex-none">
          <h2 className="text-lg font-black tracking-tight text-foreground">
            {t('collection_requests')}
          </h2>
          <p className="text-[11px] text-muted-foreground font-medium opacity-70">
            {t('history_desc')}
          </p>
        </div>
        <CollectionsList
          initialCollections={collections || []}
          locale={locale}
          userId={user?.id || ''}
        />
      </div>
    </div>
  );
}
