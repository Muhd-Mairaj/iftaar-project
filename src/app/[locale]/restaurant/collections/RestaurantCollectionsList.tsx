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
  X,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { updateCollectionStatus } from '@/lib/actions/restaurant';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Database } from '@/types/database.types';

type CollectionRequest =
  Database['public']['Tables']['collection_requests']['Row'] & {
    profiles: { email: string } | null;
  };

type FilterStatus =
  | 'all'
  | 'pending'
  | 'approved'
  | 'collected'
  | 'uncollected';

async function fetchCollectionsPage(
  page: number,
  pageSize: number,
  filter: FilterStatus
): Promise<CollectionRequest[]> {
  const supabase = createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('collection_requests')
    .select(`
      *,
      profiles!collection_requests_created_by_fkey (
        email
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data as any;
}

export function RestaurantCollectionsList({
  initialRequests,
  locale,
  pageSize = 10,
}: {
  initialRequests: CollectionRequest[];
  locale: string;
  pageSize?: number;
}) {
  const { t } = useTranslate();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['restaurant_collections', filter],
      queryFn: ({ pageParam }) =>
        fetchCollectionsPage(pageParam, pageSize, filter),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPage.length < pageSize) return undefined;
        return lastPageParam + 1;
      },
      initialData:
        filter === 'pending'
          ? {
            pages: [initialRequests],
            pageParams: [0],
          }
          : undefined,
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

  const handleStatusUpdate = async (id: string, status: any) => {
    setIsSubmitting(id);
    try {
      const result = await updateCollectionStatus(id, status);
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: ['restaurant_collections'],
        });
        router.refresh();
      }
    } finally {
      setIsSubmitting(null);
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'approved':
      case 'collected':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'uncollected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getFilterLabel = (f: FilterStatus) => {
    switch (f) {
      case 'all':
        return t('status_all');
      case 'pending':
        return t('pending');
      case 'approved':
        return t('approved');
      case 'collected':
        return t('collected');
      case 'uncollected':
        return t('status_uncollected');
      default:
        return f;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      {/* Filter bar — matches muazzin side */}
      <div className="flex-none flex gap-2 p-1 bg-card/50 backdrop-blur-md rounded-xl border border-white/5 max-w-full overflow-x-auto no-scrollbar">
        {(
          [
            'all',
            'pending',
            'approved',
            'collected',
            'uncollected',
          ] as FilterStatus[]
        ).map(f => (
          <Button
            key={f}
            variant="ghost"
            size="sm"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-4 h-9 font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap',
              filter === f
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-white/5'
            )}
          >
            {getFilterLabel(f)}
          </Button>
        ))}
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar rounded-xl"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : allRequests.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-[2rem] border border-dashed border-white/10 bg-white/5">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">
              {t('no_requests_found')}
            </h3>
            <p className="text-sm text-muted-foreground/60">
              {t('change_filter_hint')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {allRequests.map(req => (
              <Card
                key={req.id}
                className="border-white/10 bg-card/40 backdrop-blur-xl overflow-hidden group hover:border-primary/20 transition-all duration-300"
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
                          {new Date(req.target_date).toLocaleDateString(locale)}
                        </div>
                      </div>
                      <div
                        className={cn(
                          'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5',
                          req.status === 'approved' ||
                            req.status === 'collected'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : req.status === 'uncollected'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-amber-500/10 text-amber-500'
                        )}
                      >
                        {getStatusIcon(req.status)}
                        {getFilterLabel(req.status as FilterStatus)}
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
                              handleStatusUpdate(req.id, 'uncollected')
                            }
                            className="rounded-xl h-11 w-11 p-0 border-white/10 transition-all shrink-0"
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
                            <Check className="w-4 h-4" />
                            {t('restaurant_action_accept')}
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
                            className="rounded-xl h-11 w-11 p-0 border-white/10 transition-all shrink-0"
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
                            <CheckCircle2 className="w-4 h-4" />
                            {t('restaurant_action_mark_collected')}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

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
