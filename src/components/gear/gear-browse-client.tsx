"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useGearList, type GearFilters } from "@/hooks/use-gear";
import { useCategories } from "@/hooks/use-categories";
import { GearCard, GearCardSkeleton } from "@/components/gear/gear-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { gearConditions } from "@/lib/validations/gear";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function GearBrowseClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: GearFilters = useMemo(
    () => ({
      search: searchParams.get("search") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      condition: searchParams.get("condition") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      availableOnly: searchParams.get("availableOnly") === "true",
      sortBy: (searchParams.get("sortBy") as GearFilters["sortBy"]) ?? "newest",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12,
    }),
    [searchParams],
  );

  const { data, isLoading } = useGearList(filters);
  const { data: categories } = useCategories();

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.delete("page");
      router.push(`/gear?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-64">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <SlidersHorizontal className="size-4" />
            Filters
          </div>

          <div className="fieldset">
            <label className="fieldset-legend text-sm">Category</label>
            <select
              className="select select-bordered w-full"
              value={filters.categoryId ?? ""}
              onChange={(e) => updateParam("categoryId", e.target.value || undefined)}
            >
              <option value="">All categories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="fieldset">
            <label className="fieldset-legend text-sm">Condition</label>
            <select
              className="select select-bordered w-full"
              value={filters.condition ?? ""}
              onChange={(e) => updateParam("condition", e.target.value || undefined)}
            >
              <option value="">Any condition</option>
              {gearConditions.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="fieldset">
            <label className="fieldset-legend text-sm">Location</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Dhaka"
              defaultValue={filters.location ?? ""}
              onBlur={(e) => updateParam("location", e.target.value || undefined)}
            />
          </div>

          <div className="fieldset">
            <label className="fieldset-legend text-sm">Price per day (৳)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                className="input input-bordered w-full"
                placeholder="Min"
                defaultValue={filters.minPrice ?? ""}
                onBlur={(e) => updateParam("minPrice", e.target.value || undefined)}
              />
              <input
                type="number"
                min={0}
                className="input input-bordered w-full"
                placeholder="Max"
                defaultValue={filters.maxPrice ?? ""}
                onBlur={(e) => updateParam("maxPrice", e.target.value || undefined)}
              />
            </div>
          </div>

          <label className="label mt-2 cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filters.availableOnly ?? false}
              onChange={(e) => updateParam("availableOnly", e.target.checked ? "true" : undefined)}
            />
            <span className="text-sm">Available only</span>
          </label>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <label className="input input-bordered flex grow items-center gap-2">
              <Search className="text-base-content/40 size-4" />
              <input
                type="text"
                className="grow"
                placeholder="Search gear..."
                defaultValue={filters.search ?? ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateParam("search", e.currentTarget.value || undefined);
                  }
                }}
              />
            </label>
            <select
              className="select select-bordered"
              value={filters.sortBy}
              onChange={(e) => updateParam("sortBy", e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <GearCardSkeleton key={i} />
              ))}
            </div>
          ) : !data?.items.length ? (
            <EmptyState
              title="No gear found"
              description="Try adjusting your filters or search terms."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {data.items.map((gear) => (
                  <GearCard key={gear.id} gear={gear} />
                ))}
              </div>
              {data.meta && (
                <Pagination
                  meta={data.meta}
                  onPageChange={(page) => updateParam("page", String(page))}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
