import React from "react";

const ShimmerEffect = ({ className }) => (
  <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800/60 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/[0.07] to-transparent" />
  </div>
);

export default function ExploreLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden">
      <div className="max-w-[1400px] mx-auto pt-16 lg:pt-24 pb-20 px-4 md:px-8 xl:px-12">

        <section className="mb-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

            <div className="w-full lg:w-[45%] lg:pr-8 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center gap-3 mb-6">
                <ShimmerEffect className="w-8 h-8 rounded-full" />
                <ShimmerEffect className="w-32 h-6 rounded-full" />
              </div>
              <ShimmerEffect className="w-full max-w-[400px] h-12 lg:h-16 rounded-2xl mb-4" />
              <ShimmerEffect className="w-3/4 max-w-[300px] h-12 lg:h-16 rounded-2xl mb-8" />
              <ShimmerEffect className="w-full max-w-[450px] h-6 rounded-lg mb-4" />
              <ShimmerEffect className="w-5/6 max-w-[400px] h-6 rounded-lg mb-10" />
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <ShimmerEffect className="w-36 h-12 rounded-full" />
                <ShimmerEffect className="w-36 h-12 rounded-full" />
              </div>
            </div>


            <div className="w-full lg:w-[55%] flex gap-4 h-[400px] sm:h-[500px] lg:h-[600px]">
              <div className="w-1/2 h-full pt-12">
                <ShimmerEffect className="w-full h-full rounded-[2rem] lg:rounded-[3rem]" />
              </div>
              <div className="w-1/2 h-full pb-12 flex flex-col gap-4">
                <ShimmerEffect className="w-full h-[60%] rounded-[2rem] lg:rounded-[3rem]" />
                <ShimmerEffect className="w-full h-[40%] rounded-[2rem] lg:rounded-[3rem]" />
              </div>
            </div>
          </div>
        </section>

        <div className="py-4 px-2 mb-16">
          <ShimmerEffect className="w-full h-32 lg:h-28 rounded-[32px]" />
        </div>

        {[1, 2, 3].map((section) => (
          <section key={section} className="mb-20">
            <div className="flex items-end justify-between mb-8 px-2">
              <div className="flex items-center gap-4">
                <ShimmerEffect className="w-12 h-12 rounded-2xl" />
                <div>
                  <ShimmerEffect className="w-48 h-8 rounded-xl mb-2" />
                  <ShimmerEffect className="w-64 h-4 rounded-md hidden md:block" />
                </div>
              </div>
              <div className="flex gap-2">
                <ShimmerEffect className="w-10 h-10 rounded-full" />
                <ShimmerEffect className="w-10 h-10 rounded-full" />
              </div>
            </div>

            <div className="flex gap-4 overflow-hidden px-2 pb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] sm:w-[300px] rounded-[2rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden bg-white dark:bg-slate-900/50">
                  <ShimmerEffect className="w-full aspect-[4/5]" />
                  <div className="p-6">
                    <ShimmerEffect className="w-full h-6 rounded-lg mb-3" />
                    <ShimmerEffect className="w-3/4 h-4 rounded-md mb-4" />
                    <div className="flex gap-2">
                       <ShimmerEffect className="w-full h-12 rounded-xl" />
                       <ShimmerEffect className="w-12 h-12 flex-shrink-0 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}