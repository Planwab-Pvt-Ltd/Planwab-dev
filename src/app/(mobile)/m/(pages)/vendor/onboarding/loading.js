// app/(mobile)/m/(pages)/vendor/onboarding/loading.js
"use client";

export default function VendorOnboardingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 animate-pulse">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </header>

      {/* Progress Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="relative flex items-start justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center" style={{ width: "80px" }}>
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                  <div className="mt-2 h-3 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 px-8 py-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-300 dark:bg-slate-600 rounded-3xl mb-6" />
              <div className="h-8 w-72 bg-slate-300 dark:bg-slate-600 rounded-lg mb-3" />
              <div className="h-4 w-80 bg-slate-300 dark:bg-slate-600 rounded" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-6" />
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Link Preview Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-52 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="flex-1 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="w-20 h-9 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
          <div className="mt-3 h-3 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </main>

      {/* Footer Skeleton */}
      <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-end">
            <div className="h-12 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Shimmer Overlay */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-pulse > * {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}