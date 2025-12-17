"use client";

import React, { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
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
} from "lucide-react";

// --- MOCK DATA ---

const MOCK_BOOKINGS = [
  {
    id: "bk_123",
    vendorName: "The Grand Heritage",
    vendorCategory: "Venue",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
    date: "12 Oct, 2025",
    amount: "₹1,50,000",
    paid: "₹50,000",
    due: "₹1,00,000",
    status: "Confirmed",
    location: "South Delhi",
    contact: "+91 98765 43210",
    timeline: [
      { title: "Booking Requested", date: "10 Sep 2025", completed: true },
      { title: "Vendor Accepted", date: "11 Sep 2025", completed: true },
      { title: "Advance Paid", date: "12 Sep 2025", completed: true },
      { title: "Contract Signed", date: "Pending", completed: false },
      { title: "Event Day", date: "12 Oct 2025", completed: false },
    ],
    tasks: [
      { id: 1, text: "Upload ID Proof", done: true },
      { id: 2, text: "Select Menu Options", done: false },
      { id: 3, text: "Finalize Guest Count", done: false },
    ],
  },
  {
    id: "bk_124",
    vendorName: "Lens Magic Photography",
    vendorCategory: "Photographer",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop",
    date: "12 Oct, 2025",
    amount: "₹45,000",
    paid: "₹0",
    due: "₹45,000",
    status: "Pending",
    location: "Noida",
    contact: "+91 99887 76655",
    timeline: [
      { title: "Booking Requested", date: "15 Sep 2025", completed: true },
      { title: "Awaiting Confirmation", date: "Processing", completed: false },
    ],
    tasks: [],
  },
];

const RECOMMENDED_VENDORS = [
  {
    id: 1,
    name: "Royal Caterers",
    category: "Catering",
    rating: 4.8,
    price: "₹800/plate",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "DJ Blast",
    category: "Music",
    rating: 4.9,
    price: "₹15,000/gig",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Glamour Makeup",
    category: "Makeup",
    rating: 4.7,
    price: "₹12,000/look",
    image: "https://images.unsplash.com/photo-1487412947132-232a8408a360?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Elite Decor",
    category: "Decoration",
    rating: 4.6,
    price: "₹50,000",
    image: "https://images.unsplash.com/photo-1519225468359-299651df5252?q=80&w=800&auto=format&fit=crop",
  },
];

// --- SUB-COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    Confirmed:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    Pending:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    Completed: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    Cancelled: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
};

const TimelineStep = ({ step, isLast }) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div
        className={`w-3.5 h-3.5 rounded-full z-10 border-2 flex items-center justify-center ${
          step.completed
            ? "bg-violet-600 border-violet-600"
            : "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
        }`}
      >
        {step.completed && <Check size={8} className="text-white" />}
      </div>
      {!isLast && (
        <div
          className={`w-0.5 flex-1 my-1 rounded-full ${
            step.completed ? "bg-violet-200 dark:bg-violet-900" : "bg-gray-100 dark:bg-gray-800"
          }`}
        />
      )}
    </div>
    <div className="pb-6 pt-0.5">
      <p
        className={`text-sm font-semibold transition-colors ${
          step.completed ? "text-gray-900 dark:text-white" : "text-gray-500"
        }`}
      >
        {step.title}
      </p>
      <p className="text-xs text-gray-400 mt-0.5 font-medium">{step.date}</p>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function UserBookingsPageWrapper() {
  const { isLoaded, isSignedIn } = useUser();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const scrollRef = useRef(null);

  // Scroll Handler
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 1. Loading State
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-6 space-y-4">
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse w-full" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  // 2. Not Signed In (Guest View)
  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-white dark:bg-black relative overflow-hidden flex flex-col">
        <div className="absolute top-[-10%] right-[-20%] w-80 h-80 bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-fuchsia-200/40 dark:bg-fuchsia-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 mb-8 bg-gradient-to-br from-violet-100 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-3xl flex items-center justify-center shadow-lg shadow-violet-200/50 dark:shadow-none"
          >
            <Calendar size={48} className="text-violet-600 dark:text-violet-300" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Plan & Track</h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-10 max-w-xs leading-relaxed font-medium">
            Manage your vendors, track payments, and follow your event timeline in one place.
          </p>

          <Link
            href="/sign-in"
            className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg text-center shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all active:scale-95"
          >
            Log In to Continue
          </Link>
        </div>
      </main>
    );
  }

  // 3. Signed In (Dashboard)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center transition-all">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Bookings</h1>
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
          <Calendar size={20} />
        </div>
      </div>

      <div className="p-5 space-y-8">
        {/* Quick Stats / Actions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-violet-500/20">
            <p className="text-violet-100 text-xs font-medium uppercase tracking-wide mb-1">Total Spent</p>
            <p className="text-2xl font-bold">₹1.95L</p>
            <div className="mt-3 flex items-center gap-1 text-xs bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
              <TrendingUp size={12} /> +12% this month
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_BOOKINGS.length}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">2 Pending Actions</p>
          </div>
        </div>

        {/* Active Bookings List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Bookings</h2>
          </div>
          <div className="space-y-4">
            {MOCK_BOOKINGS.length > 0 ? (
              MOCK_BOOKINGS.map((booking, idx) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex gap-4">
                    {/* Vendor Image */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                      <img
                        src={booking.image}
                        alt={booking.vendorName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2 text-base">
                            {booking.vendorName}
                          </h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{booking.vendorCategory}</p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <Calendar size={12} className="text-violet-500" />
                          <span className="font-medium">{booking.date}</span>
                        </div>
                        {booking.tasks.filter((t) => !t.done).length > 0 && (
                          <div className="flex items-center gap-2 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md w-fit">
                            <AlertCircle size={10} />
                            {booking.tasks.filter((t) => !t.done).length} Tasks Pending
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No bookings yet</p>
                <Link href="/m" className="text-violet-600 text-sm font-bold mt-2 inline-block">
                  Start Exploring
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Payments Summary Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Payments</h2>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                <CreditCard size={20} className="text-white" />
              </div>
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-md font-bold">DUE SOON</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Total Outstanding</p>
              <p className="text-3xl font-bold">₹1,45,000</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
              <span className="text-gray-300">Next: The Grand Heritage</span>
              <span className="font-semibold">12 Sep</span>
            </div>
          </div>
        </div>

        {/* Recommended Section (Enhanced) */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Recommended
                <Sparkles size={16} className="text-yellow-500 fill-yellow-500 animate-pulse" />
              </h2>
              <p className="text-xs text-gray-500">Curated for your event type</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar [&::-webkit-scrollbar]:hidden snap-x scroll-smooth"
          >
            {RECOMMENDED_VENDORS.map((vendor, idx) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[200px] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 snap-start group cursor-pointer"
              >
                <div className="h-28 relative overflow-hidden">
                  <img
                    src={vendor.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={vendor.name}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold text-gray-900 dark:text-white flex items-center gap-0.5 shadow-sm">
                    <Star size={8} className="fill-yellow-400 text-yellow-400" /> {vendor.rating}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate mb-0.5">{vendor.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{vendor.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-md">
                      {vendor.price}
                    </span>
                    <button className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-violet-100 hover:text-violet-600 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support Banner */}
        <div className="bg-violet-50 dark:bg-violet-900/10 rounded-2xl p-4 flex items-center gap-4 border border-violet-100 dark:border-violet-900/20">
          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Need Assistance?</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Our support team is here to help with your bookings.
            </p>
          </div>
          <button className="text-xs font-bold text-violet-600 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm">
            Chat
          </button>
        </div>
      </div>

      {/* --- BOOKING DETAILS DRAWER --- */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-gray-900 rounded-t-[2rem] z-50 overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setSelectedBooking(null)}>
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 pt-2">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
                        {selectedBooking.vendorName}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{selectedBooking.vendorCategory}</span>
                        <StatusBadge status={selectedBooking.status} />
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Tasks Section */}
                  {selectedBooking.tasks && selectedBooking.tasks.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                          Required Tasks
                        </h3>
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md font-medium">
                          {selectedBooking.tasks.filter((t) => t.done).length}/{selectedBooking.tasks.length} Done
                        </span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1 space-y-1">
                        {selectedBooking.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                task.done ? "bg-green-500 border-green-500" : "border-gray-300"
                              }`}
                            >
                              {task.done && <Check size={12} className="text-white" />}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                task.done ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Card */}
                  <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5 rounded-2xl text-white shadow-lg mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <CreditCard size={18} /> Payment Details
                      </h3>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded font-medium">
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-violet-200 text-xs">Total Amount</p>
                        <p className="text-2xl font-bold">{selectedBooking.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-violet-200 text-xs">Pending</p>
                        <p className="text-lg font-semibold">{selectedBooking.due}</p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-black/20 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-white/90 w-1/3 rounded-full" />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-violet-200">
                      <span>Paid: {selectedBooking.paid}</span>
                      <span>33%</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Clock size={20} className="text-violet-600" />
                      Booking Journey
                    </h3>
                    <div className="pl-2 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                      {selectedBooking.timeline.map((step, idx) => (
                        <div key={idx} className="relative pl-6 pb-8 last:pb-0">
                          <div
                            className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 ${
                              step.completed ? "bg-violet-600" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          />
                          <p
                            className={`text-sm font-bold ${
                              step.completed ? "text-gray-900 dark:text-white" : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{step.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-3">
                <button
                  onClick={() => window.open(`tel:${selectedBooking.contact}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 active:scale-95 transition-transform"
                >
                  <Phone size={18} /> Call
                </button>
                <button className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                  <MessageSquare size={18} /> Chat with Vendor
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
