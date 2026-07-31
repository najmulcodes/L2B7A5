"use client";

import Link from "next/link";
import { Users, Boxes, ListChecks } from "lucide-react";
import { useAdminUsers, useAdminGear, useAdminRentals } from "@/hooks/use-admin";

export default function AdminDashboardPage() {
  const { data: users } = useAdminUsers({ limit: 1 });
  const { data: gear } = useAdminGear({ limit: 1 });
  const { data: rentals } = useAdminRentals({ limit: 1 });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/dashboard/admin/users"
          className="stat bg-base-100 border border-base-300 rounded-box hover:border-primary transition-colors"
        >
          <div className="stat-figure text-primary">
            <Users className="size-6" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-2xl">{users?.meta?.total ?? "-"}</div>
        </Link>
        <Link
          href="/dashboard/admin/gear"
          className="stat bg-base-100 border border-base-300 rounded-box hover:border-primary transition-colors"
        >
          <div className="stat-figure text-primary">
            <Boxes className="size-6" />
          </div>
          <div className="stat-title">Gear Listings</div>
          <div className="stat-value text-2xl">{gear?.meta?.total ?? "-"}</div>
        </Link>
        <Link
          href="/dashboard/admin/rentals"
          className="stat bg-base-100 border border-base-300 rounded-box hover:border-primary transition-colors"
        >
          <div className="stat-figure text-primary">
            <ListChecks className="size-6" />
          </div>
          <div className="stat-title">Rental Orders</div>
          <div className="stat-value text-2xl">{rentals?.meta?.total ?? "-"}</div>
        </Link>
      </div>

      <p className="text-sm text-base-content/60">
        Use the sidebar to manage users, oversee gear listings, and review rental orders
        platform-wide.
      </p>
    </div>
  );
}
