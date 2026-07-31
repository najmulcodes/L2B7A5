export default function GearLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="skeleton h-96 shrink-0 md:w-64" />
        <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton aspect-4/3" />
          ))}
        </div>
      </div>
    </div>
  );
}
