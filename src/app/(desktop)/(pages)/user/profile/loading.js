import React from "react";

const ShimmerBlock = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <style>{`
        @keyframes shimmer { 
          100% { transform: translateX(100%); } 
        }
      `}</style>
      
      <div className="flex">

        <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-[calc(100vh-80px)] sticky top-20">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <ShimmerBlock className="w-14 h-14 rounded-2xl shrink-0" />
              <div className="space-y-2 w-full">
                <ShimmerBlock className="h-4 w-3/4 rounded" />
                <ShimmerBlock className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <ShimmerBlock className="h-8 w-full rounded-xl mt-6" />
          </div>
          
          <div className="flex-1 py-6 px-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <ShimmerBlock key={i} className="h-10 w-full rounded-xl" />
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              {[...Array(2)].map((_, i) => (
                <ShimmerBlock key={i} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 dark:border-gray-800">
            <ShimmerBlock className="h-16 w-full rounded-2xl" />
          </div>
        </aside>


        <main className="flex-1 min-w-0 p-8 pb-32">

          <div className="mb-10 block">
            <ShimmerBlock className="h-8 w-48 rounded-lg mb-3" />
            <ShimmerBlock className="h-4 w-96 rounded" />
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <ShimmerBlock className="w-10 h-10 rounded-xl mb-4" />
                <ShimmerBlock className="h-8 w-20 rounded mb-2" />
                <ShimmerBlock className="h-4 w-28 rounded" />
              </div>
            ))}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <ShimmerBlock className="h-6 w-32 rounded" />
                <ShimmerBlock className="h-8 w-24 rounded-full" />
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <ShimmerBlock className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <ShimmerBlock className="h-4 w-1/3 rounded" />
                    <ShimmerBlock className="h-3 w-1/4 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <ShimmerBlock className="h-6 w-32 rounded mb-6" />
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                     <ShimmerBlock className="w-10 h-10 rounded-full shrink-0" />
                     <div className="space-y-2 flex-1 pt-1">
                        <ShimmerBlock className="h-3 w-full rounded" />
                        <ShimmerBlock className="h-3 w-2/3 rounded" />
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
