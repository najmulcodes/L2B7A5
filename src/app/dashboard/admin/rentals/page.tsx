"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Ban } from "lucide-react";
import { useAdminRentals, useForceCancelOrder } from "@/hooks/use-admin";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatDate, formatMoney } from "@/lib/format";
import { ApiClientError } from "@/lib/api-client";
import type { RentalOrderStatus } from "@/types";

export default function AdminRentalsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminRentals({ status, page, limit: 10 });
  const forceCancel = useForceCancelOrder();

  const handleCancel = (id: string) => {
    const reason = prompt("Reason for cancelling this order (required):");
    if (!reason || reason.trim().length < 3) {
      if (reason !== null) toast.error("Please provide a reason of at least 3 characters.");
      return;
    }
    forceCancel.mutate(
      { id, cancelReason: reason.trim() },
      {
        onError: (error) => {
          if (error instanceof ApiClientError) toast.error(error.message);
        },
      },
    );
  };

  const statuses: RentalOrderStatus[] = [
    "PLACED",
    "CONFIRMED",
    "PAID",
    "PICKED_UP",
    "RETURNED",
    "CANCELLED",
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Rental Orders</h1>

      <select
        className="select select-bordered mb-6"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

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
                  <th>Provider</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <tr key={order.id} className="hover:bg-base-200">
                    <td>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-base-content/50">
                        {formatDate(order.startDate)} - {formatDate(order.endDate)}
                      </p>
                    </td>
                    <td className="text-sm">{order.customer?.name ?? "-"}</td>
                    <td className="text-sm">
                      {order.provider?.businessName ?? order.provider?.name ?? "-"}
                    </td>
                    <td>{formatMoney(order.totalAmount)}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>
                      {order.status !== "RETURNED" && order.status !== "CANCELLED" && (
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          disabled={forceCancel.isPending}
                          onClick={() => handleCancel(order.id)}
                        >
                          <Ban className="size-3.5" /> Force Cancel
                        </button>
                      )}
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
