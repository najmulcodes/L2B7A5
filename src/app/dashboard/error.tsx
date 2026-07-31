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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="text-error mb-3 size-12" />
      <h2 className="text-lg font-semibold">Something went wrong loading this page</h2>
      <p className="text-base-content/60 mt-1 max-w-sm text-sm">{error.message}</p>
      <button onClick={reset} className="btn btn-primary btn-sm mt-4">
        Try Again
      </button>
    </div>
  );
}
