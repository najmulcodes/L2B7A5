"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { MapPin, Star, Loader2, ShieldCheck, CalendarDays } from "lucide-react";
import { useGearDetail } from "@/hooks/use-gear";
import { useGearReviews } from "@/hooks/use-reviews";
import { useCreateRental } from "@/hooks/use-rentals";
import { useAuthStore } from "@/store/auth-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { rentSchema } from "@/lib/validations/rental";
import type { RentFormValues } from "@/lib/validations/rental";
import { FormField } from "@/components/shared/form-field";
import { formatDate, formatMoney } from "@/lib/format";
import { ApiClientError } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function calculateDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function GearDetailClient({ gearId }: { gearId: string }) {
  const { data: gear, isLoading } = useGearDetail(gearId);
  const { data: reviews } = useGearReviews(gearId);
  const [activeImage, setActiveImage] = useState(0);
  const mounted = useIsMounted();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const createRental = useCreateRental(gearId);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<z.input<typeof rentSchema>, unknown, RentFormValues>({
    resolver: zodResolver(rentSchema),
    defaultValues: { quantity: 1 },
  });

  const [startDate, endDate, quantity] = watch(["startDate", "endDate", "quantity"]);
  const days = calculateDays(startDate, endDate);

  const totals = useMemo(() => {
    if (!gear || !days) return null;
    const qty = Number(quantity) || 1;
    const subtotal = parseFloat(gear.pricePerDay) * qty * days;
    const deposit = parseFloat(gear.securityDeposit) * qty;
    return { subtotal, deposit, total: subtotal + deposit, days };
  }, [gear, days, quantity]);

  if (isLoading) {
    return <div className="max-w-6xl mx-auto px-4 py-12 text-center">Loading gear...</div>;
  }

  if (!gear) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Gear not found</h1>
        <Link href="/gear" className="link link-primary mt-2 inline-block">
          Back to browse
        </Link>
      </div>
    );
  }

  const onSubmit = (values: RentFormValues) => {
    if (!user) {
      router.push(`/auth/login?next=/gear/${gearId}`);
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customer accounts can place rental orders.");
      return;
    }
    createRental.mutate(values, {
      onSuccess: (res) => {
        if (res.data) router.push(`/dashboard/customer/orders/${res.data.id}`);
      },
      onError: (error) => {
        if (error instanceof ApiClientError) {
          const fieldErrors = error.fieldErrors();
          for (const [field, message] of Object.entries(fieldErrors)) {
            setError(field as keyof RentFormValues, { message });
          }
          if (Object.keys(fieldErrors).length === 0) {
            toast.error(error.message);
          }
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Gallery + details */}
        <div className="lg:col-span-3">
          <div className="relative aspect-4/3 bg-base-200 rounded-box overflow-hidden">
            {gear.images[activeImage] ? (
              <Image
                src={gear.images[activeImage]!}
                alt={gear.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-base-content/30">
                No image
              </div>
            )}
          </div>
          {gear.images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {gear.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative size-16 shrink-0 rounded-field overflow-hidden border-2 ${
                    i === activeImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            {gear.category && (
              <Link href={`/gear?categoryId=${gear.category.id}`} className="badge badge-outline">
                {gear.category.name}
              </Link>
            )}
            <h1 className="text-2xl font-bold mt-2">{gear.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-base-content/60">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" /> {gear.location}
              </span>
              {gear.reviewCount > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-warning text-warning" /> {gear.avgRating.toFixed(1)}{" "}
                  ({gear.reviewCount} reviews)
                </span>
              )}
              <span className="badge badge-ghost">{gear.condition.replace("_", " ")}</span>
            </div>

            <p className="mt-4 text-base-content/80 whitespace-pre-line">{gear.description}</p>

            {gear.specifications && Object.keys(gear.specifications).length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Specifications</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(gear.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-base-200 py-1">
                      <dt className="text-base-content/60 capitalize">{key}</dt>
                      <dd className="font-medium">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {gear.provider && (
              <div className="mt-6 p-4 rounded-box border border-base-300 flex items-center gap-3">
                <div className="avatar avatar-placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-10">
                    <span>{gear.provider.name.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">{gear.provider.businessName ?? gear.provider.name}</p>
                  <p className="text-xs text-base-content/60 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> Verified provider
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Reviews ({reviews?.length ?? 0})</h3>
              {!reviews?.length ? (
                <p className="text-sm text-base-content/50">No reviews yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-base-200 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {review.customer?.name ?? "Anonymous"}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3.5 ${
                                i < review.rating
                                  ? "fill-warning text-warning"
                                  : "text-base-content/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-base-content/70 mt-1">{review.comment}</p>
                      )}
                      <p className="text-xs text-base-content/40 mt-1">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rent form */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 border border-base-300 shadow-sm sticky top-20">
            <div className="card-body">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatMoney(gear.pricePerDay)}
                  <span className="text-sm font-normal text-base-content/60">/day</span>
                </span>
                <span
                  className={`badge ${gear.quantityAvailable > 0 ? "badge-success" : "badge-error"}`}
                >
                  {gear.quantityAvailable > 0
                    ? `${gear.quantityAvailable} available`
                    : "Unavailable"}
                </span>
              </div>

              {!mounted ? null : gear.quantityAvailable === 0 ? (
                <p className="text-sm text-base-content/60 mt-4">
                  This gear is fully booked right now. Check back later.
                </p>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-2" noValidate>
                  <FormField label="Quantity" htmlFor="quantity" error={errors.quantity?.message}>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={gear.quantityAvailable}
                      className="input input-bordered w-full"
                      {...register("quantity")}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      label="Start date"
                      htmlFor="startDate"
                      error={errors.startDate?.message}
                    >
                      <input
                        id="startDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="input input-bordered w-full"
                        {...register("startDate")}
                      />
                    </FormField>
                    <FormField label="End date" htmlFor="endDate" error={errors.endDate?.message}>
                      <input
                        id="endDate"
                        type="date"
                        min={startDate || new Date().toISOString().split("T")[0]}
                        className="input input-bordered w-full"
                        {...register("endDate")}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Delivery address (optional)"
                    htmlFor="deliveryAddress"
                    error={errors.deliveryAddress?.message}
                  >
                    <input
                      id="deliveryAddress"
                      className="input input-bordered w-full"
                      placeholder="Where should the gear be delivered?"
                      {...register("deliveryAddress")}
                    />
                  </FormField>

                  <FormField label="Notes (optional)" htmlFor="notes" error={errors.notes?.message}>
                    <textarea
                      id="notes"
                      className="textarea textarea-bordered w-full"
                      rows={2}
                      {...register("notes")}
                    />
                  </FormField>

                  {totals && (
                    <div className="bg-base-200 rounded-box p-3 text-sm flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-1 text-base-content/60 mb-1">
                        <CalendarDays className="size-3.5" />
                        {totals.days} day{totals.days > 1 ? "s" : ""}
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatMoney(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security deposit</span>
                        <span>{formatMoney(totals.deposit)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t border-base-300 pt-1 mt-1">
                        <span>Total</span>
                        <span>{formatMoney(totals.total)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary mt-2"
                    disabled={createRental.isPending}
                  >
                    {createRental.isPending && <Loader2 className="size-4 animate-spin" />}
                    {!mounted || user ? "Request to Rent" : "Log in to Rent"}
                  </button>
                  <p className="text-xs text-base-content/50 text-center">
                    You won&apos;t be charged yet - payment happens after the provider confirms.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
