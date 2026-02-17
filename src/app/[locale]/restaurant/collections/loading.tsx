import { CardGridSkeleton, FilterBarSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function RestaurantCollectionsLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PageHeaderSkeleton />
      <FilterBarSkeleton count={5} />
      <CardGridSkeleton count={6} itemHeight="h-[210px]" />
    </div>
  );
}
