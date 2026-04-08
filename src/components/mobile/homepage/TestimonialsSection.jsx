"use client";

import React, { useEffect, useState, memo, useRef } from "react";
import SmartMedia from "../SmartMediaLoader";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

const TestimonialSkeleton = () => (
  <div className="w-full py-16 bg-[#f9fafb]">
    <div className="px-5 mb-8">
      <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
    </div>

    <div className="flex gap-4 px-5 overflow-x-auto scrollbar-hide snap-x">
      {[...Array(3)].map((_, i) => (
        <div key={`skel-${i}`} className="flex-shrink-0 w-[85vw] max-w-[340px] bg-white border border-gray-100 rounded-xl p-6 shadow-sm snap-center min-h-[220px] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-3 items-center">
              <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-12 h-4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>

    <div className="px-5 mt-8">
      <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse max-w-[300px] mx-auto" />
    </div>
  </div>
);

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/user/testimonials?status=APPROVED&limit=6");
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            setTestimonials(data.data);
          }
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return <TestimonialSkeleton />;
  }

  return (
    <div className="w-full py-12 bg-[#fafbfd]">
      
      <div className="px-6 mb-10 max-w-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-8 bg-blue-600/60 rounded-full"></span>
          <span className="uppercase tracking-[0.2em] text-blue-600 text-[11px] font-bold">
            Testimonials
          </span>
        </div>
        
        <h2 className="text-[32px] sm:text-[36px] leading-[1.15] font-bold text-[#0F172A] mb-4 tracking-tight">
          What Our Clients <br />
          <span className="font-serif italic font-light text-slate-400">Are Saying</span>
        </h2>
        
        <p className="text-[14.5px] text-slate-500 leading-[1.75] font-medium pr-2">
          Real stories from couples and event hosts who trusted EventCraft to make their special moments unforgettable.
        </p>
      </div>

      <div className="w-full relative py-2">
        
        <button 
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 focus:outline-none active:scale-95 transition-all"
        >
          <ChevronLeft size={18} strokeWidth={2.5} className="-ml-0.5" />
        </button>

        <div ref={scrollRef} className="flex gap-4 px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4">
          {testimonials.map((t) => (
            <div 
              key={t._id || t.id}
              className="flex-shrink-0 w-[85vw] max-w-[340px] relative bg-gradient-to-tr from-white to-[#F8FAFC] border border-gray-100/80 rounded-[20px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] snap-center flex flex-col justify-between overflow-hidden"
            >
              <span className="absolute -top-3 left-4 text-[100px] leading-none font-serif text-gray-100/60 select-none z-0">
                &ldquo;
              </span>

              <p className="relative z-10 text-[16px] text-[#1E293B] leading-[1.7] font-medium mb-8 min-h-[50px]">
                {t.testimonial}
              </p>

              <div className="flex items-center justify-between mt-auto relative z-10 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <SmartMedia 
                    src={
                      t.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        t.name
                      )}&background=random&size=100`
                    }
                    alt={t.name}
                    type="image"
                    className="w-[44px] h-[44px] rounded-full object-cover shrink-0 bg-white border-2 border-white shadow-sm"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-[14px] truncate leading-tight">
                      {t.name}
                    </span>
                    <span className="text-[12px] text-slate-500 mt-0.5 truncate">
                      {t.location && !t.eventType.toLowerCase().includes(t.location.toLowerCase()) ? t.location : "Event Host"}
                    </span>
                  </div>
                </div>

                <div className="pl-3 shrink-0">
                  <span className="inline-flex items-center justify-center bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    {t.eventType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 focus:outline-none active:scale-95 transition-all"
        >
          <ChevronRight size={18} strokeWidth={2.5} className="-mr-0.5" />
        </button>
      </div>

      <div className="px-6 mt-6 flex justify-center">
        <Link 
          href="/m/about#submit-testimonial" 
          className="flex items-center justify-center gap-2 w-full max-w-[280px] py-[14px] rounded-xl bg-blue-600 text-white font-semibold text-[14px] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-[0.98]"
        >
          Share Your Story
          <ChevronRight size={16} className="text-white/80" />
        </Link>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
};

export default memo(TestimonialsSection);
