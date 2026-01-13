"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

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

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className={`h-full bg-gradient-to-r ${"from-blue-600 to-yellow-500"}`}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

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
  const { user, isLoaded, isSignedIn } = useUser();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { setIsNavbarVisible } = useNavbarVisibilityStore();
  const scrollRef = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

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

  const fetchBookings = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingBookings(true);
      const response = await fetch(`/api/orders?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        // Transform database data to component format
        const transformedBookings = data.orders.map((order) => ({
          id: order._id,
          vendorName: order.items[0]?.name || "Unknown Vendor",
          vendorCategory: order.event.type || "Event Service",
          image:
            order.items[0]?.image ||
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
          date: new Date(order.event.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          amount: `₹${order.pricing.total.toLocaleString()}`,
          paid: order.orderStatus === "CONFIRMED" ? `₹${Math.floor(order.pricing.total * 0.3).toLocaleString()}` : "₹0",
          due: `₹${Math.floor(order.pricing.total * 0.7).toLocaleString()}`,
          status:
            order.orderStatus === "CONFIRMED" ? "Confirmed" : order.orderStatus === "PENDING" ? "Pending" : "Completed",
          location: order.user.city || order.user.address || "Not specified",
          contact: order.user.phone || "Not provided",
          timeline: [
            { title: "Booking Requested", date: new Date(order.createdAt).toLocaleDateString(), completed: true },
            {
              title: "Payment Processed",
              date: order.razorpay?.paymentId ? new Date(order.updatedAt).toLocaleDateString() : "Pending",
              completed: !!order.razorpay?.paymentId,
            },
            {
              title: "Vendor Confirmed",
              date: order.orderStatus === "CONFIRMED" ? new Date(order.updatedAt).toLocaleDateString() : "Pending",
              completed: order.orderStatus === "CONFIRMED",
            },
            {
              title: "Event Day",
              date: new Date(order.event.date).toLocaleDateString(),
              completed: new Date(order.event.date) < new Date(),
            },
          ],
          tasks:
            order.orderStatus === "CONFIRMED"
              ? [
                  { id: 1, text: "Payment Confirmed", done: true },
                  { id: 2, text: "Vendor Contact", done: false },
                  { id: 3, text: "Final Details", done: false },
                ]
              : [],
          // Store original order data for reference
          originalOrder: order,
        }));

        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id]);

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
      <ScrollProgressBar />
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center transition-all">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Bookings</h1>
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
          <Calendar size={20} />
        </div>
      </div>

      <div className="p-5 space-y-8">
        {/* Quick Stats / Actions */}
        {/* Quick Stats / Actions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-violet-500/20">
            <p className="text-violet-100 text-xs font-medium uppercase tracking-wide mb-1">Total Spent</p>
            <p className="text-2xl font-bold">
              ₹
              {bookings.reduce((sum, booking) => sum + (booking.originalOrder?.pricing.total || 0), 0).toLocaleString()}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
              <TrendingUp size={12} /> {bookings.length} bookings
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {bookings.filter((b) => b.status === "Pending").length} Pending Actions
            </p>
          </div>
        </div>
        {/* Active Bookings List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Bookings</h2>
          </div>
          <div className="space-y-4">
            {isLoadingBookings ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking, idx) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedBooking(booking);
                    setIsNavbarVisible(false);
                  }}
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
              {bookings.some((b) => b.status === "Pending") && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-md font-bold">DUE SOON</span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Total Outstanding</p>
              <p className="text-3xl font-bold">
                ₹
                {bookings
                  .reduce((sum, booking) => {
                    const dueAmount = parseInt(booking.due.replace(/[₹,]/g, ""));
                    return sum + dueAmount;
                  }, 0)
                  .toLocaleString()}
              </p>
            </div>
            {bookings.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="text-gray-300">Next: {bookings[0]?.vendorName}</span>
                <span className="font-semibold">{bookings[0]?.date}</span>
              </div>
            )}
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
              onClick={() => {
                setSelectedBooking(null);
                setIsNavbarVisible(true);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[90vh] bg-white dark:bg-gray-900 rounded-t-[2rem] z-50 overflow-hidden flex flex-col shadow-2xl"
            >
              <div
                className="w-full flex justify-center pt-3 pb-1"
                onClick={() => {
                  setSelectedBooking(null);
                  setIsNavbarVisible(true);
                }}
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 pt-2 space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
                        Order Details
                      </h2>
                      <p className="text-sm text-gray-500">ID: {selectedBooking.originalOrder._id}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBooking(null);
                        setIsNavbarVisible(true);
                      }}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Order Status */}
                  <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-2xl p-4 border border-violet-100 dark:border-violet-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Order Status</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {selectedBooking.originalOrder.orderStatus}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">👤</span>
                      </div>
                      Customer Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Full Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.user.firstName} {selectedBooking.originalOrder.user.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {selectedBooking.originalOrder.user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.user.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Pincode</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.user.pincode}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Address</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.user.address}, {selectedBooking.originalOrder.user.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Event Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Calendar size={16} className="text-green-600" />
                      </div>
                      Event Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Event Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.event.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Event Type</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.event.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Event Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(selectedBooking.originalOrder.event.date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Expected Guests</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.originalOrder.event.guests?.toLocaleString() || "Not specified"}
                        </p>
                      </div>
                      {selectedBooking.originalOrder.event.specialRequests && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Special Requests</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedBooking.originalOrder.event.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items/Services */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">🛍️</span>
                      </div>
                      Booked Services
                    </h3>
                    {selectedBooking.originalOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3 last:mb-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-sm text-gray-500">Service ID: {item.id}</p>
                          <p className="text-lg font-bold text-violet-600 mt-1">₹{item.price?.toLocaleString()}</p>
                          {item.addons && item.addons.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Add-ons:</p>
                              {item.addons.map((addon, i) => (
                                <p key={i} className="text-xs text-gray-600 dark:text-gray-300">
                                  • {addon}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 text-white">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <CreditCard size={18} />
                      Pricing Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="font-semibold">
                          ₹{selectedBooking.originalOrder.pricing.subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Tax</span>
                        <span className="font-semibold">
                          ₹{selectedBooking.originalOrder.pricing.tax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Platform Fee</span>
                        <span className="font-semibold">
                          ₹{selectedBooking.originalOrder.pricing.platformFee.toLocaleString()}
                        </span>
                      </div>
                      {selectedBooking.originalOrder.pricing.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Discount</span>
                          <span className="font-semibold text-green-400">
                            -₹{selectedBooking.originalOrder.pricing.discount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-600 pt-3 flex justify-between">
                        <span className="text-white font-bold">Total Amount</span>
                        <span className="font-bold text-xl">
                          ₹{selectedBooking.originalOrder.pricing.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {selectedBooking.originalOrder.razorpay && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 text-sm">💳</span>
                        </div>
                        Payment Details
                      </h3>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Order ID</span>
                          <span className="font-mono text-gray-900 dark:text-white">
                            {selectedBooking.originalOrder.razorpay.orderId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment ID</span>
                          <span className="font-mono text-gray-900 dark:text-white">
                            {selectedBooking.originalOrder.razorpay.paymentId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Signature</span>
                          <span className="font-mono text-gray-900 dark:text-white text-xs truncate max-w-32">
                            {selectedBooking.originalOrder.razorpay.signature}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-violet-600" />
                      Order Timeline
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Order Created</p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedBooking.originalOrder.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <CheckCircle2 size={20} className="text-green-600" />
                      </div>

                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Last Updated</p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedBooking.originalOrder.updatedAt).toLocaleString()}
                          </p>
                        </div>
                        <CheckCircle2 size={20} className="text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Raw Data (for debugging - you can remove this in production) */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
                    <details>
                      <summary className="font-semibold text-gray-700 dark:text-gray-300 cursor-pointer text-sm">
                        Raw Database Record
                      </summary>
                      <pre className="mt-3 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto bg-white dark:bg-gray-900 p-3 rounded-lg">
                        {JSON.stringify(selectedBooking.originalOrder, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-3">
                <button
                  onClick={() => window.open(`tel:${selectedBooking.originalOrder.user.phone}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-200 active:scale-95 transition-transform"
                >
                  <Phone size={18} /> Call Customer
                </button>
                <button className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                  <MessageSquare size={18} /> Contact Support
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
