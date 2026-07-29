"use client";

import { useGearList } from "@/hooks/use-gear";
import { GearCard, GearCardSkeleton } from "@/components/gear/gear-card";
import { EmptyState } from "@/components/shared/empty-state";

export function HomeFeaturedGear() {
  const { data, isLoading } = useGearList({ sortBy: "rating", limit: 8 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <GearCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data?.items.length) {
    return <EmptyState title="No gear listed yet" description="Check back soon!" />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.items.map((gear) => (
        <GearCard key={gear.id} gear={gear} />
      ))}
    </div>
  );
}
