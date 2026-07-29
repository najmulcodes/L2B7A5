import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types";

export function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-base-content/60">
        Page {meta.page} of {meta.totalPages} &middot; {meta.total} total
      </p>
      <div className="join">
        <button
          type="button"
          className="join-item btn btn-sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          className="join-item btn btn-sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
