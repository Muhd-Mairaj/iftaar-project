import { CardGridSkeleton, FilterBarSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function DonationsLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PageHeaderSkeleton />
      <FilterBarSkeleton count={4} />
      <CardGridSkeleton count={6} itemHeight="h-[200px]" />
    </div>
  );
}
