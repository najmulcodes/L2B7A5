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
      className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow overflow-hidden group"
    >
      <figure className="relative aspect-4/3 bg-base-200">
        {image ? (
          <Image
            src={image}
            alt={gear.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-base-content/30 text-sm">
            No image
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-base-100/70 flex items-center justify-center">
            <span className="badge badge-error">Unavailable</span>
          </div>
        )}
        {gear.category && (
          <span className="badge badge-sm absolute top-2 left-2 bg-base-100/90 border-0">
            {gear.category.name}
          </span>
        )}
      </figure>
      <div className="card-body p-4 gap-1">
        <h3 className="font-semibold leading-snug line-clamp-1">{gear.name}</h3>
        <div className="flex items-center gap-1 text-sm text-base-content/60">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">{gear.location}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">
            {formatMoney(gear.pricePerDay)}
            <span className="text-xs font-normal text-base-content/60">/day</span>
          </span>
          {gear.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="size-3.5 fill-warning text-warning" />
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
    <div className="card bg-base-100 border border-base-300 overflow-hidden">
      <div className="aspect-4/3 skeleton rounded-none" />
      <div className="card-body p-4 gap-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-5 w-1/3 mt-2" />
      </div>
    </div>
  );
}
