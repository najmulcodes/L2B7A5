import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="text-base-content/60 flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="size-3.5" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-base-content font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
