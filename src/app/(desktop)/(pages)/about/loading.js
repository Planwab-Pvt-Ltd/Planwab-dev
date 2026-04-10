"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <style>{`
        @keyframes shimmer{0%{background-position:-1000px 0}100%{background-position:1000px 0}}
        .animate-pulse {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="w-16 h-6 bg-slate-200 rounded animate-pulse mb-8" />
      </div>


      <div className="relative overflow-hidden mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-200 rounded-3xl overflow-hidden relative animate-pulse h-[350px] md:h-[450px]" />
        </div>


        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`text-center ${index > 0 ? "pl-8" : ""}`}>
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse" />
                  </div>
                  <div className="w-20 h-8 bg-slate-200 rounded mx-auto mb-2 animate-pulse" />
                  <div className="w-24 h-4 bg-slate-200 rounded mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="w-12 h-12 bg-slate-200 rounded-xl mb-6 animate-pulse" />
              <div className="w-40 h-8 bg-slate-200 rounded mb-4 animate-pulse" />
              <div className="w-full h-4 bg-slate-200 rounded mb-2 animate-pulse" />
              <div className="w-full h-4 bg-slate-200 rounded mb-2 animate-pulse" />
              <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>


        <div>
          <div className="w-48 h-8 bg-slate-200 rounded mx-auto mb-10 animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4 animate-pulse" />
                <div className="w-32 h-6 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="w-full h-3 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="w-full h-3 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="w-2/3 h-3 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>


        <div>
          <div className="w-40 h-8 bg-slate-200 rounded mx-auto mb-10 animate-pulse" />
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full shrink-0 animate-pulse" />
                  <div className="space-y-2 w-full">
                    <div className="w-32 h-5 bg-slate-200 rounded animate-pulse" />
                    <div className="w-24 h-4 bg-slate-300 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-2/3 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="w-20 h-6 bg-slate-200 rounded-full animate-pulse" />
                  <div className="w-24 h-6 bg-slate-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="w-48 h-8 bg-slate-200 rounded mx-auto mb-10 animate-pulse" />
          <div className="grid md:grid-cols-5 gap-8">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-300 rounded-full mb-4 animate-pulse" />
                <div className="w-24 h-5 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="w-full h-3 bg-slate-200 rounded mb-1 animate-pulse" />
                <div className="w-full h-3 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="w-12 h-4 bg-slate-300 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>


        <div>
          <div className="w-48 h-8 bg-slate-200 rounded mx-auto mb-10 animate-pulse" />
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-slate-200 rounded-full animate-pulse" />
                  ))}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-32 h-3 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className="flex gap-4 mb-6">
               <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse" />
               <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
            <div className="w-48 h-8 bg-slate-200 rounded mb-4 animate-pulse" />
            <div className="space-y-2 mb-6">
               <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
               <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
               <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="md:w-2/3 w-full bg-slate-50 p-6 rounded-2xl border border-gray-100 h-96 animate-pulse" />
        </div>


        <div className="bg-slate-200 rounded-3xl p-10 md:p-16 h-64 animate-pulse" />
      </div>
    </div>
  );
};

export default Loading;
