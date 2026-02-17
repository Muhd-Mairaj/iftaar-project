import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6">
      {/* Filter Bar Skeleton */}
      <div className="flex-none flex gap-2 p-1 bg-card/50 backdrop-blur-md rounded-xl border border-white/5 w-fit">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Grid of Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-[200px] rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-xl p-6 space-y-5 animate-in fade-in duration-500"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl p-6 animate-in fade-in duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between h-full">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-16 w-16 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VerticalListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[92px] rounded-xl border border-white/10 bg-card/40 backdrop-blur-xl flex items-stretch overflow-hidden animate-in fade-in duration-500"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="w-1 bg-muted/20" />
          <div className="flex-1 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
