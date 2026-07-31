import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { GearItem } from "@/types";
import { formatMoney } from "@/lib/format";

export function GearCard({ gear }: { gear: GearItem }) {
  const image = gear.images[0];
  const isAvailable = gear.quantityAvailable > 0;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="card bg-base-100 border-base-300 group overflow-hidden border transition-shadow hover:shadow-lg"
    >
      <figure className="bg-base-200 relative aspect-4/3">
        {image ? (
          <Image
            src={image}
            alt={gear.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-base-content/30 flex h-full items-center justify-center text-sm">
            No image
          </div>
        )}
        {!isAvailable && (
          <div className="bg-base-100/70 absolute inset-0 flex items-center justify-center">
            <span className="badge badge-error">Unavailable</span>
          </div>
        )}
        {gear.category && (
          <span className="badge badge-sm bg-base-100/90 absolute top-2 left-2 border-0">
            {gear.category.name}
          </span>
        )}
      </figure>
      <div className="card-body gap-1 p-4">
        <h3 className="line-clamp-1 leading-snug font-semibold">{gear.name}</h3>
        <div className="text-base-content/60 flex items-center gap-1 text-sm">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">{gear.location}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-primary text-lg font-bold">
            {formatMoney(gear.pricePerDay)}
            <span className="text-base-content/60 text-xs font-normal">/day</span>
          </span>
          {gear.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="fill-warning text-warning size-3.5" />
              <span>{gear.avgRating.toFixed(1)}</span>
              <span className="text-base-content/50">({gear.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function GearCardSkeleton() {
  return (
    <div className="card bg-base-100 border-base-300 overflow-hidden border">
      <div className="skeleton aspect-4/3 rounded-none" />
      <div className="card-body gap-2 p-4">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton mt-2 h-5 w-1/3" />
      </div>
    </div>
  );
}
