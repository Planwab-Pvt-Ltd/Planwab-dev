import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              {i < 4 && <span className="text-gray-400">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Left Column (Images & Info) */}
          <div className="xl:col-span-2 space-y-6">
            <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse" />

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </div>
              <div className="space-y-6">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {[1, 2].map((col) => (
                    <div key={col} className="space-y-4">
                      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-12 w-full bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="space-y-6">
            <div className="xl:sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                  <div>
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section (Similar Items/Reviews) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Bottom Block */}
          <div>
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Bottom Block */}
          <div>
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="flex space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}