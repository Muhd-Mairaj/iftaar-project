'use client';

import { useTranslate } from '@tolgee/react';
import { History, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CollectionForm } from './CollectionForm';
import { CollectionsList } from './CollectionsList';

interface CollectionTabsProps {
  userId: string | null;
}

export function CollectionTabs({ userId }: CollectionTabsProps) {
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      {/* Sub-navigation Tabs */}
      <div className="flex-none flex items-center py-1 bg-card/40 backdrop-blur-xl border rounded-2xl w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab('request')}
          className={cn(
            'rounded-xl px-4 h-9 font-bold text-[11px] uppercase flex-1 transition-all gap-2',
            activeTab === 'request'
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'text-muted-foreground hover:bg-white/5'
          )}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          {t('submit_request')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab('history')}
          className={cn(
            'rounded-xl px-4 h-9 font-bold text-[11px] uppercase flex-1 transition-all gap-2',
            activeTab === 'history'
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'text-muted-foreground hover:bg-white/5'
          )}
        >
          <History className="w-3.5 h-3.5" />
          {t('muazzin_nav_collections')}
        </Button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === 'request' && (
          <div className="">
            <div className="mb-4">
              <h2 className="text-xl font-black tracking-tight text-foreground">
                {t('submit_request')}
              </h2>
              <p className="text-xs text-muted-foreground font-medium opacity-70">
                {t('muazzin_nav_card_collections_desc')}
              </p>
            </div>
            <CollectionForm />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 min-h-0 flex flex-col ">
            <div className="mb-4 flex-none">
              <h2 className="text-xl font-black tracking-tight text-foreground">
                {t('collection_requests')}
              </h2>
              <p className="text-xs text-muted-foreground font-medium opacity-70">
                {t('history_desc')}
              </p>
            </div>
            <CollectionsList userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
}
