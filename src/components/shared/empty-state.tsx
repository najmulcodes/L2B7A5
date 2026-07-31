import type { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="text-base-content/30 mb-4">{icon ?? <PackageOpen className="size-14" />}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-base-content/60 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
