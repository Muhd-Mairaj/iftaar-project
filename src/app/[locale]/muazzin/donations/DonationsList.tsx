'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Hash,
  Loader2,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ListSkeleton } from '@/components/Skeletons';
import { StatusFilter } from '@/components/StatusFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getDonations, reviewDonation } from '@/lib/api/muazzin';
import { cn } from '@/lib/utils';
import { Enums } from '@/types/database.types';

type FilterStatus = Enums<'donation_status'> | 'all';

export function DonationsList({ pageSize = 10 }: { pageSize?: number }) {
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
    queryKey: ['donations', filter],
    queryFn: ({ pageParam }) =>
      getDonations({ page: pageParam, pageSize, status: filter }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < pageSize) return undefined;
      return lastPageParam + 1;
    },
  });

  const allDonations = data?.pages.flat() ?? [];

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

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    setIsSubmitting(id);
    try {
      await reviewDonation(id, status);
      await queryClient.invalidateQueries({ queryKey: ['donations'] });
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setIsSubmitting(null);
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <StatusFilter
        options={['all', 'pending', 'approved', 'rejected'] as const}
        value={filter}
        onChange={setFilter}
      />

      {/* Scrollable card list */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-xl no-scrollbar"
      >
        {isLoading && <ListSkeleton />}
        {isError && (
          <div className="text-center py-20">
            <p className="text-destructive font-bold mb-4">
              Error loading donations
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        )}
        {!isLoading && !isError && allDonations.length === 0 && (
          <div className="text-center py-20 px-6 rounded-[2rem] border border-dashed border-white/10 bg-white/5">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">
              No donations found
            </h3>
            <p className="text-sm text-muted-foreground/60">
              Try changing the status filter above.
            </p>
          </div>
        )}
        {!isLoading && !isError && allDonations.length > 0 && (
          <div className="flex flex-col gap-3">
            {allDonations.map(donation => (
              <Card
                key={donation.id}
                className="border-2 bg-card/40 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden group hover:border-primary/20 transition-all duration-300 touch-pan-y"
              >
                <CardContent className="p-0">
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-primary" />
                          <span className="text-2xl font-black">
                            {donation.quantity}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Packets
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <Calendar className="w-3 h-3" />
                          {new Date(
                            donation.created_at || ''
                          ).toLocaleDateString(locale)}
                        </div>
                      </div>
                      <div
                        className={cn(
                          'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5',
                          donation.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : donation.status === 'rejected'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-amber-500/10 text-amber-500'
                        )}
                      >
                        {getStatusIcon(donation.status)}
                        {donation.status || 'pending'}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-xl h-10 font-bold gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Proof
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden rounded-[2rem]">
                          <DialogTitle className="sr-only">
                            Donation Proof
                          </DialogTitle>
                          <div className="aspect-auto max-h-[80vh] w-full flex items-center justify-center p-4">
                            {donation.signed_proof_url ? (
                              <Image
                                src={donation.signed_proof_url}
                                alt="Donation Proof"
                                width={800}
                                height={800}
                                className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
                              />
                            ) : (
                              <div className="text-muted-foreground italic">
                                No image available
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {donation.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isSubmitting === donation.id}
                            onClick={() =>
                              handleReview(donation.id, 'rejected')
                            }
                            className="rounded-xl h-10 w-10 p-0 active:scale-95 transition-transform"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            disabled={isSubmitting === donation.id}
                            onClick={() =>
                              handleReview(donation.id, 'approved')
                            }
                            className="flex-1 rounded-xl h-10 font-bold gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                          >
                            {isSubmitting === donation.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Approve
                              </>
                            )}
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
