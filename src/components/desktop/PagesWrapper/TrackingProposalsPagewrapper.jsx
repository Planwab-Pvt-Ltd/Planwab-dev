"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  Download,
  Share2,
  Bell,
  RefreshCw,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  Activity,
  Headphones,
  Award,
  Users,
} from "lucide-react";

// =============================================================================
// CONSTANTS & CONFIG
// =============================================================================

const STATUS_CONFIG = {
  pending: {
    label: "Request Received",
    color: "amber",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
    icon: Clock,
    description: "Your request has been logged in our system.",
    progress: 25,
  },
  "in-progress": {
    label: "Under Review",
    color: "blue",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: Activity,
    description: "Our planning team is building your proposal.",
    progress: 55,
  },
  "proposal-sent": {
    label: "Proposal Dispatched",
    color: "purple",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: FileText,
    description: "Your personalized proposal is ready for review.",
    progress: 85,
  },
  confirmed: {
    label: "Successfully Confirmed",
    color: "emerald",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
    description: "All details verified. Let the celebration begin!",
    progress: 100,
  },
};

const CATEGORY_UI = {
  wedding: { title: "Wedding", icon: "💍", gradient: "from-amber-400 to-orange-600" },
  anniversary: { title: "Anniversary", icon: "🥂", gradient: "from-pink-500 to-rose-700" },
  birthday: { title: "Birthday", icon: "🎂", gradient: "from-yellow-400 to-amber-600" },
};

// =============================================================================
// UTILS
// =============================================================================

const formatDate = (date) => {
  if (!date) return "TBD";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getTimeAgo = (date) => {
  if (!date) return "";
  const diff = new Date() - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const DesktopStatusHeader = ({ event, onRefresh, isRefreshing }) => {
  const router = useRouter();
  const cat = CATEGORY_UI[event?.category] || CATEGORY_UI.wedding;
  const status = STATUS_CONFIG[event?.status] || STATUS_CONFIG.pending;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.back()}
            className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-white transition-all duration-300"
          >
            <ArrowLeft size={20} className="group-hover:text-white dark:group-hover:text-black transition-colors" />
          </button>

          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${cat.gradient} shadow-lg flex items-center justify-center text-3xl`}>
              {cat.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {cat.title} Proposal Tracking
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                REF_ID: <span className="text-slate-600 dark:text-slate-300 font-mono">{event?._id?.slice(-12)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-5 py-2.5 rounded-2xl border ${status.borderColor} ${status.bgColor} flex items-center gap-3`}>
            <status.icon size={18} className={status.textColor} />
            <span className={`text-sm font-black uppercase tracking-tighter ${status.textColor}`}>{status.label}</span>
          </div>
          <button 
            onClick={onRefresh}
            className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

const ProgressTimeline = ({ event }) => {
  const currentStatus = event?.status || "pending";
  const statusConfig = STATUS_CONFIG[currentStatus];
  
  const steps = [
    { id: "pending", label: "Request Authenticated", icon: CheckCircle },
    { id: "in-progress", label: "Expert Allocation", icon: Users },
    { id: "proposal-sent", label: "Proposal Generation", icon: FileText },
    { id: "confirmed", label: "Final Confirmation", icon: Award },
  ];

  const getIdx = (id) => ["pending", "in-progress", "proposal-sent", "confirmed"].indexOf(id);
  const currentIdx = getIdx(currentStatus);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Proposal Status</h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Live tracking of your event planning journey</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-indigo-600">{statusConfig.progress}%</span>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Rate</p>
        </div>
      </div>

      <div className="relative flex justify-between items-start">
        {/* Connection Line */}
        <div className="absolute top-7 left-10 right-10 h-[2px] bg-slate-100 dark:bg-slate-800 z-0" />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${statusConfig.progress}%` }}
          className="absolute top-7 left-10 h-[2px] bg-indigo-600 z-10 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
        />

        {steps.map((step, i) => {
          const isDone = getIdx(step.id) <= currentIdx;
          const isCurrent = step.id === currentStatus;

          return (
            <div key={step.id} className="relative z-20 flex flex-col items-center text-center w-40">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white dark:border-slate-900 ${
                isDone ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'
              } ${isCurrent ? 'scale-110 ring-4 ring-indigo-50' : ''}`}>
                <step.icon size={24} strokeWidth={isCurrent ? 3 : 2} />
              </div>
              <p className={`mt-4 text-xs font-black uppercase tracking-tighter ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ProposalTrackingPageWrapper() {
  const { id: proposalId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEventData = useCallback(async (silent = false) => {
    if (!proposalId) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const response = await fetch(`/api/plannedevent/add?id=${proposalId}`);
      const data = await response.json();

      if (!response.ok || !data.success || !data.event) {
        throw new Error("PROPOSAL_NOT_FOUND");
      }
      setEvent(data.event);
      setError(null);
    } catch (err) {
      setError(err.message === "PROPOSAL_NOT_FOUND" ? "Invalid ID" : "Network Error");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [proposalId]);

  useEffect(() => { fetchEventData(); }, [fetchEventData]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 font-black text-slate-400 text-xs uppercase tracking-widest">Syncing Dashboard...</p>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-10">
      <div className="max-w-md text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-100">
          <AlertCircle className="text-rose-500" size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Proposal Not Found</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          The requested proposal ID is invalid or has expired. Please check your dashboard or contact our support team.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all">HOME</Link>
          <button onClick={() => fetchEventData()} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black">RETRY</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <DesktopStatusHeader event={event} onRefresh={() => fetchEventData(true)} isRefreshing={isRefreshing} />

      <main className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="grid grid-cols-12 gap-10">
          
          {/* Main Feed - 8 Columns */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <ProgressTimeline event={event} />

            {/* Detailed Info Cards */}
            <div className="grid md:grid-cols-3 gap-6">
               {[
                 { label: "Celebration City", val: event.city, icon: MapPin, color: "text-blue-500" },
                 { label: "Target Date", val: formatDate(event.eventDetails?.selectedDate), icon: Calendar, color: "text-purple-500" },
                 { label: "Total Budget", val: `₹${event.budgetDetails?.valueFormatted || 'TBD'}`, icon: DollarSign, color: "text-emerald-500" }
               ].map((item, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <item.icon className={`${item.color} mb-4`} size={20} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{item.val}</p>
                 </div>
               ))}
            </div>

            {/* Full Logistics Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <ShieldCheck className="text-indigo-600" /> Requirement Specifications
               </h3>
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Time Preference</p>
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Clock size={16} className="text-indigo-500" /> {event.eventDetails?.timeSlot || "Flexible"}</p>
                     </div>
                     <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Terms</p>
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><CreditCard size={16} className="text-indigo-500" /> {event.budgetDetails?.paymentPreference || "Standard"}</p>
                     </div>
                  </div>
                  <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[32px] border border-indigo-100 dark:border-indigo-900/30">
                    <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-4">Special Directives</h4>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{event.eventDetails?.specialRequests || "No custom instructions provided for this proposal request."}"
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar - 4 Columns */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Event Countdown */}
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Countdown</p>
                  <h3 className="text-5xl font-black mt-2">124</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Days to Celebrate</p>
                </div>
                <CalendarDays size={64} className="text-white/10" />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
               <h3 className="text-lg font-black mb-6">Point of Contact</h3>
               <div className="space-y-4">
                  {[
                    { icon: User, label: "Client Name", val: event.contactName },
                    { icon: Mail, label: "Email Route", val: event.contactEmail },
                    { icon: Phone, label: "Direct Line", val: event.fullPhone || event.contactPhone }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <item.icon size={18} className="text-slate-400" />
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.val}</p>
                          </div>
                       </div>
                       <Copy size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
               </div>
            </div>

            {/* Quick Actions Action Bar */}
            <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100">
               <h3 className="text-lg font-black mb-6 flex items-center gap-2"><Zap size={20} fill="white" /> Instant Actions</h3>
               <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-[32px] border border-white/10 hover:bg-white/20 transition-all group">
                    <Download size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase">Invoice</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-[32px] border border-white/10 hover:bg-white/20 transition-all group">
                    <MessageSquare size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase">Support</span>
                  </button>
               </div>
            </div>

            {/* Activity Hub Support Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center shrink-0">
                    <Headphones className="text-white" size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Concierge Support</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Our premium event planners are available 24/7 for you.</p>
                    <button className="mt-4 text-xs font-black text-indigo-600 uppercase underline underline-offset-4">Talk to Expert</button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Footer Sync Info */}
      <footer className="max-w-[1600px] mx-auto px-8 py-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <p>PLANWAB SYNC ENGINE V2.0.4</p>
        <p>LAST DATA REFRESH: {getTimeAgo(event.updatedAt)}</p>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}