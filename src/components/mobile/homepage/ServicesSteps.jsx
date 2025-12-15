import React from "react";
import { Check, ArrowRight } from "lucide-react";

const ServicesSteps = () => {
  const features = ["Wedding planning", "Budget optimisation", "Event management"];

  return (
    <>
      <div className="flex px-4 py-7 lg:px-10 lg:py-16 bg-rose-200/50 mx-4 relative">
        <div className="flex flex-col space-y-7 lg:basis-1/2 lg:space-y-8 lg:px-8">
          {/* Header Section */}
          <div className="space-y-4 px-4 text-center lg:text-left">
            <p className="font-serif text-2xl font-semibold lg:text-5xl text-gray-900">End-to-end services</p>
            <p className="text-base text-gray-600 lg:whitespace-pre-wrap lg:text-xl">
              Your one-stop solution for weddings.
              <span className="hidden lg:inline">{"\n"}</span>
              From planning to execution.
            </p>
          </div>

          {/* List Section */}
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-col justify-center space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 lg:gap-4">
                  {/* Replaced static webp icon with Lucide Check for better quality */}
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-[#C33765] lg:w-8 lg:h-8" strokeWidth={3} />
                  </div>
                  <p className="text-base font-semibold text-gray-800 lg:text-2xl lg:font-medium">{feature}</p>
                </div>
              ))}
            </div>

            {/* Mobile Image */}
            <img
              alt="mandap"
              loading="lazy"
              width="464"
              height="378"
              className="w-32 object-contain lg:hidden rounded-lg"
              src="https://www.theweddingcompany.com/_next/static/media/Mandap.d8d5d35e.webp"
            />
          </div>

          {/* CTA Button */}
          <button
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#C33765] px-8 py-4 text-base text-white shadow-[0px_4px_10px_0px_rgba(195,55,101,0.20)] lg:w-fit lg:text-lg lg:font-semibold hover:bg-[#a82d55] transition-colors"
            id="e2e-services-cta"
          >
            Talk to Wedding Planner
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-[60%]"
              strokeWidth={3}
            />
          </button>
        </div>

        {/* Desktop Right Image */}
        <div className="hidden basis-1/2 place-items-center lg:grid">
          <img
            alt="mandap"
            loading="lazy"
            width="464"
            height="378"
            className="h-80 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1519225468359-53432b479ea2?q=80&w=800&auto=format&fit=crop"
          />
        </div>
        <div className="absolute left-1.5 top-1.5 h-6 w-6 -translate-x-1/2 -translate-y-1/2 -rotate-[135deg] rounded-full border-b-0 border-l-[1px] border-r-0 border-t-0 border-desertSand bg-white shadow-whitey lg:left-4 lg:top-4 lg:block lg:h-14 lg:w-14">
          <div className="h-full w-full rounded-full shadow-[2px_0px_1px_0px_rgba(100,100,111,0.2)_inset]"></div>
        </div>
        <div className="absolute right-1.5 top-1.5 h-6 w-6 -translate-y-1/2 translate-x-1/2 -rotate-45 rounded-full border-b-0 border-l-[1px] border-r-0 border-t-0 border-desertSand bg-white shadow-whitey lg:right-4 lg:top-4 lg:block lg:h-14 lg:w-14">
          <div className="h-full w-full rounded-full shadow-[2px_0px_1px_0px_rgba(100,100,111,0.2)_inset]"></div>
        </div>
      </div>
    </>
  );
};

export default ServicesSteps;
