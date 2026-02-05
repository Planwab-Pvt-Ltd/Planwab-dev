"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Settings,
  Heart,
  Calendar,
  CreditCard,
  Star,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Share2,
  Bookmark,
  Shield,
  Bell,
  Sparkles,
  MapPin,
  Lock,
  FileText,
  X,
  Camera,
  Moon,
  Sun,
  Edit2,
  Gift,
  Wallet,
  CheckCircle2,
  ChevronLeft,
  Plus,
  Crown,
  MessageCircle,
  ArrowRight,
  Copy,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  TrendingUp,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_ADDRESSES = [
  { id: 1, type: "Home", text: "B-204, Ashoka Apts, Rohini Sec 18, Delhi" },
  { id: 2, type: "Work", text: "DLF Cyber City, Building 10, Gurgaon" },
];

const TRANSACTIONS = [
  { id: 1, title: "Wallet Recharge", date: "Today, 10:23 AM", amount: "+₹500", type: "credit" },
  { id: 2, title: "Booking: The Grand Heritage", date: "Yesterday", amount: "-₹1,200", type: "debit" },
  { id: 3, title: "Referral Reward", date: "12 Oct", amount: "+₹100", type: "credit" },
];

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, isActive, onClick, isDestructive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
      isActive 
        ? "bg-violet-600 text-white shadow-lg shadow-violet-200" 
        : isDestructive 
          ? "hover:bg-red-50 text-red-500" 
          : "hover:bg-slate-100 text-slate-600 dark:text-slate-400"
    }`}
  >
    <Icon size={20} strokeWidth={isActive ? 3 : 2} />
    <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
      {label}
    </span>
  </button>
);

const ProfileVendorCard = ({ vendor }) => (
  <Link href={`/vendor/${vendor.category}/${vendor._id}`} className="flex-shrink-0 w-64 group">
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="h-36 w-full relative overflow-hidden">
        <img src={vendor.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm">
          <Star size={10} className="fill-yellow-500 text-yellow-500" /> {vendor.rating || "4.5"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white truncate">{vendor.name}</h3>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={12} /> {vendor.address?.city || "New Delhi"}</p>
      </div>
    </div>
  </Link>
);

// --- MAIN PAGE WRAPPER ---

export default function UserProfilePageWrapper() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [loadingLists, setLoadingLists] = useState(true);
  const [likedVendors, setLikedVendors] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (isSignedIn) {
      // Simulate API fetch for liked/watchlist items
      setTimeout(() => {
        setLikedVendors([]); // Placeholder for actual data
        setWatchlist([]);
        setLoadingLists(false);
      }, 800);
    }
  }, [isSignedIn]);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-violet-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-violet-100">
            <User className="text-violet-600" size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Member Portal</h1>
          <p className="text-slate-500 text-lg mb-10 font-medium leading-relaxed">Sign in to manage your events, track vendor favorites, and access your PlanWAB wallet.</p>
          <div className="space-y-4">
            <Link href="/sign-in" className="block w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-200 hover:bg-violet-600 transition-all">SIGN IN</Link>
            <Link href="/sign-up" className="block w-full py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">JOIN NOW</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex pt-18">
      {/* 1. Dashboard Sidebar Navigation */}
      <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen sticky top-0 flex flex-col p-6 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-4 mb-10 px-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <Settings size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tighter uppercase">Settings</h2>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={User} label="My Profile" isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <SidebarItem icon={Wallet} label="Wallet & Rewards" isActive={activeTab === "wallet"} onClick={() => setActiveTab("wallet")} />
          <SidebarItem icon={ShieldCheck} label="Privacy & Security" isActive={activeTab === "security"} onClick={() => setActiveTab("security")} />
          <SidebarItem icon={MapPin} label="Saved Addresses" isActive={activeTab === "address"} onClick={() => setActiveTab("address")} />
          <SidebarItem icon={Bell} label="Notifications" isActive={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <SidebarItem icon={HelpCircle} label="Help & Support" isActive={activeTab === "support"} onClick={() => setActiveTab("support")} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
          <SidebarItem icon={LogOut} label="Sign Out" isDestructive onClick={() => signOut({ redirectUrl: "/" })} />
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 mt-6 text-center uppercase tracking-widest">PlanWAB Portal v2.5.0</p>
        </div>
      </aside>

      {/* 2. Main Dynamic Content Area */}
      <main className="flex-1 p-12 max-w-7xl mx-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              {/* Profile Header */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <img src={user.imageUrl} className="w-32 h-32 rounded-[40px] object-cover ring-8 ring-slate-50 dark:ring-slate-800 shadow-2xl transition-transform group-hover:scale-105" />
                    <button className="absolute -bottom-2 -right-2 p-3 bg-violet-600 text-white rounded-2xl shadow-xl shadow-violet-200 hover:scale-110 transition-all"><Camera size={18} /></button>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{user.fullName}</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-1">{user.primaryEmailAddress.emailAddress}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-tighter border border-emerald-100">Verified User</span>
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-tighter border border-indigo-100">PlanWAB Gold</span>
                    </div>
                  </div>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-violet-600 transition-all shadow-xl shadow-slate-100">EDIT PROFILE</button>
              </div>

              {/* Statistics Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                 <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-8 rounded-[40px] text-white shadow-2xl shadow-yellow-100 relative overflow-hidden group">
                    <Crown className="absolute -top-4 -right-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-4">Gold Reward Points</p>
                    <p className="text-5xl font-black">2,450</p>
                    <Link href="/rewards" className="inline-flex items-center gap-2 mt-6 text-sm font-bold bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md hover:bg-white/30 transition-all">Redeem Now <ArrowRight size={14} /></Link>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Events Hosted</p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white">12</p>
                    <div className="flex items-center gap-2 mt-6 text-xs font-bold text-emerald-500 uppercase tracking-widest"><TrendingUp size={14} /> 28% Growth</div>
                 </div>
                 <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-100">
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-4">Wallet Balance</p>
                    <p className="text-5xl font-black">₹1,200</p>
                    <div className="flex gap-2 mt-6">
                      <button className="flex-1 py-2.5 bg-white text-indigo-600 rounded-xl font-black text-xs">ADD MONEY</button>
                      <button className="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl font-black text-xs">HISTORY</button>
                    </div>
                 </div>
              </div>

              {/* Liked Vendors - Horizontal Slider */}
              <section className="space-y-6">
                <div className="flex items-end justify-between px-2">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Vendor Favorites</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Venues and services you loved</p>
                  </div>
                  <button className="text-xs font-black text-violet-600 uppercase underline underline-offset-4 tracking-widest">View Full List</button>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 px-2 snap-x">
                   {loadingLists ? [...Array(4)].map((_, i) => <div key={i} className="w-64 h-48 bg-slate-100 animate-pulse rounded-3xl" />) : (
                     likedVendors.length > 0 ? likedVendors.map(v => <ProfileVendorCard key={v._id} vendor={v} />) : (
                       <div className="w-full bg-white dark:bg-slate-900 rounded-[32px] p-12 text-center border border-slate-100 dark:border-slate-800 border-dashed">
                          <Heart size={48} className="text-slate-200 mx-auto mb-4" />
                          <p className="font-bold text-slate-400">Your liked vendors will appear here</p>
                          <Link href="/vendors/marketplace" className="text-sm font-black text-violet-600 uppercase mt-4 block tracking-widest">Start Exploring</Link>
                       </div>
                     )
                   )}
                </div>
              </section>

              {/* Referral Center */}
              <div className="bg-slate-900 rounded-[40px] p-10 flex items-center justify-between text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 blur-[80px]" />
                <div className="relative z-10 space-y-6 max-w-xl">
                  <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.2em]">Referral Hub</span>
                  <h3 className="text-4xl font-black leading-tight">Gift your friends ₹500. <br /> Get ₹500 in return.</h3>
                  <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-md w-fit">
                    <span className="px-6 font-mono font-black text-lg tracking-widest">PLANWAB2025</span>
                    <button className="p-4 bg-white text-slate-900 rounded-xl font-black text-xs hover:scale-105 transition-all">COPY CODE</button>
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <div className="w-64 h-64 bg-indigo-500 rounded-[48px] rotate-12 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                    <Gift size={96} className="text-white -rotate-12" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "wallet" && (
            <motion.div key="wallet" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               <h2 className="text-4xl font-black tracking-tight mb-8">Wallet & Transactions</h2>
               <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Statement History</h4>
                        <button className="text-xs font-bold text-blue-600">Export PDF</button>
                      </div>
                      <div className="p-4">
                        {TRANSACTIONS.map(tx => (
                          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                <Zap size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{tx.title}</p>
                                <p className="text-xs text-slate-400 font-medium">{tx.date}</p>
                              </div>
                            </div>
                            <span className={`font-black text-lg ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>{tx.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                     <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6">Payment Methods</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-6 bg-slate-900 rounded flex items-center justify-center font-bold text-[10px] text-white">VISA</div>
                               <span className="font-bold text-sm">•••• 4242</span>
                             </div>
                             <CheckCircle2 size={16} className="text-emerald-500" />
                          </div>
                          <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 font-black text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-all">
                             <Plus size={18} /> Add New Card
                          </button>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* Add placeholders for other tabs to prevent empty space */}
          {["security", "address", "notifications", "support"].includes(activeTab) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-96 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4 text-slate-300">
                  <LayoutDashboard size={40} />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter">{activeTab} Details</h3>
               <p className="text-slate-400 font-medium">This module is currently syncing with the cloud.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}