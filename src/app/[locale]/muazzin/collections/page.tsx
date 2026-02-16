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
  } = await supabase.auth.getUser();

  const { data: collections } = await supabase
    .from('collection_requests')
    .select('*')
    .eq('created_by', user?.id)
    .order('created_at', { ascending: false })
    .range(0, 9);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6">
      {/* Form section — fixed at top */}
      <div className="flex-none space-y-3">
        <div>
          <h2 className="text-2xl font-black mb-1">{t('create_request')}</h2>
          <p className="text-sm text-muted-foreground font-medium">
            {t('plan_goal_desc')}
          </p>
        </div>
        <CollectionForm locale={locale} />
      </div>

      {/* History section — scrollable */}
      <div className="flex flex-col flex-1 min-h-0 gap-3">
        <div className="flex-none">
          <h2 className="text-xl font-black">
            {t('collection_requests')}
          </h2>
          <p className="text-xs text-muted-foreground/70 font-medium">
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
