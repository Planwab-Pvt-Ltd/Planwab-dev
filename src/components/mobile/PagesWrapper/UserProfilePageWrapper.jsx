"use client";

import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Settings,
  Heart,
  Calendar,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
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
  Plus,
  Crown,
  MessageCircle,
  ArrowRight,
  Copy,
  Share2,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_ADDRESSES = [
  { id: 1, type: "Home", text: "B-204, Ashoka Apts, Rohini Sec 18, Delhi" },
  { id: 2, type: "Work", text: "DLF Cyber City, Building 10, Gurgaon" },
];

const FAQS = [
  { q: "How do I cancel a booking?", a: "Go to My Bookings, select the event, and tap 'Cancel'." },
  { q: "When do I get my refund?", a: "Refunds are processed within 5-7 business days." },
  { q: "How do I contact a vendor?", a: "You can chat directly via the booking details page." },
];

const TRANSACTIONS = [
  { id: 1, title: "Added Money", date: "Today, 10:23 AM", amount: "+₹500", type: "credit" },
  { id: 2, title: "Paid to The Grand Heritage", date: "Yesterday", amount: "-₹1,200", type: "debit" },
  { id: 3, title: "Referral Bonus", date: "12 Oct", amount: "+₹100", type: "credit" },
];

// --- REUSABLE COMPONENTS ---

// 1. Drawer Component
const Drawer = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-gray-50 dark:bg-gray-900 rounded-t-[2rem] z-[70] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Drawer Handle */}
          <div className="w-full bg-white dark:bg-gray-900 pt-3 pb-4 px-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 rounded-t-[2rem]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide pb-20">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// 2. Menu Item
const MenuItem = ({ icon: Icon, label, subLabel, onClick, isDestructive = false, rightElement }) => (
  <button
    onClick={onClick}
    className="w-full group flex items-center justify-between p-4 bg-white dark:bg-gray-900/50 backdrop-blur-sm active:bg-gray-50 dark:active:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-none"
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-2.5 rounded-xl ${
          isDestructive
            ? "bg-red-50 dark:bg-red-900/20 text-red-500"
            : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:text-violet-600 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-colors"
        }`}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="text-left">
        <p className={`font-semibold text-sm ${isDestructive ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
          {label}
        </p>
        {subLabel && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subLabel}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2 text-gray-400">
      {rightElement}
      {!isDestructive && <ChevronRight size={16} />}
    </div>
  </button>
);

// 3. Toggle Switch
const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${
        checked ? "bg-violet-600" : "bg-gray-300 dark:bg-gray-700"
      }`}
    >
      <motion.div animate={{ x: checked ? 20 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-sm" />
    </button>
  </div>
);

// --- MAIN PAGE ---

export default function UserProfilePageWrapper() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // State for Drawers
  const [activeDrawer, setActiveDrawer] = useState(null);
  // Drawers: 'edit', 'address', 'security', 'notifications', 'referral', 'wallet', 'support', 'terms'

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({ push: true, email: true, promo: false });
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("PLANWAB20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Loading State
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-6 flex flex-col items-center pt-20 space-y-6">
        <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="w-48 h-6 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="w-full h-64 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  // 2. Logged Out State
  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-white dark:bg-black relative overflow-hidden flex flex-col">
        <div className="absolute top-[-10%] right-[-20%] w-80 h-80 bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-fuchsia-200/40 dark:bg-fuchsia-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 mb-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-2xl blur-lg opacity-40"></div>
            <Image
              src="/planwablogo.png"
              alt="PlanWAB"
              width={96}
              height={96}
              className="relative z-10 object-contain drop-shadow-xl"
            />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Log in to PlanWAB</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-xs mx-auto">
            Unlock exclusive deals, manage bookings, and earn rewards.
          </p>

          <div className="w-full space-y-4">
            <Link
              href="/sign-in"
              className="block w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg shadow-lg hover:shadow-violet-500/50 transition-all text-center"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="block w-full py-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-semibold text-lg text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. Logged In Dashboard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-32 overflow-x-hidden">
      {/* Header Profile Card */}
      <div className="relative bg-white dark:bg-gray-900 pb-10 pt-6 rounded-b-[3rem] shadow-sm overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent dark:from-violet-950/20 dark:to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center px-6">
          <h1 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Profile</h1>

          <div className="relative mb-4 group cursor-pointer" onClick={() => setActiveDrawer("edit")}>
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-violet-500 to-fuchsia-500 shadow-lg">
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-900"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-700 text-violet-600">
              <Edit2 size={14} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="px-4 space-y-6">
        {/* Loyalty & Wallet Section */}
        <div className="grid grid-cols-1 gap-4">
          {/* Gold Card */}
          <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg cursor-pointer transform active:scale-[0.98] transition-transform">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-yellow-100 text-xs font-bold uppercase tracking-wider mb-1">Membership</p>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  PlanWAB Gold <Crown size={18} fill="currentColor" />
                </h3>
              </div>
              <div className="text-right">
                <p className="text-yellow-100 text-xs">Points Balance</p>
                <p className="text-2xl font-bold">2,450</p>
              </div>
            </div>
          </div>

          {/* Wallet Balance - Clickable */}
          <div
            onClick={() => setActiveDrawer("wallet")}
            className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-bold">Wallet Balance</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₹1,200</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg pointer-events-none">
              Manage
            </button>
          </div>
        </div>

        {/* ACCOUNT */}
        <div>
          <h3 className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account Settings</h3>
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <MenuItem icon={User} label="Personal Information" onClick={() => setActiveDrawer("edit")} />
            <MenuItem icon={MapPin} label="Saved Addresses" onClick={() => setActiveDrawer("address")} />
            <MenuItem icon={Lock} label="Security & Password" onClick={() => setActiveDrawer("security")} />
          </div>
        </div>

        {/* PREFERENCES */}
        <div>
          <h3 className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Preferences</h3>
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <MenuItem
              icon={Bell}
              label="Notifications"
              rightElement={
                <div className="w-10 h-6 bg-violet-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              }
              onClick={() => setActiveDrawer("notifications")}
            />
            <MenuItem
              icon={darkMode ? Moon : Sun}
              label="Appearance"
              subLabel={darkMode ? "Dark Mode" : "Light Mode"}
              onClick={() => setDarkMode(!darkMode)}
              rightElement={
                <div
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    darkMode ? "bg-violet-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                      darkMode ? "right-1" : "left-1"
                    }`}
                  />
                </div>
              }
            />
          </div>
        </div>

        {/* REFERRAL BANNER - Clickable */}
        <div
          onClick={() => setActiveDrawer("referral")}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div>
            <h3 className="font-bold text-lg mb-1">Refer & Earn ₹500</h3>
            <p className="text-violet-100 text-xs max-w-[200px]">
              Invite your friends to PlanWAB and earn rewards on their first booking.
            </p>
          </div>
          <Gift size={32} className="text-yellow-400" />
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Support</h3>
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <MenuItem icon={HelpCircle} label="Help Center" onClick={() => setActiveDrawer("support")} />
            <MenuItem icon={FileText} label="Terms & Privacy" onClick={() => setActiveDrawer("terms")} />
            <MenuItem icon={LogOut} label="Log Out" isDestructive onClick={() => signOut({ redirectUrl: "/m" })} />
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-300">v2.4.0 (Build 2025)</p>
        </div>
      </div>

      {/* --- DRAWERS SECTION --- */}

      {/* 1. Edit Profile Drawer */}
      <Drawer isOpen={activeDrawer === "edit"} onClose={() => setActiveDrawer(null)} title="Edit Profile">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full">
                <Camera size={14} />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
              <input
                type="text"
                defaultValue={user.fullName}
                className="w-full p-4 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-violet-500 outline-none font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
              <input
                type="email"
                defaultValue={user.primaryEmailAddress.emailAddress}
                disabled
                className="w-full p-4 mt-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                className="w-full p-4 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-violet-500 outline-none font-medium"
              />
            </div>
          </div>
          <button
            onClick={() => setActiveDrawer(null)}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </Drawer>

      {/* 2. Addresses Drawer */}
      <Drawer isOpen={activeDrawer === "address"} onClose={() => setActiveDrawer(null)} title="Saved Addresses">
        <div className="space-y-4">
          {MOCK_ADDRESSES.map((addr) => (
            <div
              key={addr.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-start gap-4"
            >
              <div className="p-2 bg-violet-50 dark:bg-violet-900/20 text-violet-600 rounded-lg">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">{addr.type}</span>
                  <button className="text-xs text-violet-600 font-medium">Edit</button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{addr.text}</p>
              </div>
            </div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex items-center justify-center gap-2 text-gray-500 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Plus size={20} /> Add New Address
          </button>
        </div>
      </Drawer>

      {/* 3. Security Drawer */}
      <Drawer isOpen={activeDrawer === "security"} onClose={() => setActiveDrawer(null)} title="Security">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Change Password</label>
            <div className="space-y-3 mt-2">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-violet-500 outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-violet-500 outline-none"
              />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <Toggle label="Two-Factor Authentication" checked={true} onChange={() => {}} />
            <p className="text-xs text-gray-400 mt-1">We'll ask for a code when you log in.</p>
          </div>
          <button
            onClick={() => setActiveDrawer(null)}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg shadow-lg"
          >
            Update Security
          </button>
        </div>
      </Drawer>

      {/* 4. Notifications Drawer */}
      <Drawer isOpen={activeDrawer === "notifications"} onClose={() => setActiveDrawer(null)} title="Notifications">
        <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
          <Toggle
            label="Order Updates"
            checked={notifications.push}
            onChange={(v) => setNotifications({ ...notifications, push: v })}
          />
          <Toggle
            label="Email Summaries"
            checked={notifications.email}
            onChange={(v) => setNotifications({ ...notifications, email: v })}
          />
          <Toggle
            label="Promotional Offers"
            checked={notifications.promo}
            onChange={(v) => setNotifications({ ...notifications, promo: v })}
          />
        </div>
      </Drawer>

      {/* 5. Wallet Drawer */}
      <Drawer isOpen={activeDrawer === "wallet"} onClose={() => setActiveDrawer(null)} title="My Wallet">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg">
            <p className="text-violet-100 text-sm mb-1">Total Balance</p>
            <h2 className="text-4xl font-bold">₹1,200</h2>
            <div className="flex gap-3 mt-6 justify-center">
              <button className="px-6 py-2 bg-white text-violet-600 rounded-full text-sm font-bold shadow-md">
                Add Money
              </button>
              <button className="px-6 py-2 bg-violet-700/50 text-white rounded-full text-sm font-bold hover:bg-violet-700 transition-colors">
                History
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Recent Transactions</h3>
            <div className="space-y-3">
              {TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        tx.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowRight size={16} className="rotate-45" />
                      ) : (
                        <ArrowRight size={16} className="-rotate-45" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{tx.title}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      {/* 6. Referral Drawer */}
      <Drawer isOpen={activeDrawer === "referral"} onClose={() => setActiveDrawer(null)} title="Refer & Earn">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <Gift size={48} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invite Friends, Get ₹500</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              Share your unique code. When they book their first event, you both get ₹500 wallet credit!
            </p>
          </div>

          <div
            onClick={handleCopy}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer relative group"
          >
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Your Referral Code</p>
            <p className="text-2xl font-mono font-bold text-violet-600 tracking-widest">PLANWAB20</p>
            {copied ? (
              <div className="absolute inset-0 bg-green-500 text-white flex items-center justify-center rounded-xl font-bold transition-all">
                <Check className="mr-2" /> Copied!
              </div>
            ) : (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-violet-500">
                <Copy size={20} />
              </div>
            )}
          </div>

          <button className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
            <Share2 size={20} /> Share Now
          </button>
        </div>
      </Drawer>

      {/* 7. Support Drawer */}
      <Drawer isOpen={activeDrawer === "support"} onClose={() => setActiveDrawer(null)} title="Help Center">
        <div className="space-y-6">
          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-900/30 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center text-violet-600">
              <MessageCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Chat with Us</h4>
              <p className="text-xs text-gray-500">Typical reply time: 5 mins</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg">Start</button>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <p className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">{faq.q}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      {/* 8. Terms Drawer */}
      <Drawer isOpen={activeDrawer === "terms"} onClose={() => setActiveDrawer(null)} title="Legal">
        <div className="prose prose-sm dark:prose-invert">
          <h3>Terms of Service</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            By using PlanWAB, you agree to our terms. We ensure secure bookings and verified vendors. Cancellations must
            be made 48 hours prior for full refund...
          </p>
          <h3 className="mt-4">Privacy Policy</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Your data is safe with us. We do not share your personal details with third-party advertisers. Only booked
            vendors receive your contact info.
          </p>
        </div>
      </Drawer>
    </div>
  );
}
