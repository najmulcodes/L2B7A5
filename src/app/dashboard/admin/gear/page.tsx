"use client";

import { useState } from "react";
import Image from "next/image";
import { useAdminGear } from "@/hooks/use-admin";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatMoney } from "@/lib/format";

export default function AdminGearPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminGear({ page, limit: 12 });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gear Oversight</h1>

      {isLoading ? (
        <div className="skeleton h-64 w-full" />
      ) : !data?.items.length ? (
        <EmptyState title="No gear listed yet" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Provider</th>
                  <th>Price/day</th>
                  <th>Available</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-base-200">
                    <td>
                      <div className="relative size-10 rounded overflow-hidden bg-base-200">
                        {item.images[0] && (
                          <Image src={item.images[0]} alt="" fill className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="font-medium">{item.name}</td>
                    <td className="text-sm">
                      {item.provider?.businessName ?? item.provider?.name ?? "-"}
                    </td>
                    <td>{formatMoney(item.pricePerDay)}</td>
                    <td>
                      {item.quantityAvailable}/{item.quantityTotal}
                    </td>
                    <td>
                      <span className={`badge ${item.isActive ? "badge-success" : "badge-ghost"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
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
