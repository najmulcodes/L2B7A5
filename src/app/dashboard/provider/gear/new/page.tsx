"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GearForm } from "@/components/gear/gear-form";
import { useCreateGear } from "@/hooks/use-gear";
import { ApiClientError } from "@/lib/api-client";
import type { GearFormValues } from "@/lib/validations/gear";

export default function NewGearPage() {
  const router = useRouter();
  const createGear = useCreateGear();

  const handleSubmit = (values: GearFormValues) => {
    createGear.mutate(values, {
      onSuccess: (res) => {
        if (res.data) router.push(`/dashboard/provider/gear`);
      },
      onError: (error) => {
        if (error instanceof ApiClientError) toast.error(error.message);
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">List New Gear</h1>
      <GearForm onSubmit={handleSubmit} isSubmitting={createGear.isPending} submitLabel="List Gear" />
    </div>
  );
}
