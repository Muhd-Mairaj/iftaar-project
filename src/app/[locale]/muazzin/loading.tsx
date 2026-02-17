import { ActionButtonsSkeleton, PageHeaderSkeleton, StatsGridSkeleton } from "@/components/skeletons";

export default function MuazzinLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <StatsGridSkeleton count={3} />
      <ActionButtonsSkeleton count={2} />
    </div>
  );
}
