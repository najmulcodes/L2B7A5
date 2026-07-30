"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CreditCard, XCircle, Star, MapPin, Loader2 } from "lucide-react";
import { useRentalDetail, useCancelRental } from "@/hooks/use-rentals";
import { useCreatePayment } from "@/hooks/use-payments";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import { ApiClientError } from "@/lib/api-client";
import { ReviewModal } from "@/components/reviews/review-modal";

export default function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading } = useRentalDetail(id);
  const createPayment = useCreatePayment();
  const cancelOrder = useCancelRental();
  const [reviewingGearId, setReviewingGearId] = useState<string | null>(null);

  if (isLoading) return <div className="skeleton h-96 w-full" />;
  if (!order) return <p>Order not found.</p>;

  const handlePay = () => {
    createPayment.mutate(order.id, {
      onSuccess: (res) => {
        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        }
      },
      onError: (error) => {
        if (error instanceof ApiClientError) toast.error(error.message);
      },
    });
  };

  const handleCancel = () => {
    if (!confirm("Cancel this order? This cannot be undone.")) return;
    cancelOrder.mutate(
      { id: order.id, cancelReason: "Cancelled by customer" },
      {
        onError: (error) => {
          if (error instanceof ApiClientError) toast.error(error.message);
        },
      },
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-base-content/60">Placed {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h2 className="font-semibold mb-2">Items</h2>
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-base-200 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <Link
                        href={`/gear/${item.gearItemId}`}
                        className="font-medium link link-hover"
                      >
                        {item.gearItem?.name ?? "Gear item"}
                      </Link>
                      <p className="text-sm text-base-content/60">
                        {item.quantity} x {formatMoney(item.pricePerDay)}/day x {item.days} days
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatMoney(item.lineTotal)}</span>
                      {order.status === "RETURNED" && (
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => setReviewingGearId(item.gearItemId)}
                        >
                          <Star className="size-3.5" /> Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="size-4" /> Delivery Address
                </h2>
                <p className="text-sm">{order.deliveryAddress}</p>
                {order.notes && (
                  <p className="text-sm text-base-content/60 mt-2">Note: {order.notes}</p>
                )}
              </div>
            </div>
          )}

          {order.cancelReason && (
            <div role="alert" className="alert alert-error">
              <span>Cancelled: {order.cancelReason}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h2 className="font-semibold mb-2">Summary</h2>
              <div className="text-sm flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Rental period</span>
                  <span>
                    {formatDate(order.startDate)} - {formatDate(order.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit</span>
                  <span>{formatMoney(order.depositTotal)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-base-300 pt-1 mt-1">
                  <span>Total</span>
                  <span>{formatMoney(order.totalAmount)}</span>
                </div>
              </div>

              {order.status === "CONFIRMED" && (
                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={handlePay}
                  disabled={createPayment.isPending}
                >
                  {createPayment.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CreditCard className="size-4" />
                  )}
                  Pay Now
                </button>
              )}

              {order.status === "PLACED" && (
                <button
                  className="btn btn-outline btn-error w-full mt-4"
                  onClick={handleCancel}
                  disabled={cancelOrder.isPending}
                >
                  <XCircle className="size-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {order.provider && (
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <h2 className="font-semibold mb-2">Provider</h2>
                <p className="text-sm font-medium">
                  {order.provider.businessName ?? order.provider.name}
                </p>
                {order.provider.phone && (
                  <p className="text-sm text-base-content/60">{order.provider.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {reviewingGearId && (
        <ReviewModal
          gearItemId={reviewingGearId}
          rentalOrderId={order.id}
          onClose={() => setReviewingGearId(null)}
        />
      )}
    </div>
  );
}
