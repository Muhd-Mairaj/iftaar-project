import { Skeleton } from "@/components/ui/skeleton";
import { FilterBarSkeleton, FormSkeleton, PageHeaderSkeleton, VerticalListSkeleton } from "@/components/skeletons";

export default function CollectionsLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PageHeaderSkeleton />
      <FormSkeleton />

      {/* History section title */}
      <div className="flex-none space-y-2 mb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>

      <FilterBarSkeleton count={5} />
      <VerticalListSkeleton count={4} />
    </div>
  );
}
