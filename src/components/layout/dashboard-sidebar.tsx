"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Boxes,
  ListChecks,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/provider/gear", label: "My Gear", icon: Package },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ClipboardList },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/gear", label: "Gear Oversight", icon: Boxes },
    { href: "/dashboard/admin/rentals", label: "All Rentals", icon: ListChecks },
  ],
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const items = user ? NAV_BY_ROLE[user.role] : undefined;

  if (!items) return null;

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <ul className="menu bg-base-100 rounded-box border border-base-300 lg:sticky lg:top-20 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} className={active ? "active" : ""}>
                <Icon className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
