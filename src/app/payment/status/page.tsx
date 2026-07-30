import { Suspense } from "react";
import { PaymentResultClient } from "@/components/payments/payment-result-client";

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="text-center py-24">Loading...</div>}>
      <PaymentResultClient />
    </Suspense>
  );
}
