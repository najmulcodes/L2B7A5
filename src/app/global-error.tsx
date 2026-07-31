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
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <AlertTriangle className="text-error mx-auto mb-4 size-16" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-base-content/60 mt-2">
              An unexpected error occurred. You can try again, or head back home.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
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
