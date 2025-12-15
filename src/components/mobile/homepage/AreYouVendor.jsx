import React from "react";

const AreYouAVendorSection = () => {
  const baseUrl = "https://www.theweddingcompany.com";

  return (
    <section className="relative mt-20 overflow-x-hidden px-3 pb-0 pt-0 md:px-0 md:py-12" id="are_you_a_vendor_section">
      {/* Background Pattern Left */}
      <img
        alt="Mandala bg pattern"
        loading="lazy"
        width="400"
        height="400"
        className="absolute z-0 aspect-square w-[200px] -translate-x-1/2 md:w-[400px]"
        style={{ color: "transparent" }}
        src={`${baseUrl}/images/HomePage/new/big-mandala.webp`}
      />
      {/* Background Pattern Right */}
      <img
        alt="Mandala bg pattern"
        loading="lazy"
        width="400"
        height="400"
        className="absolute right-0 z-0 w-[200px] translate-x-1/2 md:w-[400px]"
        style={{ color: "transparent" }}
        src={`${baseUrl}/images/HomePage/new/big-mandala.webp`}
      />

      <div className="relative z-10 mx-auto grid max-w-screen-lg grid-cols-2 gap-6 md:gap-y-16">
        {/* Left Column: Text & CTA */}
        <div className="col-span-full flex flex-col items-center justify-center gap-y-4 pt-10 md:col-span-1 md:items-start md:justify-start md:gap-y-8">
          <p className="font-serif text-3xl font-semibold md:text-5xl text-gray-900">Are you a vendor?</p>
          <p className="whitespace-pre-wrap text-center text-base text-gray-600 md:text-start md:text-xl">
            Want to list your venue or wedding services <span className="hidden lg:inline">{"\n"}</span>
            here? Join us today!
          </p>
          <a
            className="group flex w-max items-center gap-x-2 rounded-2xl border-2 border-[#C33765] px-10 py-3 text-lg font-bold text-[#C33765] md:px-12 md:text-xl hover:bg-[#C33765] hover:text-white transition-colors"
            id="hp-join-vendor"
            target="_blank"
            href="/lp/partner-onboarding-form"
            rel="noopener noreferrer"
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
              className="transition-transform duration-500 group-hover:translate-x-[20%]"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
        </div>

        {/* Right Column: Image Composition */}
        <div className="col-span-full hidden md:col-span-1 md:block">
          <div className="flex h-full items-center justify-center md:py-10 pr-0">
            <div className="relative h-[280px] w-[400px]">
              {/* Main Center Image */}
              <img
                alt="vendor-1"
                loading="lazy"
                decoding="async"
                className="rounded-2xl object-cover"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  color: "transparent",
                }}
                src={`${baseUrl}/images/HomePage/new/vendor-1.webp`}
              />

              {/* Top Left Floating Image */}
              <div className="absolute -left-8 -top-8">
                <div className="relative aspect-square h-[170px]">
                  <img
                    alt="vendor-2"
                    loading="lazy"
                    decoding="async"
                    className="rounded-2xl border-4 border-white object-cover"
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: "transparent",
                    }}
                    src={`${baseUrl}/images/HomePage/new/vendor-2.webp`}
                  />
                </div>
              </div>

              {/* Bottom Right Floating Image */}
              <div className="absolute -bottom-14 -right-10">
                <div className="relative aspect-square h-[220px]">
                  <img
                    alt="vendor-3"
                    loading="lazy"
                    decoding="async"
                    className="rounded-2xl border-4 border-white object-cover"
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      color: "transparent",
                    }}
                    src={`${baseUrl}/images/HomePage/new/vendor-3.webp`}
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

export default AreYouAVendorSection;
