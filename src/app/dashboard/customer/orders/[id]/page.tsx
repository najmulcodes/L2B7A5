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

export default function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="border-base-200 flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <Link
                        href={`/gear/${item.gearItemId}`}
                        className="link link-hover font-medium"
                      >
                        {item.gearItem?.name ?? "Gear item"}
                      </Link>
                      <p className="text-base-content/60 text-sm">
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
            <div className="card bg-base-100 border-base-300 border">
              <div className="card-body">
                <h2 className="mb-2 flex items-center gap-2 font-semibold">
                  <MapPin className="size-4" /> Delivery Address
                </h2>
                <p className="text-sm">{order.deliveryAddress}</p>
                {order.notes && (
                  <p className="text-base-content/60 mt-2 text-sm">Note: {order.notes}</p>
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
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit</span>
                  <span>{formatMoney(order.depositTotal)}</span>
                </div>
                <div className="border-base-300 mt-1 flex justify-between border-t pt-1 font-semibold">
                  <span>Total</span>
                  <span>{formatMoney(order.totalAmount)}</span>
                </div>
              </div>

              {order.status === "CONFIRMED" && (
                <button
                  className="btn btn-primary mt-4 w-full"
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
                  className="btn btn-outline btn-error mt-4 w-full"
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
            <div className="card bg-base-100 border-base-300 border">
              <div className="card-body">
                <h2 className="mb-2 font-semibold">Provider</h2>
                <p className="text-sm font-medium">
                  {order.provider.businessName ?? order.provider.name}
                </p>
                {order.provider.phone && (
                  <p className="text-base-content/60 text-sm">{order.provider.phone}</p>
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
