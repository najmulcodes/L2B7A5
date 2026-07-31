export default function GearDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="skeleton aspect-4/3 w-full" />
          <div className="skeleton mt-6 h-6 w-1/2" />
          <div className="skeleton mt-2 h-4 w-1/3" />
          <div className="skeleton mt-4 h-24 w-full" />
        </div>
        <div className="lg:col-span-2">
          <div className="skeleton h-80 w-full" />
        </div>
      </div>
    </div>
  );
}
