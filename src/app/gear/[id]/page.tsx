import { GearDetailClient } from "@/components/gear/gear-detail-client";

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GearDetailClient gearId={id} />;
}
