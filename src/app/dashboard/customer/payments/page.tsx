"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyPayments } from "@/hooks/use-payments";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatDateTime, formatMoney } from "@/lib/format";
import { CreditCard } from "lucide-react";

export default function CustomerPaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPayments({ page, limit: 10 });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Payment History</h1>

      {isLoading ? (
        <div className="skeleton h-64 w-full" />
      ) : !data?.items.length ? (
        <EmptyState icon={<CreditCard className="size-14" />} title="No payments yet" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Order</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((payment) => (
                  <tr key={payment.id} className="hover:bg-base-200">
                    <td className="font-mono text-xs">{payment.transactionId}</td>
                    <td>
                      {payment.rentalOrder ? (
                        <Link
                          href={`/dashboard/customer/orders/${payment.rentalOrderId}`}
                          className="link link-hover"
                        >
                          {payment.rentalOrder.orderNumber}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{payment.method ?? "-"}</td>
                    <td>{formatMoney(payment.amount)}</td>
                    <td>
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="text-base-content/60 text-sm">
                      {payment.paidAt ? formatDateTime(payment.paidAt) : "-"}
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
