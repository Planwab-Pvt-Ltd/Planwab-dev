import React from "react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";

export default function Banner1() {
  const { activeCategory } = useCategoryStore();
  const steps = ["Vendor Booking", "Venue Consultation", `${activeCategory} Planning`];

  return (
    <div id="successful_booking_stats_section">
      <div className="relative flex items-center justify-center bg-[linear-gradient(143deg,#9E7C3D_21.68%,#D0AC6C_78.32%)] dark:bg-[linear-gradient(143deg,#422006_21.68%,#664d27_78.32%)] px-4 py-4 text-center text-sm font-semibold text-white dark:text-amber-100 lg:py-6 lg:text-xl">
        <div className="flex flex-col sm:flex-row items-center sm:divide-x divide-white/40 dark:divide-amber-200/20 gap-2 sm:gap-0">
          {steps.map((step, index) => (
            <div key={index} className="px-4"><p>{step}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}
