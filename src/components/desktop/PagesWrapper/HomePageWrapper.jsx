"use client";

import { motion } from "framer-motion";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import HeroSection from "@/components/desktop/ui/landingPage/HeroSection";
import ServicesBanner from "@/components/desktop/ui/landingPage/ServicesBanner";
import HowItWorksSection from "@/components/desktop/ui/landingPage/HowItWorks";
import VendorsSection from "@/components/desktop/ui/landingPage/VendorsSection";
import Testimonials from "@/components/desktop/ui/landingPage/TestimonialsSection";
import ServicesSection from "../ui/landingPage/ServicesSection";

export default function DesktopHomePageWrapper() {
  const activeCategory = useCategoryStore((state) => state.activeCategory);

  const categoryThemes = {
    Wedding: { glow: "bg-rose-500/10 dark:bg-rose-500/20" },
    Anniversary: { glow: "bg-amber-500/10 dark:bg-amber-500/20" },
    Birthday: { glow: "bg-blue-500/10 dark:bg-blue-500/20" },
    Default: { glow: "bg-slate-500/10 dark:bg-slate-500/20" },
  };

  const currentTheme = categoryThemes[activeCategory] || categoryThemes?.Default;

  return (
    <>
      <main className="relative w-full overflow-x-hidden">
        <div
          className="absolute inset-0 -z-20 dark:hidden"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #fef3c7 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-20 hidden dark:block"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #0d1117 40%, #2c1a01 100%)",
          }}
        />

        <div
          className={`fixed -top-1/4 -left-1/2 w-full h-1/2 lg:w-1/2 lg:h-1/2 ${currentTheme?.glow} rounded-full blur-3xl opacity-60 animate-pulse transition-colors duration-1000 ease-in-out`}
          style={{ animationDuration: "8s" }}
        />
        <div
          className={`fixed -bottom-1/4 -right-1/2 w-full h-1/2 lg:w-1/2 lg:h-1/2 ${currentTheme?.glow} rounded-full blur-3xl opacity-60 animate-pulse transition-colors duration-1000 ease-in-out`}
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <HeroSection />
          <ServicesSection />
          <ServicesBanner />
          <HowItWorksSection />
          <div>
            <VendorsSection />
            <Testimonials />
          </div>
        </motion.div>
      </main>
    </>
  );
}
