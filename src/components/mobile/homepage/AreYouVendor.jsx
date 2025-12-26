import React, { memo } from "react";
import SmartMedia from "../SmartMediaLoader";

const BASE_URL = "https://www.theweddingcompany.com";

const AreYouAVendorSection = () => {
  return (
    <section
      className="relative overflow-x-hidden px-3 pt-2 md:px-0 md:py-12 !z-10 bg-white pb-12"
      id="are_you_a_vendor_section"
    >
      {/* Background Pattern Left - Decorative */}
      <div className="absolute left-0 top-10 z-0 w-[200px] -translate-x-1/2 md:w-[400px] pointer-events-none">
        <SmartMedia
          src={`${BASE_URL}/images/HomePage/new/big-mandala.webp`}
          type="image"
          alt="" // Empty alt for decorative images
          className="aspect-square w-full h-full opacity-50"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>

      {/* Background Pattern Right - Decorative */}
      <div className="absolute right-0 top-10 z-0 w-[200px] translate-x-1/2 md:w-[400px] pointer-events-none">
        <SmartMedia
          src={`${BASE_URL}/images/HomePage/new/big-mandala.webp`}
          type="image"
          alt=""
          className="aspect-square w-full h-full opacity-50"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-screen-lg grid-cols-2 gap-6 md:gap-y-16">
        {/* Left Column: Text & CTA */}
        <div className="col-span-full flex flex-col items-center justify-center gap-y-4 pt-10 md:col-span-1 md:items-start md:justify-start md:gap-y-8">
          <p className="font-serif text-3xl font-semibold md:text-5xl text-gray-900 text-center md:text-left">
            Are you a vendor?
          </p>
          <p className="whitespace-pre-wrap text-center text-base text-gray-600 md:text-start md:text-xl leading-relaxed">
            Want to list your venue or wedding services
            <span className="hidden lg:inline">{"\n"}</span>
            here? Join us today!
          </p>

          <a
            className="group flex w-max items-center gap-x-2 rounded-2xl border-2 border-[#C33765] px-10 py-3 text-lg font-bold text-[#C33765] transition-all hover:bg-[#C33765] hover:text-white md:px-12 md:text-xl active:scale-95"
            id="hp-join-vendor"
            target="_blank"
            href="/lp/partner-onboarding-form"
            rel="noopener noreferrer"
            aria-label="Join us as a vendor"
          >
            <span>Join us</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
        </div>

        {/* Right Column: Image Composition */}
        {/* Hidden on mobile to save bandwidth/rendering cost */}
        <div className="col-span-full hidden md:col-span-1 md:block">
          <div className="flex h-full items-center justify-center md:py-10 pr-0">
            <div className="relative h-[280px] w-[400px]">
              {/* Main Center Image */}
              <div className="absolute inset-0 z-10">
                <SmartMedia
                  alt="Wedding Vendor Main"
                  src={`${BASE_URL}/images/HomePage/new/vendor-1.webp`}
                  type="image"
                  className="rounded-2xl object-cover w-full h-full shadow-lg"
                  loaderImage="/GlowLoadingGif.gif"
                  width={400}
                  height={280}
                  loading="lazy"
                />
              </div>

              {/* Top Left Floating Image */}
              <div className="absolute -left-8 -top-8 z-20 w-[170px] h-[170px]">
                <div className="relative w-full h-full rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                  <SmartMedia
                    alt="Wedding Vendor Detail 1"
                    src={`${BASE_URL}/images/HomePage/new/vendor-2.webp`}
                    type="image"
                    className="object-cover w-full h-full"
                    width={170}
                    height={170}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Bottom Right Floating Image */}
              <div className="absolute -bottom-14 -right-10 z-20 w-[220px] h-[220px]">
                <div className="relative w-full h-full rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                  <SmartMedia
                    alt="Wedding Vendor Detail 2"
                    src={`${BASE_URL}/images/HomePage/new/vendor-3.webp`}
                    type="image"
                    className="object-cover w-full h-full"
                    width={220}
                    height={220}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AreYouAVendorSection);
