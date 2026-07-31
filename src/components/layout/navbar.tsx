"use client";

import Link from "next/link";
import { Backpack, LayoutDashboard, LogOut, Menu, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useIsMounted } from "@/hooks/use-is-mounted";

function dashboardPath(role: string): string {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "PROVIDER") return "/dashboard/provider";
  return "/dashboard/customer";
}

export function Navbar() {
  const mounted = useIsMounted();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const logout = useLogout();
  useCurrentUser();

  // Avoid a hydration mismatch: server-rendered markup never knows about
  // the client-only auth cookie, so the auth-dependent UI only renders
  // once mounted on the client.
  const showAuthUi = mounted && isHydrated;

  return (
    <div className="navbar bg-base-100 border-base-300 sticky top-0 z-40 border-b px-4 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Open menu">
            <Menu className="size-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box border-base-300 z-50 mt-3 w-56 border p-2 shadow-lg"
          >
            <li>
              <Link href="/gear">Browse Gear</Link>
            </li>
            {showAuthUi && user ? (
              <>
                <li>
                  <Link href={dashboardPath(user.role)}>Dashboard</Link>
                </li>
                <li>
                  <button onClick={logout}>Log out</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login">Log in</Link>
                </li>
                <li>
                  <Link href="/auth/register">Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost gap-2 px-2 text-xl">
          <Backpack className="text-primary size-6" />
          <span className="font-bold">GearUp</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          <li>
            <Link href="/gear">Browse Gear</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {!showAuthUi ? (
          <div className="skeleton rounded-field h-9 w-24" />
        ) : user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost gap-2">
              <UserIcon className="size-4" />
              <span className="hidden max-w-[10rem] truncate sm:inline">
                {user.name || user.email}
              </span>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box border-base-300 z-50 mt-3 w-52 border p-2 shadow-lg"
            >
              <li>
                <Link href={dashboardPath(user.role)}>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={logout}>
                  <LogOut className="size-4" />
                  Log out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/auth/login" className="btn btn-ghost hidden sm:inline-flex">
              Log in
            </Link>
            <Link href="/auth/register" className="btn btn-primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
