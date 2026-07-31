import { Suspense } from "react";
import type { Metadata } from "next";
import { GearBrowseClient } from "@/components/gear/gear-browse-client";

export const metadata: Metadata = {
  title: "Browse Gear",
};

export default function GearBrowsePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8">Loading...</div>}>
      <GearBrowseClient />
    </Suspense>
  );
}
