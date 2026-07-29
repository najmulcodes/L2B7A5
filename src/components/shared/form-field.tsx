import type { ReactNode } from "react";

export function FormField({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="fieldset">
      <label htmlFor={htmlFor} className="fieldset-legend text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-base-content/50 mt-1">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-error mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
