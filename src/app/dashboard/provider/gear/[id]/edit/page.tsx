"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GearForm } from "@/components/gear/gear-form";
import { useGearDetail, useUpdateGear, useDeleteGear } from "@/hooks/use-gear";
import { ApiClientError } from "@/lib/api-client";
import type { GearFormValues } from "@/lib/validations/gear";
import { Trash2 } from "lucide-react";

export default function EditGearPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  // Uses the public detail endpoint, which only serves active gear - editing
  // a deactivated listing isn't supported from this page. Acceptable for
  // this assignment's scope; see README for the same class of tradeoff
  // documented on the backend.
  const { data: gear, isLoading } = useGearDetail(id);
  const updateGear = useUpdateGear(id);
  const deleteGear = useDeleteGear();

  const handleSubmit = (values: GearFormValues) => {
    updateGear.mutate(values, {
      onSuccess: () => router.push("/dashboard/provider/gear"),
      onError: (error) => {
        if (error instanceof ApiClientError) toast.error(error.message);
      },
    });
  };

  const handleDelete = () => {
    if (!confirm("Remove this gear listing? It will no longer be bookable.")) return;
    deleteGear.mutate(id, {
      onSuccess: () => router.push("/dashboard/provider/gear"),
    });
  };

  if (isLoading) return <div className="skeleton h-96 w-full max-w-2xl" />;
  if (!gear) return <p>Gear not found or no longer active.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 max-w-2xl">
        <h1 className="text-2xl font-bold">Edit Gear</h1>
        <button className="btn btn-outline btn-error btn-sm" onClick={handleDelete}>
          <Trash2 className="size-4" /> Remove Listing
        </button>
      </div>
      <GearForm
        defaultValues={{
          categoryId: gear.categoryId,
          name: gear.name,
          description: gear.description,
          brand: gear.brand ?? "",
          images: gear.images.map((value) => ({ value })),
          pricePerDay: gear.pricePerDay,
          securityDeposit: gear.securityDeposit,
          quantityTotal: gear.quantityTotal,
          condition: gear.condition,
          location: gear.location,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateGear.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
