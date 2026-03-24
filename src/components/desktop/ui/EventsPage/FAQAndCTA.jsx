"use client";

import React, { useState, useCallback, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle, Sparkles, ArrowRight, Phone, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export const FAQ_DATA = {
  wedding: [
    {
      q: "How do I start planning my wedding?",
      a: "Start by setting your date and budget using our planning tools. Then browse verified vendors, create your checklist, and use our budget tracker to stay on track. Our platform guides you through every step.",
    },
    {
      q: "Are all vendors verified?",
      a: "Yes! All vendors on PlanWab go through a thorough verification process including document verification, portfolio review, and quality checks. Look for the verified badge on vendor profiles.",
    },
    {
      q: "Can I negotiate prices with vendors?",
      a: "Absolutely! You can directly communicate with vendors through our platform and negotiate packages. Many vendors offer customizable packages to fit your budget.",
    },
    {
      q: "What if I need to cancel a booking?",
      a: "Cancellation policies vary by vendor and are clearly stated before booking. Review the terms carefully, and contact our support team for any issues. We're here to help!",
    },
    {
      q: "How does the budget tracker work?",
      a: "Our budget tracker lets you set your total budget, allocate amounts to different categories, and track spending in real-time. You'll get alerts when approaching limits.",
    },
  ],
  anniversary: [
    {
      q: "How far in advance should I book?",
      a: "We recommend booking at least 2-4 weeks in advance for restaurants and venues, especially for special dates. For elaborate celebrations, 1-2 months notice is ideal.",
    },
    {
      q: "Can you help with surprise planning?",
      a: "Yes! Many of our vendors specialize in surprise celebrations and can coordinate discreetly. Just mention it's a surprise when contacting vendors.",
    },
    {
      q: "What's included in anniversary packages?",
      a: "Packages vary but typically include venue decoration, dinner arrangements, and special touches like cakes, flowers, or music. Each vendor lists their inclusions clearly.",
    },
    {
      q: "Can I customize packages?",
      a: "Most vendors offer customization options. Discuss your specific needs directly with vendors through our messaging feature.",
    },
  ],
  birthday: [
    {
      q: "Do you have party packages for kids?",
      a: "Yes! We have specialized vendors offering themed parties, entertainment, games, and kid-friendly catering. Filter by 'Kids Party' to find suitable options.",
    },
    {
      q: "Can I customize the party theme?",
      a: "Absolutely! Our vendors can customize decorations, cakes, activities, and more based on your chosen theme. Popular themes include superheroes, princesses, sports, and more.",
    },
    {
      q: "What's the minimum guest count?",
      a: "It varies by vendor. Some offer packages for intimate gatherings of 10-15 guests, while others cater to larger parties of 100+. Filter by capacity to find the right fit.",
    },
    {
      q: "How do I arrange entertainment?",
      a: "Browse our entertainment category for DJs, magicians, game coordinators, and more. You can book multiple services and coordinate timings through our platform.",
    },
  ],
  default: [
    {
      q: "How do I get started?",
      a: "Simply browse our vendor categories, set your event date, and start exploring options. Our planning tools help you stay organized throughout the process.",
    },
    {
      q: "Are vendors verified?",
      a: "Yes, all vendors undergo verification. Look for the verified badge on profiles for added assurance.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We support various payment methods including cards, UPI, net banking, and EMI options for larger bookings.",
    },
  ],
};

FAQ_DATA.Default = FAQ_DATA.default;

export const FAQSection = memo(({ theme, category }) => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const normalizedCategory = category ? category.toLowerCase() : "default";
  const faqs = FAQ_DATA[normalizedCategory] || FAQ_DATA.default;

  const toggleFAQ = useCallback((idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6">
      <h2 className="text-3xl md:text-4xl text-gray-900 dark:text-white mb-10 font-normal tracking-tight">FAQ</h2>

      <div className="border-t border-gray-200 dark:border-gray-800">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border-b border-gray-200 dark:border-gray-800 py-6"
            >
              <div 
                className="flex justify-between items-start gap-4 cursor-pointer group" 
                onClick={() => toggleFAQ(idx)}
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pr-4">
                  <h3 className={`text-[17px] md:text-lg font-normal m-0 p-0 leading-snug transition-colors ${isOpen ? 'text-black dark:text-white' : 'text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'}`}>
                    {faq.q}
                  </h3>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                         <p className="text-[13px] md:text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed md:-mt-1">
                           {faq.a}
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button
                  className="text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors w-6 flex justify-end shrink-0 mt-1 md:mt-0"
                  aria-label="Toggle FAQ"
                >
                  {isOpen ? <X size={20} strokeWidth={1} /> : <Plus size={20} strokeWidth={1} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

FAQSection.displayName = "FAQSection";

export const CTASection = memo(({ theme, category }) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState({ name: "", phone: "", time: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryTheme = () => {
    switch (category?.toLowerCase()) {
      case "wedding": return { primary: "#e11d48", dark: "#be123c", emoji: "💒" }; // Rose
      case "birthday": return { primary: "#2563eb", dark: "#1d4ed8", emoji: "🎂" }; // Blue
      case "anniversary": return { primary: "#d97706", dark: "#b45309", emoji: "💝" }; // Amber
      default: return { primary: "#1e3a8a", dark: "#1e40af", emoji: "🎉" };
    }
  };

  const { primary: primaryColor, dark: primaryDarkColor, emoji } = getCategoryTheme();

  const handleStartPlanning = () => {
    router.push("/vendors/marketplace");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDrawerOpen(false);
      setFormData({ name: "", phone: "", time: "", message: "" });
    }, 1000);
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 pb-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative p-10 sm:p-14 rounded-[2rem] overflow-hidden shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryDarkColor})` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl"
              style={{
                left: `${(i * 12 + Math.random() * 10) % 100}%`,
                top: `${(i * 18 + Math.random() * 10) % 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6 border border-white/10">
              <Sparkles size={16} />
              Limited Time Offer
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Ready to Start <br className="hidden md:block"/> Planning?
            </h2>
            <p className="text-white/90 text-lg sm:text-xl">Get 20% off on your first vendor booking</p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-4 min-w-[280px]">
            <button
              onClick={handleStartPlanning}
              className="w-full py-5 bg-white rounded-2xl font-bold text-center flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-lg"
              style={{ color: primaryColor }}
            >
              Start Planning Now
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold text-white text-center flex items-center justify-center gap-2 border border-white/20 transition-all text-lg"
            >
              <Phone size={20} />
              Talk to Expert
            </button>
            
            <p className="text-center text-white/70 text-xs mt-2 font-medium">No credit card required • Free consultation</p>
          </div>
        </div>
      </motion.div>

      {mounted && createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-900/60 z-[99998]"
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-[99999] shadow-2xl flex flex-col"
              >
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                  
                  <div className="flex justify-between items-start mb-8 flex-col gap-4 pt-4">
                    <div className="w-[40px] h-1.5 bg-gray-200 rounded-full mx-auto self-center -mt-6 mb-2"></div>
                    <div className="flex justify-between w-full items-start">
                      <div>
                        <h2 className="text-[22px] font-bold text-gray-900 leading-none">Schedule a Call</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1.5">Book a free consultation</p>
                      </div>
                      <button 
                        onClick={() => setIsDrawerOpen(false)} 
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
                      >
                        <X size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-6 text-center mb-8">
                    <div className="mx-auto mb-3">
                      <Phone size={36} className="text-[#2042A4] mx-auto" style={{ fill: 'transparent' }} />
                    </div>
                    <h3 className="text-[19px] font-extrabold text-gray-900 mb-1 leading-tight">Free Consultation</h3>
                    <p className="text-gray-500 font-medium text-[15px]">Speak with our event planning experts</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-[#F5F6F8] rounded-2xl outline-none font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#2042A4]/20 transition-all text-[15px]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 bg-[#F5F6F8] rounded-2xl outline-none font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#2042A4]/20 transition-all text-[15px]"
                    />
                    
                    <div className="relative">
                      <select
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                        className={`w-full px-5 py-4 bg-[#F5F6F8] rounded-2xl outline-none font-medium appearance-none focus:ring-2 focus:ring-[#2042A4]/20 transition-all text-[15px] ${formData.time ? 'text-gray-900' : 'text-gray-400'}`}
                      >
                        <option value="" disabled>Select preferred time</option>
                        <option value="morning">Morning (9AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="evening">Evening (4PM - 7PM)</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <textarea
                      placeholder="Tell us about your event..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full px-5 py-4 bg-[#F5F6F8] rounded-2xl outline-none font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#2042A4]/20 transition-all text-[15px] resize-none pb-8"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#2342A3] hover:bg-[#1C3586] text-white rounded-[1rem] font-bold text-[16px] flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-blue-900/10 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Phone size={18} strokeWidth={2.5} />
                      {isSubmitting ? "Submitting..." : "Schedule Call"}
                    </button>
                    <p className="text-center text-gray-400 font-medium text-[13px] mt-4 pb-4">We'll call you at your preferred time</p>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>, 
        document.body
      )}
    </div>
  );
});

CTASection.displayName = "CTASection";
