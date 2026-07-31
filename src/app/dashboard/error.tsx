"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <AlertTriangle className="size-12 text-error mb-3" />
      <h2 className="text-lg font-semibold">Something went wrong loading this page</h2>
      <p className="text-base-content/60 text-sm mt-1 max-w-sm">{error.message}</p>
      <button onClick={reset} className="btn btn-primary btn-sm mt-4">
        Try Again
      </button>
    </div>
  );
}
