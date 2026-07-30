"use client";

import { useState } from "react";
import Link from "next/link";
import { useProviderOrders } from "@/hooks/use-rentals";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatDate, formatMoney } from "@/lib/format";
import type { RentalOrderStatus } from "@/types";

const STATUS_TABS: { value: RentalOrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PLACED", label: "New" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PAID", label: "Paid" },
  { value: "PICKED_UP", label: "Picked Up" },
  { value: "RETURNED", label: "Returned" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function ProviderOrdersPage() {
  const [status, setStatus] = useState<RentalOrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProviderOrders({
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="tabs tabs-box mb-6 w-fit flex-wrap">
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
        <EmptyState title="No orders found" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <tr key={order.id} className="hover:bg-base-200">
                    <td>
                      <Link
                        href={`/dashboard/provider/orders/${order.id}`}
                        className="link link-hover font-medium"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>{order.customer?.name ?? "-"}</td>
                    <td className="text-sm">
                      {formatDate(order.startDate)} - {formatDate(order.endDate)}
                    </td>
                    <td>{formatMoney(order.totalAmount)}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
