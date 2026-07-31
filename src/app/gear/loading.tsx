export default function GearLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0 skeleton h-96" />
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton aspect-4/3" />
          ))}
        </div>
      </div>
    </div>
  );
}
