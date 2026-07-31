import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <Compass className="text-base-content/20 mx-auto mb-4 size-16" />
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-base-content/60 mt-2">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
