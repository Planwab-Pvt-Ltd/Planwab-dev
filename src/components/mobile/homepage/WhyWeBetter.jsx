import React from "react";
import SmartMedia from "../SmartMediaLoader";

const WhyWeBetter = () => {
  return (
    <>
      <section className="mb-8 w-full relative" id="why_are_we_better_section">
        {/* Top Curve SVG */}
        <div>
          <img
            alt="Green curve"
            loading="lazy"
            width="360"
            height="30"
            className="max-h-24 w-full rotate-180 object-cover object-bottom"
            src="https://www.theweddingcompany.com/images/HomePage/new/green-curve.svg"
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center bg-[#F0F7F4] px-5 pb-0 md:px-0 md:pb-12">
          {/* Header Text */}
          <div>
            <p className="pb-2 text-center font-serif text-3xl font-semibold text-[#121212] md:pb-4 lg:text-5xl">
              Why are we better?
            </p>
            <p className="mb-4 mt-2 whitespace-pre-wrap text-center text-base text-gray-600 md:text-xl">
              Because we bring our years of{" "}
              {/* The source used an HTML comment for a break, replicating logic with newline/span */}
              <span className="hidden lg:inline">{"\n"}</span>
              experience in planning your wedding.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-y-4 py-4 md:grid-cols-2 md:gap-x-4 md:py-7 lg:grid-cols-3 lg:gap-x-10 2xl:gap-x-12">
            {/* Card 1: Exclusive Deals */}
            <div className="flex items-center rounded-r-xl py-4 shadow-[0_15px_30px_0_#A1C8B733] md:max-w-[320px] md:flex-col md:rounded-b-xl md:rounded-tr-none md:px-4 md:bg-[linear-gradient(180deg,#F0F7F4_0%,#FFF_100%)] bg-[linear-gradient(90deg,#F0F7F4_11.36%,#FFFFFF_100%)]">
              <div style={{ transform: "rotate(10deg)" }}>
                <img
                  alt="Exclusive Deals"
                  loading="lazy"
                  width="90"
                  height="90"
                  className="md:h-[145px] md:w-[145px]"
                  src="https://www.theweddingcompany.com/images/HomePageRevamp/benefits/gift.webp"
                />
              </div>
              <div className="flex flex-col px-4 md:items-center md:px-2">
                <p className="text-lg font-bold md:pb-1 md:text-2xl">Exclusive Deals</p>
                <p className="pb-4 text-base text-gray-600 md:text-center md:text-lg">
                  Best deals made only for you tailored to your preferences.
                </p>
              </div>
            </div>

            {/* Card 2: Expert Insights */}
            <div className="flex items-center rounded-r-xl py-4 shadow-[0_15px_30px_0_#A1C8B733] md:max-w-[320px] md:flex-col md:rounded-b-xl md:rounded-tr-none md:px-4 md:bg-[linear-gradient(180deg,#F0F7F4_0%,#FFF_100%)] bg-[linear-gradient(90deg,#F0F7F4_11.36%,#FFFFFF_100%)]">
              <div style={{ transform: "rotate(-10deg)" }}>
                <img
                  alt="Expert Insights"
                  loading="lazy"
                  width="100"
                  height="100"
                  className="md:h-[145px] md:w-[145px]"
                  src="https://www.theweddingcompany.com/images/HomePageRevamp/benefits/bulb.webp"
                />
              </div>
              <div className="flex flex-col px-4 md:items-center md:px-2">
                <p className="text-lg font-bold md:pb-1 md:text-2xl">Expert Insights</p>
                <p className="pb-4 text-base text-gray-600 md:text-center md:text-lg">
                  Our wedding experts know how to craft the best for you.
                </p>
              </div>
            </div>

            {/* Card 3: Stress-free Experience */}
            <div className="flex items-center rounded-r-xl py-4 shadow-[0_15px_30px_0_#A1C8B733] md:max-w-[320px] md:flex-col md:rounded-b-xl md:rounded-tr-none md:px-4 md:bg-[linear-gradient(180deg,#F0F7F4_0%,#FFF_100%)] bg-[linear-gradient(90deg,#F0F7F4_11.36%,#FFFFFF_100%)]">
              <div style={{ transform: "translateY(-5.65067px)" }}>
                {/* <img
                  alt="Stress-free Experience"
                  loading="lazy"
                  width="90"
                  height="90"
                  className="md:h-[145px] md:w-[145px]"
                  src="https://www.theweddingcompany.com/images/HomePageRevamp/benefits/lady.webp"
                /> */}
                <SmartMedia
                  src="https://www.theweddingcompany.com/images/HomePageRevamp/benefits/lady.webp"
                  type="image"
                  className="md:h-[145px] md:w-[145px]"
                  loaderImage="/GlowLoadingGif.gif"
                  width="100"
                  height="100"
                  alt="Stress-free Experience"
                />
              </div>
              <div className="flex flex-col px-4 md:items-center md:px-2">
                <p className="text-lg font-bold md:pb-1 md:text-2xl">Stress-free Experience</p>
                <p className="pb-4 text-base text-gray-600 md:text-center md:text-lg">
                  From venue recce to last second of your wedding, we’ll be with you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-1 z-50 translate-y-full">
          <div className="relative">
            <img
              src="https://www.theweddingcompany.com/images/HomePage/new/green-curve.svg"
              alt=" "
              loading="lazy"
              width={100}
              height={8}
              decoding="async"
              className="max-h-24 w-full object-cover object-bottom"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyWeBetter;
