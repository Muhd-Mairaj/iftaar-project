'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  XOctagon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Tables } from '@/types/database.types';

type Collection = Tables<'collection_requests'>;
type FilterStatus =
  | 'all'
  | 'pending'
  | 'approved'
  | 'collected'
  | 'uncollected';

const PAGE_SIZE = 10;

async function fetchCollectionsPage(
  page: number,
  filter: FilterStatus,
  userId: string
): Promise<Collection[]> {
  const supabase = createClient();
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('collection_requests')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data } = await query;
  return data || [];
}

const STATUS_CONFIG = {
  approved: {
    label: 'approved',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/5',
  },
  collected: {
    label: 'collected',
    icon: Package,
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    glow: 'shadow-sky-500/5',
  },
  uncollected: {
    label: 'uncollected',
    icon: XOctagon,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    glow: 'shadow-destructive/5',
  },
  pending: {
    label: 'pending',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/5',
  },
} as const;

export function CollectionsList({
  initialCollections,
  locale,
  userId,
}: {
  initialCollections: Collection[];
  locale: string;
  userId: string;
}) {
  const { t } = useTranslate();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['collections', filter, userId],
      queryFn: ({ pageParam }) =>
        fetchCollectionsPage(pageParam, filter, userId),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPage.length < PAGE_SIZE) return undefined;
        return lastPageParam + 1;
      },
      initialData:
        filter === 'all'
          ? {
              pages: [initialCollections],
              pageParams: [0],
            }
          : undefined,
    });

  const allCollections = data?.pages.flat() ?? [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollRef.current, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getStatus = (status: string | null) =>
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.pending;

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: t('all') || 'All' },
    { key: 'pending', label: t('pending') },
    { key: 'approved', label: t('approved') },
    { key: 'collected', label: t('collected') },
    { key: 'uncollected', label: t('uncollected') },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      {/* Filter bar */}
      <div className="flex-none flex gap-2 p-1 bg-card/50 backdrop-blur-md rounded-xl border border-white/5 max-w-full overflow-x-auto scrollbar-none">
        {filters.map(f => (
          <Button
            key={f.key}
            variant="ghost"
            size="sm"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-lg px-3 h-8 font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap',
              filter === f.key
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-white/5'
            )}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-xl"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : allCollections.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-[2rem] border border-dashed border-white/10 bg-white/5">
            <Package className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <h3 className="font-bold text-muted-foreground">
              {t('no_requests_found')}
            </h3>
            <p className="text-sm text-muted-foreground/50 mt-1">
              {t('change_filter_hint')}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {allCollections.map((collection, index) => {
              const status = getStatus(collection.status);
              const Icon = status.icon;
              const targetDate = new Date(collection.target_date);
              const createdDate = new Date(collection.created_at || '');
              const isToday =
                targetDate.toDateString() === new Date().toDateString();
              const isPast = targetDate < new Date() && !isToday;

              return (
                <Card
                  key={collection.id}
                  className={cn(
                    'border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-card/60',
                    status.border,
                    'animate-in fade-in slide-in-from-bottom-2'
                  )}
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      {/* Left accent strip */}
                      <div className={cn('w-1 flex-none', status.bg)} />

                      <div className="flex-1 p-4 space-y-3">
                        {/* Top row: quantity + status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
                              <span className="text-xl font-black leading-none">
                                {collection.quantity}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold leading-tight">
                                {t('packets_label')}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">
                                #{collection.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>

                          <div
                            className={cn(
                              'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1',
                              status.bg,
                              status.color
                            )}
                          >
                            <Icon className="w-3 h-3" />
                            {t(status.label)}
                          </div>
                        </div>

                        {/* Bottom row: dates */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {isToday ? (
                                  <span className="text-primary font-bold">
                                    {t('today')}
                                  </span>
                                ) : (
                                  targetDate.toLocaleDateString(locale, {
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                )}
                              </span>
                            </div>
                            {isPast && collection.status === 'pending' && (
                              <span className="text-[9px] font-bold text-destructive/70 uppercase tracking-wider">
                                {t('overdue')}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground/40 font-medium">
                            {t('submitted_on')}{' '}
                            {createdDate.toLocaleDateString(locale, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
