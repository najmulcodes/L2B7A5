"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { useMyGear } from "@/hooks/use-gear";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatMoney } from "@/lib/format";
import { Package } from "lucide-react";

export default function ProviderGearPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const { data, isLoading } = useMyGear({ status, page, limit: 10 });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">My Gear</h1>
        <Link href="/dashboard/provider/gear/new" className="btn btn-primary btn-sm">
          <Plus className="size-4" /> List New Gear
        </Link>
      </div>

      <div className="tabs tabs-box mb-6 w-fit">
        {(["all", "active", "inactive"] as const).map((tab) => (
          <button
            key={tab}
            className={`tab capitalize ${status === tab ? "tab-active" : ""}`}
            onClick={() => {
              setStatus(tab);
              setPage(1);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="skeleton h-64 w-full" />
      ) : !data?.items.length ? (
        <EmptyState
          icon={<Package className="size-14" />}
          title="No gear listed yet"
          action={
            <Link href="/dashboard/provider/gear/new" className="btn btn-primary btn-sm">
              List Your First Item
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-3">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="card card-side bg-base-100 border-base-300 overflow-hidden border"
              >
                <figure className="bg-base-200 relative w-28 shrink-0">
                  {item.images[0] && (
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  )}
                </figure>
                <div className="card-body flex-row flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-base-content/60 text-sm">
                      {formatMoney(item.pricePerDay)}/day &middot; {item.quantityAvailable}/
                      {item.quantityTotal} available
                    </p>
                    <span
                      className={`badge badge-sm mt-1 ${item.isActive ? "badge-success" : "badge-ghost"}`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/provider/gear/${item.id}/edit`}
                    className="btn btn-outline btn-sm"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {data.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
