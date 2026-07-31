"use client";

import Link from "next/link";
import { Package, ClipboardList, Plus } from "lucide-react";
import { useMyGear } from "@/hooks/use-gear";
import { useProviderOrders } from "@/hooks/use-rentals";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatMoney } from "@/lib/format";

export default function ProviderDashboardPage() {
  const { data: gear } = useMyGear({ limit: 1 });
  const { data: orders, isLoading: ordersLoading } = useProviderOrders({ limit: 5 });
  const pendingCount = orders?.items.filter((o) => o.status === "PLACED").length ?? 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <Link href="/dashboard/provider/gear/new" className="btn btn-primary btn-sm">
          <Plus className="size-4" /> List New Gear
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="stat bg-base-100 border-base-300 rounded-box border">
          <div className="stat-figure text-primary">
            <Package className="size-6" />
          </div>
          <div className="stat-title">Gear Listed</div>
          <div className="stat-value text-2xl">{gear?.meta?.total ?? "-"}</div>
        </div>
        <div className="stat bg-base-100 border-base-300 rounded-box border">
          <div className="stat-figure text-primary">
            <ClipboardList className="size-6" />
          </div>
          <div className="stat-title">Total Orders</div>
          <div className="stat-value text-2xl">{orders?.meta?.total ?? "-"}</div>
        </div>
        <div className="stat bg-base-100 border-base-300 rounded-box border">
          <div className="stat-title">Awaiting Confirmation</div>
          <div className="stat-value text-warning text-2xl">{pendingCount}</div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent orders</h2>
        <Link href="/dashboard/provider/orders" className="link link-primary text-sm">
          View all
        </Link>
      </div>

      {ordersLoading ? (
        <div className="skeleton h-40 w-full" />
      ) : !orders?.items.length ? (
        <p className="text-base-content/60 text-sm">No orders yet.</p>
      ) : (
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
              {orders.items.map((order) => (
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
      )}
    </div>
  );
}
