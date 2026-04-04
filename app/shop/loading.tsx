export default function ShopLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="h-8 w-24 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
