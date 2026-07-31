export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-64 w-full" />
    </div>
  );
}
