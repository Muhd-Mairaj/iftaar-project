'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="bg-card/40 backdrop-blur-xl border-2 border-white/5 rounded-[2.5rem] p-6 shadow-xl shadow-black/5 flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card/40 backdrop-blur-xl border-2 rounded-[2.5rem] p-5 shadow-xl shadow-black/5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      {/* <Skeleton className="h-3 w-32" /> */}
    </div>
  );
}
