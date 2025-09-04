import React from "react";

const Banner1 = () => {
  const steps = [
    "Vendor Booking",
    "Venue Consultation",
    "Wedding Planning",
  ];

  return (
    <div id="successful_booking_stats_section" className="border-1 border-t-gray-900">
      <div className="relative flex items-center justify-center bg-[linear-gradient(143deg,#9E7C3D_21.68%,#D0AC6C_78.32%)] px-4 py-4 text-center text-sm font-semibold text-white lg:bg-[linear-gradient(90deg,#F6F0DD_2.38%,rgba(246,240,221,0)_23.13%,rgba(246,240,221,0)_72.32%,#F6F0DD_97.78%),linear-gradient(143deg,#9E7C3D_21.68%,#D0AC6C_78.32%)] lg:py-6 lg:text-xl">
        <div className="flex items-center divide-x divide-white/40">
          {steps.map((step, index) => (
            <div key={index} className="px-4">
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner1;
