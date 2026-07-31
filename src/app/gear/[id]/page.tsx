import type { Metadata } from "next";
import { GearDetailClient } from "@/components/gear/gear-detail-client";
import { env } from "@/lib/env";
import type { ApiSuccess, GearItem } from "@/types";

async function fetchGear(id: string): Promise<GearItem | null> {
  try {
    const res = await fetch(`${env.API_URL}/gear/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json: ApiSuccess<GearItem> = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const gear = await fetchGear(id);

  if (!gear) return { title: "Gear not found" };

  return {
    title: gear.name,
    description: gear.description.slice(0, 160),
    openGraph: {
      title: gear.name,
      description: gear.description.slice(0, 160),
      images: gear.images[0] ? [gear.images[0]] : undefined,
    },
  };
}

export default async function GearDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GearDetailClient gearId={id} />;
}
