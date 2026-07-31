import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <Compass className="size-16 text-base-content/20 mx-auto mb-4" />
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
