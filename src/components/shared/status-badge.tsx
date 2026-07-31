import type { RentalOrderStatus } from "@/types";

const STATUS_STYLES: Record<RentalOrderStatus, string> = {
  PLACED: "badge-warning",
  CONFIRMED: "badge-info",
  PAID: "badge-soft text-[oklch(55%_0.2_305)] border-[oklch(55%_0.2_305)]",
  PICKED_UP: "badge-success",
  RETURNED: "badge-neutral",
  CANCELLED: "badge-error",
};

const STATUS_LABELS: Record<RentalOrderStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked Up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: RentalOrderStatus }) {
  return <span className={`badge ${STATUS_STYLES[status]} badge-md`}>{STATUS_LABELS[status]}</span>;
}

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PENDING: "badge-warning",
  COMPLETED: "badge-success",
  FAILED: "badge-error",
  REFUNDED: "badge-neutral",
};

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${PAYMENT_STATUS_STYLES[status] ?? "badge-neutral"} badge-md`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
