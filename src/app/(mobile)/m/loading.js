export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-0 mx-auto max-w-md overflow-hidden">
      {/* 1. Hero Section Skeleton (Matches h-[55vh]) */}
      <div className="relative h-[55vh] w-full bg-gray-200 animate-pulse">
        {/* Optional: Icon placeholder in center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-16 h-16 bg-gray-400 rounded-full" />
        </div>
      </div>

      {/* 2. Ticker Strip Skeleton */}
      <div className="w-full h-10 bg-gray-900 flex items-center justify-between px-4">
        <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-40 bg-gray-800 rounded animate-pulse" />
      </div>

      {/* 3. Static Banner 1 Skeleton */}
      <div className="mx-3 mt-4 px-1">
        <div className="w-full h-24 rounded-xl bg-gray-200 animate-pulse" />
      </div>

      {/* 4. Categories Grid Skeleton */}
      {/* Simulating a 4x2 grid typical for mobile categories */}
      <div className="grid grid-cols-4 gap-y-6 gap-x-4 p-4 mt-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-10 h-2 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* 5. Top Planners Carousel Skeleton */}
      <div className="pl-4 py-4">
        {/* Section Title */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
        
        {/* Horizontal Cards */}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="min-w-[280px] h-[320px] rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden shrink-0"
            >
              {/* Image area */}
              <div className="h-48 w-full bg-gray-200 animate-pulse" />
              {/* Content area */}
              <div className="p-3 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="flex justify-between">
                   <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
                   <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Static Banner 2 Skeleton (Large Vertical) */}
      <div className="mx-3 mb-6">
        <div className="w-full aspect-[1/1.1] rounded-xl bg-gray-200 animate-pulse" />
      </div>

      {/* 7. Most Booked Skeleton */}
      <div className="px-4 mb-6">
         <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
         <div className="w-full h-[240px] bg-gray-200 rounded-xl animate-pulse" />
      </div>

      {/* 8. Static Banner 3 Skeleton (Horizontal) */}
      <div className="mx-3 mb-6">
        <div className="w-full aspect-[4/2.3] rounded-xl bg-gray-200 animate-pulse" />
      </div>

       {/* 9. Trending Vendors Skeleton */}
       <div className="pl-4 py-2">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] h-[250px] rounded-xl bg-gray-200 animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}