"use client";

import Link from "next/link";
import { useMyRentals } from "@/hooks/use-rentals";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatMoney } from "@/lib/format";
import { ClipboardList } from "lucide-react";

export default function CustomerDashboardPage() {
  const { data, isLoading } = useMyRentals({ limit: 5 });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Dashboard</h1>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent orders</h2>
        <Link href="/dashboard/customer/orders" className="link link-primary text-sm">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="skeleton h-40 w-full" />
      ) : !data?.items.length ? (
        <EmptyState
          icon={<ClipboardList className="size-14" />}
          title="No orders yet"
          description="Browse gear and place your first rental order."
          action={
            <Link href="/gear" className="btn btn-primary btn-sm">
              Browse Gear
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
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
                      href={`/dashboard/customer/orders/${order.id}`}
                      className="link link-hover font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
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
      )}
    </div>
  );
}
