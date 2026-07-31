"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyRentals } from "@/hooks/use-rentals";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatDate, formatMoney } from "@/lib/format";
import type { RentalOrderStatus } from "@/types";

const STATUS_TABS: { value: RentalOrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PLACED", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PAID", label: "Paid" },
  { value: "PICKED_UP", label: "Picked Up" },
  { value: "RETURNED", label: "Returned" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function CustomerOrdersPage() {
  const [status, setStatus] = useState<RentalOrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyRentals({
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Orders</h1>

      <div className="tabs tabs-box mb-6 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`tab ${status === tab.value ? "tab-active" : ""}`}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="skeleton h-64 w-full" />
      ) : !data?.items.length ? (
        <EmptyState title="No orders found" description="No orders match this filter." />
      ) : (
        <>
          <div className="grid gap-3">
            {data.items.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/customer/orders/${order.id}`}
                className="card bg-base-100 border-base-300 hover:border-primary border transition-colors"
              >
                <div className="card-body flex-row flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-base-content/60 text-sm">
                      {formatDate(order.startDate)} - {formatDate(order.endDate)} &middot;{" "}
                      {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatMoney(order.totalAmount)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {data.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
