"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2,
  X,
  MessageSquare,
  Phone,
  Star,
  Search,
  Sparkles,
  CreditCard,
  FileText,
  AlertCircle,
  Check,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  LayoutDashboard,
  Wallet,
  MoreVertical,
  LogIn,
  PackageOpen
} from "lucide-react";

// =============================================================================
// SUB-COMPONENTS & SKELETONS
// =============================================================================

const StatusBadge = ({ status }) => {
  const styles = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Completed: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const BookingListItemSkeleton = () => (
  <div className="p-4 rounded-2xl bg-white border border-slate-100 flex gap-4 animate-pulse">
    <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  </div>
);

const TimelineNode = ({ step, isLast }) => (
  <div className="flex gap-4 relative">
    {!isLast && <div className={`absolute left-[11px] top-6 w-[2px] h-full ${step.completed ? "bg-violet-500" : "bg-slate-100"}`} />}
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${step.completed ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "bg-slate-100 text-slate-300"}`}>
      {step.completed ? <Check size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
    </div>
    <div className="pb-8">
      <p className={`text-sm font-bold ${step.completed ? "text-slate-900" : "text-slate-400"}`}>{step.title}</p>
      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{step.date}</p>
    </div>
  </div>
);

// =============================================================================
// MAIN PAGE WRAPPER
// =============================================================================

export default function UserBookingsPageWrapper() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      const fetchBookings = async () => {
        setFetching(true);
        try {
          const res = await fetch(`/api/orders?userId=${user.id}`);
          const data = await res.json();
          if (data.success) {
            const transformed = data.orders.map(order => ({
              id: order._id,
              vendorName: order.items[0]?.name || "Unknown Vendor",
              vendorCategory: order.event.type || "Service",
              image: order.items[0]?.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800",
              date: new Date(order.event.date).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }),
              amount: order.pricing.total,
              status: order.orderStatus === "CONFIRMED" ? "Confirmed" : "Pending",
              original: order,
              timeline: [
                { title: "Order Initiated", date: new Date(order.createdAt).toLocaleDateString(), completed: true },
                { title: "Payment Verified", date: order.razorpay?.paymentId ? "Success" : "In Progress", completed: !!order.razorpay?.paymentId },
                { title: "Vendor Confirmation", date: order.orderStatus === "CONFIRMED" ? "Confirmed" : "Awaiting", completed: order.orderStatus === "CONFIRMED" },
                { title: "Event Day", date: order.event.date, completed: new Date(order.event.date) < new Date() }
              ]
            }));
            setBookings(transformed);
            if (transformed.length > 0) setSelectedBooking(transformed[0]);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setFetching(false);
        }
      };
      fetchBookings();
    }
  }, [isSignedIn, user?.id]);

  // Handle Guest State
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-6"><LogIn className="text-violet-600" size={32} /></div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sign in Required</h2>
          <p className="text-slate-500 font-medium mb-8">Please log in to your PlanWAB account to view and manage your wedding bookings.</p>
          <Link href="/sign-in" className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-violet-600 transition-all shadow-xl shadow-slate-200">Go to Login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Instant Header */}
      <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200"><LayoutDashboard size={20} /></div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Booking Dashboard</h1>
        </div>
        {isSignedIn && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
              <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
            </div>
            <img src={user.imageUrl} className="w-10 h-10 rounded-full ring-4 ring-slate-50" alt="profile" />
          </div>
        )}
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-8 grid grid-cols-12 gap-8 overflow-hidden h-[calc(100vh-80px)]">
        
        {/* Left Column: Instant Metrics & Dynamic List */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-600 p-6 rounded-[32px] text-white shadow-xl shadow-violet-200">
              <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">Total Investment</p>
              <p className="text-2xl font-black">
                {fetching ? "..." : `₹${bookings.reduce((a, b) => a + b.amount, 0).toLocaleString()}`}
              </p>
              <TrendingUp size={14} className="mt-3 opacity-50" />
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Orders</p>
              <p className="text-2xl font-black text-slate-900">{fetching ? "..." : bookings.length}</p>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-emerald-500 uppercase">
                <CheckCircle2 size={12} /> Sync Active
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden shadow-sm flex-1">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-black text-slate-900 uppercase text-sm tracking-widest">Recent Activity</h2>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-3 no-scrollbar">
              {fetching ? (
                [...Array(4)].map((_, i) => <BookingListItemSkeleton key={i} />)
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all flex gap-4 border-2 ${
                      selectedBooking?.id === booking.id
                        ? "bg-violet-50 border-violet-100"
                        : "bg-white border-transparent hover:border-slate-100"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm bg-slate-50">
                      <img src={booking.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 truncate text-sm">{booking.vendorName}</h4>
                        <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{booking.vendorCategory}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>₹{booking.amount.toLocaleString()}</span>
                        <span className="text-slate-300">{booking.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <PackageOpen size={48} className="text-slate-200 mb-4" />
                  <p className="text-sm font-bold text-slate-400">No bookings found</p>
                  <Link href="/vendors/marketplace" className="text-xs font-black text-violet-600 mt-2 uppercase underline underline-offset-4">Explore Marketplace</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Context View */}
        <div className="hidden lg:flex lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex-col">
          {fetching ? (
            <div className="flex-1 flex flex-col p-10 space-y-6 animate-pulse">
                <div className="h-48 w-full bg-slate-100 rounded-[32px]" />
                <div className="h-8 bg-slate-100 rounded w-1/3" />
                <div className="grid grid-cols-2 gap-6">
                   <div className="h-32 bg-slate-50 rounded-[24px]" />
                   <div className="h-32 bg-slate-50 rounded-[24px]" />
                </div>
            </div>
          ) : selectedBooking ? (
            <>
              <div className="relative h-64 overflow-hidden">
                <img src={selectedBooking.image} className="w-full h-full object-cover" alt="hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-10">
                  <StatusBadge status={selectedBooking.status} />
                  <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tighter">{selectedBooking.vendorName}</h2>
                  <p className="flex items-center gap-2 text-slate-500 font-bold text-xs mt-1 uppercase tracking-[0.1em]">
                    <MapPin size={14} className="text-slate-300" /> {selectedBooking.original.user.city} • {selectedBooking.vendorCategory}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                <div className="grid grid-cols-3 gap-10">
                  <div className="col-span-2 space-y-8">
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <FileText size={14} /> Reservation Specifics
                      </h3>
                      <div className="grid grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[32px] border border-slate-100/50">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Event Categorization</p>
                          <p className="font-bold text-slate-900 text-sm">{selectedBooking.original.event.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Capacity Allotted</p>
                          <p className="font-bold text-slate-900 text-sm">{selectedBooking.original.event.guests} Guests</p>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Special Directives</p>
                          <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                            "{selectedBooking.original.event.specialRequests || "No specific instructions provided for this order."}"
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Financial Statement</h3>
                      <div className="space-y-4">
                        {[
                          { label: "Standard Service Fee", val: selectedBooking.original.pricing.subtotal },
                          { label: "Applicable GST/Service Tax", val: selectedBooking.original.pricing.tax },
                          { label: "Platform Maintenance", val: selectedBooking.original.pricing.platformFee },
                          { label: "Promotional Credits", val: -selectedBooking.original.pricing.discount, color: "text-emerald-600" }
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500">{row.label}</span>
                            <span className={`text-sm font-black ${row.color || "text-slate-900"}`}>₹{row.val.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-sm font-black text-slate-900 uppercase">Net Paid Amount</span>
                          <span className="text-3xl font-black text-violet-600">₹{selectedBooking.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Fulfillment Track</h3>
                      <div className="bg-white">
                        {selectedBooking.timeline.map((step, i) => (
                          <TimelineNode key={i} step={step} isLast={i === 3} />
                        ))}
                      </div>
                    </section>
                    
                    <div className="p-6 bg-indigo-50 rounded-[28px] border border-indigo-100 shadow-sm shadow-indigo-100/50">
                      <div className="flex gap-4">
                        <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
                        <div>
                          <p className="text-xs font-black text-indigo-900 uppercase tracking-tight">Secured Booking</p>
                          <p className="text-[11px] font-medium text-indigo-700/70 mt-1 leading-relaxed">Payments are held in escrow until the vendor confirms availability.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Action Rail */}
              <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <div className="flex gap-3">
                  <button onClick={() => window.open(`tel:${selectedBooking.original.user.phone}`)} className="px-6 py-3 rounded-xl border border-slate-200 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all">
                    <Phone size={14} /> Call Support
                  </button>
                  <button className="px-6 py-3 rounded-xl border border-slate-200 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all">
                    <MessageSquare size={14} /> Live Chat
                  </button>
                </div>
                <Link href={`/invoice/${selectedBooking.id}`} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-violet-600 transition-all">
                  Download Invoice <ArrowUpRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-40">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Search size={48} className="text-slate-200" /></div>
              <h3 className="text-xl font-black mb-1">Awaiting Selection</h3>
              <p className="text-xs font-bold text-slate-400">Select a booking from the sidebar to view full details.</p>
            </div>
          )}
        </div>
      </main>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}