import { BigActionCardSkeleton, PageHeaderSkeleton, StatsGridSkeleton } from "@/components/skeletons";

export default function RestaurantLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <StatsGridSkeleton count={3} />
      <BigActionCardSkeleton />
    </div>
  );
}
