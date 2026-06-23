import { Skeleton } from "@/components/ui/skeleton";

function CarouselSkeletons() {
  return (
    <div className="flex gap-3.5 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-64 shrink-0">
          <Skeleton className="aspect-[4/3] rounded-card" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function GridSkeletons() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 px-4 sm:px-6 lg:px-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/3] rounded-card" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-primary/20 h-72 lg:h-96 rounded-b-[2rem]" />

      {/* Search bar skeleton */}
      <div className="py-5 px-4 max-w-3xl mx-auto w-full">
        <Skeleton className="h-14 rounded-pill w-full" />
      </div>

      {/* Categories skeleton */}
      <div className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full py-2">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="flex gap-2.5 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-pill shrink-0" />
          ))}
        </div>
      </div>

      {/* Suggested carousel skeleton */}
      <div className="py-6 space-y-4">
        <div className="flex justify-between px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-20" />
        </div>
        <CarouselSkeletons />
      </div>

      {/* Banner skeleton */}
      <div className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full py-4">
        <Skeleton className="h-32 rounded-card" />
      </div>

      {/* New spas grid skeleton */}
      <div className="py-6 space-y-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between px-4 sm:px-6 lg:px-12">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <GridSkeletons />
      </div>
    </div>
  );
}
