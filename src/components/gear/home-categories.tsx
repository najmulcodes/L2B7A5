"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";

export function HomeCategories() {
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-28 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {data?.map((category) => (
        <Link
          key={category.id}
          href={`/gear?categoryId=${category.id}`}
          className="btn btn-sm btn-outline rounded-full"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
