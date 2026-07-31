"use client";

import { use } from "react";
import { toast } from "sonner";
import { CheckCircle2, PackageCheck, PackageOpen } from "lucide-react";
import { useRentalDetail, useUpdateOrderStatus } from "@/hooks/use-rentals";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import { ApiClientError } from "@/lib/api-client";

const NEXT_ACTION: Record<
  string,
  | { label: string; status: "CONFIRMED" | "PICKED_UP" | "RETURNED"; icon: typeof CheckCircle2 }
  | undefined
> = {
  PLACED: { label: "Confirm Order", status: "CONFIRMED", icon: CheckCircle2 },
  PAID: { label: "Mark Picked Up", status: "PICKED_UP", icon: PackageOpen },
  PICKED_UP: { label: "Mark Returned", status: "RETURNED", icon: PackageCheck },
};

export default function ProviderOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useRentalDetail(id);
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) return <div className="skeleton h-96 w-full" />;
  if (!order) return <p>Order not found.</p>;

  const action = NEXT_ACTION[order.status];

  const handleAdvance = () => {
    if (!action) return;
    updateStatus.mutate(
      { id: order.id, status: action.status },
      {
        onError: (error) => {
          if (error instanceof ApiClientError) toast.error(error.message);
        },
      },
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-base-content/60 text-sm">Placed {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-4 md:col-span-2">
          <div className="card bg-base-100 border-base-300 border">
            <div className="card-body">
              <h2 className="mb-2 font-semibold">Items</h2>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="border-base-200 flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.gearItem?.name ?? "Gear item"}</p>
                    <p className="text-base-content/60 text-sm">
                      {item.quantity} x {formatMoney(item.pricePerDay)}/day x {item.days} days
                    </p>
                  </div>
                  <span className="font-medium">{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="card bg-base-100 border-base-300 border">
              <div className="card-body">
                <h2 className="mb-2 font-semibold">Delivery Address</h2>
                <p className="text-sm">{order.deliveryAddress}</p>
                {order.notes && (
                  <p className="text-base-content/60 mt-2 text-sm">Note: {order.notes}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="card bg-base-100 border-base-300 border">
            <div className="card-body">
              <h2 className="mb-2 font-semibold">Summary</h2>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span>Rental period</span>
                  <span>
                    {formatDate(order.startDate)} - {formatDate(order.endDate)}
                  </span>
                </div>
                <div className="border-base-300 mt-1 flex justify-between border-t pt-1 font-semibold">
                  <span>Total</span>
                  <span>{formatMoney(order.totalAmount)}</span>
                </div>
              </div>

              {action && (
                <button
                  className="btn btn-primary mt-4 w-full"
                  onClick={handleAdvance}
                  disabled={updateStatus.isPending}
                >
                  <action.icon className="size-4" />
                  {action.label}
                </button>
              )}
              {order.status === "CONFIRMED" && (
                <p className="text-base-content/50 mt-2 text-center text-xs">
                  Waiting for customer payment.
                </p>
              )}
            </div>
          </div>

          {order.customer && (
            <div className="card bg-base-100 border-base-300 border">
              <div className="card-body">
                <h2 className="mb-2 font-semibold">Customer</h2>
                <p className="text-sm font-medium">{order.customer.name}</p>
                <p className="text-base-content/60 text-sm">{order.customer.email}</p>
                {order.customer.phone && (
                  <p className="text-base-content/60 text-sm">{order.customer.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
