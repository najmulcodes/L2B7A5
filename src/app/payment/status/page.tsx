import { Suspense } from "react";
import { PaymentResultClient } from "@/components/payments/payment-result-client";

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
      <PaymentResultClient />
    </Suspense>
  );
}
