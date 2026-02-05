"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  RefreshCcw, 
  Home, 
  MessageSquare, 
  ShieldAlert,
  ArrowRight,
  LifeBuoy
} from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or LogSnag
    console.error("Critical UI Crash:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 selection:bg-rose-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-10 max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center bg-white border border-slate-100 p-12 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
      >
        {/* Left Side: Visuals */}
        <div className="space-y-8">
          <div className="inline-flex p-5 rounded-[28px] bg-rose-50 text-rose-500 shadow-inner">
            <ShieldAlert size={48} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">
              Unexpected <br />
              <span className="text-rose-500">Service Interruption.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              We encountered a technical glitch while preparing your premium experience. 
              Our engineers have been notified.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => reset()}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all"
            >
              <RefreshCcw size={18} strokeWidth={3} />
              TRY AGAIN
            </button>
            <Link
              href="/"
              className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-slate-50 transition-all"
            >
              <Home size={18} />
              RETURN HOME
            </Link>
          </div>
        </div>

        {/* Right Side: Recovery & Support */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
            Quick Recovery Options
          </h3>
          
          <div className="space-y-3">
            {[
            //   { 
            //     icon: LifeBuoy, 
            //     title: "Concierge Support", 
            //     desc: "Talk to our event specialists", 
            //     href: "/support", 
            //     color: "text-blue-500", 
            //     bg: "bg-blue-50" 
            //   },
            //   { 
            //     icon: MessageSquare, 
            //     title: "Live Chat", 
            //     desc: "Instant help with your account", 
            //     href: "#", 
            //     color: "text-emerald-500", 
            //     bg: "bg-emerald-50" 
            //   },
              { 
                icon: AlertTriangle, 
                title: "System Status", 
                desc: "Check for global outages", 
                href: "/status", 
                color: "text-amber-500", 
                bg: "bg-amber-50" 
              }
            ].map((item, i) => (
              <Link 
                key={i} 
                href={item.href}
                className="group flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          <div className="mt-8 p-6 bg-slate-900 rounded-[32px] text-white overflow-hidden relative group cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Emergency</p>
                <h4 className="font-bold text-sm">Call Priority Desk</h4>
              </div>
              <span className="text-sm font-black">+91 1800-PLAN-WAB</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtle bottom footer info */}
      <div className="fixed bottom-8 text-center w-full space-y-1">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Error Log: {error.digest || "PLW_ROOT_CRASH_2026"}
        </p>
        <p className="text-[10px] font-bold text-slate-400">
          PLANWAB SYSTEMS ENGINE V2.5.0 • PROTECTED BY ESCROW SECURITY
        </p>
      </div>
    </div>
  );
}