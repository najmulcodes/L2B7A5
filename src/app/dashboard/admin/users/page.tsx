"use client";

import { useState } from "react";
import { Ban, CheckCircle, Search } from "lucide-react";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/use-admin";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { formatDate } from "@/lib/format";

export default function AdminUsersPage() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ role, status, search, page, limit: 10 });
  const updateStatus = useUpdateUserStatus();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <label className="input input-bordered flex items-center gap-2">
          <Search className="text-base-content/40 size-4" />
          <input
            className="grow"
            placeholder="Search name or email"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(e.currentTarget.value);
                setPage(1);
              }
            }}
          />
        </label>
        <select
          className="select select-bordered"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="PROVIDER">Provider</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          className="select select-bordered"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <div className="skeleton h-64 w-full" />
      ) : !data?.items.length ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((user) => (
                  <tr key={user.id} className="hover:bg-base-200">
                    <td>{user.name}</td>
                    <td className="text-sm">{user.email}</td>
                    <td>
                      <span className="badge badge-ghost">{user.role}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${user.status === "ACTIVE" ? "badge-success" : "badge-error"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="text-base-content/60 text-sm">{formatDate(user.createdAt)}</td>
                    <td>
                      {user.role !== "ADMIN" && (
                        <button
                          className={`btn btn-xs ${user.status === "ACTIVE" ? "btn-outline btn-error" : "btn-outline btn-success"}`}
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              id: user.id,
                              status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                            })
                          }
                        >
                          {user.status === "ACTIVE" ? (
                            <>
                              <Ban className="size-3.5" /> Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle className="size-3.5" /> Activate
                            </>
                          )}
                        </button>
                      )}
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
