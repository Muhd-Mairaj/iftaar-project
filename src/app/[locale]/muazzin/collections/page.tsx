'use client';

import { useTranslate } from '@tolgee/react';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CollectionTabs } from './CollectionTabs';

export default function CollectionsPage() {
  const { t } = useTranslate();
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw new Error('Auth error');
      setUserId(user.id);
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      setError(err.message || 'Failed to fetch collections');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="flex-none">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t('muazzin_nav_collections')}
        </h1>
        <p className="text-sm text-muted-foreground font-medium opacity-80">
          {t('muazzin_nav_card_collections_desc')}
        </p>
      </div>

      {error ? (
        <div className="p-6 text-center bg-destructive/10 rounded-3xl border border-destructive/20 animate-in fade-in">
          <p className="text-destructive font-bold">
            {error || 'Error loading profile'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try logging in again.
          </p>
        </div>
      ) : (
        <CollectionTabs userId={userId} />
      )}
    </>
  );
}
