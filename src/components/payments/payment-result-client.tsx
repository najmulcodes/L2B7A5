"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useConfirmPayment } from "@/hooks/use-payments";
import type { Payment } from "@/types";

/**
 * Always re-verifies with the backend rather than trusting the `outcome`
 * query param from the redirect - that's just SSLCommerz's own claim
 * carried through a browser redirect, which is not a trustworthy source
 * of truth on its own. The backend's /payments/confirm independently
 * re-validates with SSLCommerz's servers (see payment.service.ts) before
 * reporting a final status.
 */
export function PaymentResultClient() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const outcome = searchParams.get("outcome");
  const confirmPayment = useConfirmPayment();
  const attempted = useRef(false);
  const [result, setResult] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attempted.current || !transactionId) return;
    attempted.current = true;
    confirmPayment.mutate(transactionId, {
      onSuccess: (res) => setResult(res.data ?? null),
      onError: () => setError("Could not verify this payment. Please check your order status."),
    });
    // confirmPayment is a new object each render (TanStack Query mutation) -
    // only transactionId should re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const isVerifying = confirmPayment.isPending || (!result && !error && transactionId);

  if (!transactionId || outcome === "cancel") {
    return (
      <ResultShell
        icon={<XCircle className="text-warning size-16" />}
        title="Payment Cancelled"
        message="You cancelled the payment. No charge was made. You can try again from your order."
      />
    );
  }

  if (isVerifying) {
    return (
      <ResultShell
        icon={<Loader2 className="text-primary size-16 animate-spin" />}
        title="Verifying your payment..."
        message="Please wait while we confirm this transaction with the payment gateway."
      />
    );
  }

  if (error || result?.status === "FAILED") {
    return (
      <ResultShell
        icon={<XCircle className="text-error size-16" />}
        title="Payment Failed"
        message={error ?? "This payment could not be completed. Please try again."}
      />
    );
  }

  if (result?.status === "COMPLETED") {
    return (
      <ResultShell
        icon={<CheckCircle2 className="text-success size-16" />}
        title="Payment Successful"
        message={`Your payment of ${result.amount} ${result.currency} was confirmed. Your order status has been updated to PAID.`}
        orderId={result.rentalOrderId}
      />
    );
  }

  return (
    <ResultShell
      icon={<Loader2 className="text-primary size-16 animate-spin" />}
      title="Processing"
      message="Your payment is still being processed by the gateway. Check your order in a moment."
    />
  );
}

function ResultShell({
  icon,
  title,
  message,
  orderId,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  orderId?: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="card bg-base-100 border-base-300 w-full max-w-md border shadow-lg">
        <div className="card-body items-center text-center">
          {icon}
          <h1 className="mt-2 text-xl font-bold">{title}</h1>
          <p className="text-base-content/60 mt-1 text-sm">{message}</p>
          <div className="mt-4 flex gap-2">
            {orderId && (
              <Link href={`/dashboard/customer/orders/${orderId}`} className="btn btn-primary">
                View Order
              </Link>
            )}
            <Link href="/dashboard/customer/orders" className="btn btn-outline">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
