'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  LucideIcon,
  Package,
  XCircle,
  XOctagon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ListSkeleton } from '@/components/Skeletons';
import { StatusFilter } from '@/components/StatusFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getMuazzinCollectionRequests } from '@/lib/api/muazzin';
import { cn } from '@/lib/utils';
import { Enums } from '@/types/database.types';

type FilterStatus = Enums<'collection_status'> | 'all';

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<
  Enums<'collection_status'>,
  {
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
    glow: string;
  }
> = {
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
  rejected: {
    label: 'rejected',
    icon: XCircle,
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

export function CollectionsList({ userId }: { userId: string | null }) {
  const { t } = useTranslate();
  const params = useParams();
  const locale = params.locale as string;
  const [filter, setFilter] = useState<FilterStatus>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['collections', filter, userId],
    queryFn: ({ pageParam }) =>
      getMuazzinCollectionRequests({
        userId: userId!,
        pageParam,
        pageSize: PAGE_SIZE,
        filter,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!userId,
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

  const getStatus = (status: Enums<'collection_status'>) =>
    STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <StatusFilter
        options={
          [
            'all',
            'pending',
            'approved',
            'collected',
            'uncollected',
            'rejected',
          ] as const
        }
        value={filter}
        onChange={setFilter}
        containerClassName="gap-2"
        className="px-3 h-8 text-[10px]"
      />

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-xl no-scrollbar"
      >
        {!userId || isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-destructive font-bold mb-4">
              Error loading collections
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
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
                    'bg-card/40 shadow-black/5 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-card/60 touch-pan-y',
                    status.border,
                    'animate-in fade-in'
                  )}
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      {/* Left accent strip */}
                      <div className={cn('w-1 flex-none', status.bg)} />

                      <div className="flex-1 p-3 space-y-2.5">
                        {/* Top row: quantity + status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                              <span className="text-lg font-black leading-none">
                                {collection.quantity}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight">
                                {t('packets_label')}
                              </p>
                              <p className="text-[9px] text-muted-foreground/50 font-mono uppercase tracking-wider">
                                #{collection.id.slice(0, 6)}
                              </p>
                            </div>
                          </div>

                          <div
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1',
                              status.bg,
                              status.color
                            )}
                          >
                            <Icon className="w-2.5 h-2.5" />
                            {t(status.label)}
                          </div>
                        </div>

                        {/* Bottom row: dates */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1 text-muted-foreground font-medium">
                              <Calendar className="w-3 h-3" />
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
                              <span className="text-[8px] font-bold text-destructive/70 uppercase tracking-wider">
                                {t('overdue')}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground/30 font-medium whitespace-nowrap">
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
