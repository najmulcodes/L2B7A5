"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
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
    <html lang="en" data-theme="gearup">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="size-16 text-error mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-base-content/60 mt-2">
              An unexpected error occurred. You can try again, or head back home.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={reset} className="btn btn-primary">
                Try Again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error replaces the root layout itself; Link's router context isn't reliably available here */}
              <a href="/" className="btn btn-outline">
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
