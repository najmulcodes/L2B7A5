export function formatMoney(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("BDT", "৳");
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
    date,
  );
}
