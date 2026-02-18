'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Hash,
  Loader2,
  LucideIcon,
  Package,
  X,
  XCircle,
  XOctagon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ListSkeleton } from '@/components/Skeletons';
import { StatusFilter } from '@/components/StatusFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getRestaurantCollections,
  updateCollectionRequestStatus,
} from '@/lib/api/restaurant';
import { cn } from '@/lib/utils';
import { Enums } from '@/types/database.types';

type FilterStatus = Enums<'collection_status'> | 'all';

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

export function RestaurantCollectionsList({
  pageSize = 10,
}: {
  pageSize?: number;
}) {
  const { t } = useTranslate();
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;

  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
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
    queryKey: ['restaurant_collections', filter],
    queryFn: ({ pageParam }) =>
      getRestaurantCollections({ pageParam, pageSize, filter }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < pageSize) return undefined;
      return lastPageParam + 1;
    },
  });

  const allRequests = data?.pages.flat() ?? [];

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

  const handleStatusUpdate = async (
    id: string,
    status: Enums<'collection_status'>
  ) => {
    setIsSubmitting(id);
    try {
      await updateCollectionRequestStatus(id, status);
      await queryClient.invalidateQueries({
        queryKey: ['restaurant_collections'],
      });
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setIsSubmitting(null);
    }
  };

  const getStatus = (status: Enums<'collection_status'>) =>
    STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <StatusFilter
        options={
          [
            'all',
            'pending',
            'approved',
            'collected',
            'rejected',
            'uncollected',
          ] as const
        }
        value={filter}
        onChange={setFilter}
      />

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar rounded-xl"
      >
        {isLoading && <ListSkeleton />}

        {isError && (
          <div className="text-center py-20">
            <p className="text-destructive font-bold mb-4">
              Error loading requests
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !isError && allRequests.length === 0 && (
          <div className="text-center py-20 px-6 rounded-[2rem] border border-dashed border-white/10 bg-white/5">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">
              {t('no_requests_found')}
            </h3>
            <p className="text-sm text-muted-foreground/60">
              {t('change_filter_hint')}
            </p>
          </div>
        )}

        {!isLoading && !isError && allRequests.length > 0 && (
          <div className="flex flex-col gap-3">
            {allRequests.map(req => {
              const status = getStatus(req.status);
              const Icon = status.icon;
              const targetDate = new Date(req.target_date).toLocaleDateString(
                locale
              );

              return (
                <Card
                  key={req.id}
                  className="bg-card/40 shadow-xl border-2 shadow-black/5 backdrop-blur-xl overflow-hidden group hover:border-primary/20 transition-all duration-300 touch-pan-y"
                >
                  <CardContent className="p-0">
                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-primary" />
                            <span className="text-2xl font-black">
                              {req.quantity}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                              {t('packets_label')}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground/60 font-medium truncate max-w-[150px]">
                            {t('collections_by')} {req.profiles?.email}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pt-1">
                            <Calendar className="w-3 h-3" />
                            {targetDate}
                          </div>
                        </div>
                        <div
                          className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5',
                            status.bg,
                            status.color,
                            status.border,
                            'border'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {t(status.label)}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        {req.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isSubmitting === req.id}
                              onClick={() =>
                                handleStatusUpdate(req.id, 'rejected')
                              }
                              className="rounded-xl h-11 w-11 p-0 active:scale-95 transition-transform"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              disabled={isSubmitting === req.id}
                              onClick={() =>
                                handleStatusUpdate(req.id, 'approved')
                              }
                              className="flex-1 rounded-xl h-11 font-black gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 text-white transition-all active:scale-[0.98]"
                            >
                              {isSubmitting === req.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-4 h-4" />
                                  {t('approve_button')}
                                </>
                              )}
                            </Button>
                          </>
                        )}

                        {req.status === 'approved' && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isSubmitting === req.id}
                              onClick={() =>
                                handleStatusUpdate(req.id, 'uncollected')
                              }
                              className="rounded-xl h-11 w-11 p-0 active:scale-95 transition-transform"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              disabled={isSubmitting === req.id}
                              onClick={() =>
                                handleStatusUpdate(req.id, 'collected')
                              }
                              className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                              {isSubmitting === req.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  {t('restaurant_action_mark_collected')}
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />

            {isFetchingNextPage && (
              <div className="col-span-full flex justify-center py-4">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
