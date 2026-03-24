"use client";

import React, { useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Wallet,
  ChevronRight,
  Edit2,
  Check,
  CheckCircle2,
  Circle,
  MapPin,
  Camera,
  Utensils,
  Music,
  Palette,
  Gift,
  Cake,
  Heart,
  Flower2,
  Ticket,
  Users,
  Compass,
} from "lucide-react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";

// ─── Per-category static data ────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  Wedding: {
    label: "Wedding",
    emoji: "💒",
    primary: "#e11d48",
    primaryDark: "#be123c",
    primaryLight: "#ffe4e6",
    accentBg: "from-rose-50 to-pink-50",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    progressBg: "bg-rose-100",
    progressBar: "bg-gradient-to-r from-rose-400 to-pink-400",
    checklist: [
      { id: 1, label: "Set wedding date & time", done: false, priority: "high", Icon: Heart },
      { id: 2, label: "Book a beautiful venue", done: true, priority: "high", Icon: MapPin },
      { id: 3, label: "Hire a photographer", done: false, priority: "high", Icon: Camera },
      { id: 4, label: "Plan floral decorations", done: false, priority: "medium", Icon: Flower2 },
      { id: 5, label: "Arrange catering", done: false, priority: "high", Icon: Utensils },
      { id: 6, label: "Book live music / DJ", done: false, priority: "medium", Icon: Music },
      { id: 7, label: "Finalize guest list", done: false, priority: "high", Icon: Users },
    ],
    budget: {
      total: 1000000,
      spent: 300000,
      items: [
        { label: "Venue", allocated: 350000, spent: 300000, color: "#e11d48" },
        { label: "Catering", allocated: 250000, spent: 0, color: "#ea580c" },
        { label: "Decor", allocated: 150000, spent: 0, color: "#f472b6" },
        { label: "Photography", allocated: 100000, spent: 0, color: "#10b981" },
        { label: "Clothing", allocated: 150000, spent: 0, color: "#8b5cf6" },
      ],
    },
  },
  Anniversary: {
    label: "Anniversary",
    emoji: "💝",
    primary: "#d97706",
    primaryDark: "#b45309",
    primaryLight: "#fef3c7",
    accentBg: "from-amber-50 to-orange-50",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    progressBg: "bg-amber-100",
    progressBar: "bg-gradient-to-r from-amber-400 to-orange-400",
    checklist: [
      { id: 1, label: "Set anniversary date & time", done: false, priority: "high", Icon: Heart },
      { id: 2, label: "Book a romantic venue", done: false, priority: "high", Icon: MapPin },
      { id: 3, label: "Arrange floral decorations", done: true, priority: "medium", Icon: Flower2 },
      { id: 4, label: "Plan surprise gifts", done: false, priority: "low", Icon: Gift },
      { id: 5, label: "Book photographer", done: false, priority: "medium", Icon: Camera },
      { id: 6, label: "Arrange special dinner", done: true, priority: "high", Icon: Utensils },
      { id: 7, label: "Book live music / band", done: false, priority: "medium", Icon: Music },
    ],
    budget: {
      total: 75000,
      spent: 18000,
      items: [
        { label: "Venue", allocated: 30000, spent: 0, color: "#d97706" },
        { label: "Catering", allocated: 20000, spent: 18000, color: "#ea580c" },
        { label: "Decor", allocated: 12000, spent: 0, color: "#f472b6" },
        { label: "Photography", allocated: 8000, spent: 0, color: "#10b981" },
        { label: "Gifts", allocated: 5000, spent: 0, color: "#8b5cf6" },
      ],
    },
  },
  Birthday: {
    label: "Birthday",
    emoji: "🎂",
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#dbeafe",
    accentBg: "from-blue-50 to-indigo-50",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    progressBg: "bg-blue-100",
    progressBar: "bg-gradient-to-r from-blue-500 to-indigo-500",
    checklist: [
      { id: 1, label: "Set party date & time", done: false, priority: "high", Icon: Cake },
      { id: 2, label: "Create guest list", done: false, priority: "high", Icon: Ticket },
      { id: 3, label: "Book venue", done: false, priority: "high", Icon: MapPin },
      { id: 4, label: "Order cake", done: false, priority: "medium", Icon: Cake },
      { id: 5, label: "Plan decorations", done: false, priority: "medium", Icon: Palette },
      { id: 6, label: "Arrange catering", done: false, priority: "high", Icon: Utensils },
      { id: 7, label: "Book photographer", done: false, priority: "low", Icon: Camera },
    ],
    budget: {
      total: 50000,
      spent: 0,
      items: [
        { label: "Venue", allocated: 15000, spent: 0, color: "#6d28d9" },
        { label: "Catering", allocated: 12000, spent: 0, color: "#ea580c" },
        { label: "Cake", allocated: 5000, spent: 0, color: "#f472b6" },
        { label: "Decor", allocated: 8000, spent: 0, color: "#10b981" },
        { label: "Entertainment", allocated: 10000, spent: 0, color: "#2563eb" },
      ],
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

const PRIORITY_DOT = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-green-400",
};

// ─── PlanningChecklist ────────────────────────────────────────────────────────

const PlanningChecklist = memo(({ config }) => {
  const [showAll, setShowAll] = useState(false);
  const [checked, setChecked] = useState(() =>
    config.checklist.reduce((acc, item) => ({ ...acc, [item.id]: item.done }), {})
  );

  const doneCount = Object.values(checked).filter(Boolean).length;
  const total = config.checklist.length;
  const pct = Math.round((doneCount / total) * 100);

  const toggle = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: config.primaryLight }}
        >
          <ClipboardList size={20} style={{ color: config.primary }} />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 leading-tight">
            Planning Checklist
          </h3>
          <p className="text-[12px] text-gray-500">{total} tasks total</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-[13px] font-bold" style={{ color: config.primary }}>
            {doneCount}/{total}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className={`h-1.5 ${config.progressBg} rounded-full overflow-hidden`}>
          <motion.div
            className={`h-full ${config.progressBar} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1 text-right">{pct}% complete</p>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-0 flex-1">
        {config.checklist.slice(0, showAll ? config.checklist.length : 4).map((item) => {
          const isDone = checked[item.id];
          return (
            <motion.button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 cursor-pointer group text-left w-full"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2
                    size={22}
                    strokeWidth={1.5}
                    style={{ color: config.primary }}
                  />
                ) : (
                  <Circle size={22} strokeWidth={1.5} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                )}
              </div>
              <span
                className={`text-[14px] flex-1 font-medium transition-colors ${
                  isDone ? "line-through text-gray-400" : "text-gray-700 group-hover:text-gray-900"
                }`}
              >
                {item.label}
              </span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[item.priority]}`} />
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold transition-colors self-end hover:opacity-80 active:scale-95 duration-150"
        style={{ color: config.primary }}
      >
        {showAll ? "Show Less" : "View All Tasks"}
        <ChevronRight size={15} className={`transition-transform duration-200 ${showAll ? "rotate-90" : ""}`} />
      </button>
    </div>
  );
});
PlanningChecklist.displayName = "PlanningChecklist";

// ─── BudgetTracker ────────────────────────────────────────────────────────────

const BudgetTracker = memo(({ config }) => {
  const [showAll, setShowAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { budget } = config;
  const [localBudget, setLocalBudget] = useState(budget);

  // Sync with config if it changes
  React.useEffect(() => {
    setLocalBudget(budget);
  }, [budget]);

  const remaining = localBudget.total - localBudget.spent;
  const spentPct = localBudget.total > 0 ? Math.round((localBudget.spent / localBudget.total) * 100) : 0;

  const handleItemAllocatedChange = (label, value) => {
    setLocalBudget((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.label === label ? { ...item, allocated: Number(value) } : item
      ),
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: config.primaryLight }}
        >
          <Wallet size={20} style={{ color: config.primary }} />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 leading-tight">
            Budget Tracker
          </h3>
          <p className="text-[12px] text-gray-500">Manage your expenses</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isEditing ? "bg-green-50 hover:bg-green-100" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {isEditing ? (
            <Check size={13} className="text-green-600 font-bold" />
          ) : (
            <Edit2 size={13} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Total Budget */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] text-gray-500 font-medium">Total Budget</span>
          {isEditing ? (
            <div className="flex items-center">
              <span style={{ color: config.primary }} className="font-semibold text-[14px]">₹</span>
              <input
                type="number"
                value={localBudget.total}
                onChange={(e) =>
                  setLocalBudget((prev) => ({ ...prev, total: Number(e.target.value) }))
                }
                className="w-32 text-[18px] font-black p-0 text-right border-b border-gray-300 focus:outline-none focus:border-amber-400 bg-transparent pr-1"
                style={{ color: config.primary }}
              />
            </div>
          ) : (
            <span className="text-[22px] font-black" style={{ color: config.primary }}>
              {formatCurrency(localBudget.total)}
            </span>
          )}
        </div>

        {isEditing && (
          <div className="mb-3 px-1">
            <input
              type="range"
              min={Math.max(1000, localBudget.spent)}
              max={budget.total * 3}
              step={1000}
              value={localBudget.total}
              onChange={(e) =>
                setLocalBudget((prev) => ({ ...prev, total: Number(e.target.value) }))
              }
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-1"
            />
            <p className="text-[10px] text-gray-400 mt-1">Slide to adjust total budget</p>
          </div>
        )}
        <div className={`h-1.5 ${config.progressBg} rounded-full overflow-hidden mb-2`}>
          <motion.div
            className={`h-full ${config.progressBar} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${spentPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-gray-500">
            Spent:{" "}
            <span className="font-semibold text-gray-700">
              ₹{localBudget.spent.toLocaleString("en-IN")}
            </span>
          </span>
          <span className="text-gray-500">
            Remaining:{" "}
            <span className="font-bold" style={{ color: config.primary }}>
              {formatCurrency(remaining)}
            </span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-3" />

      {/* Budget Items */}
      <div className="flex flex-col gap-2 flex-1">
        {localBudget.items.slice(0, showAll ? localBudget.items.length : 4).map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[13px] text-gray-700 font-medium">{item.label}</span>
            </div>
            <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1">
              <span>₹{item.spent.toLocaleString("en-IN")} /</span>
              {isEditing ? (
                <div className="flex items-center relative gap-0.5">
                  <span className="text-[10px] text-gray-400">₹</span>
                  <input
                    type="number"
                    value={item.allocated}
                    onChange={(e) => handleItemAllocatedChange(item.label, e.target.value)}
                    className="w-24 h-5 p-0 text-[12px] text-right font-semibold text-gray-700 hover:bg-gray-50 focus:bg-white border focus:border-amber-400 rounded px-1 focus:outline-none duration-150 transition-all bg-white"
                  />
                </div>
              ) : (
                <span className="font-semibold text-gray-700">
                  {formatCurrency(item.allocated)}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold transition-colors self-end hover:opacity-80 active:scale-95 duration-150"
        style={{ color: config.primary }}
      >
        {showAll ? "Show Less" : "View Full Budget"}
        <ChevronRight size={15} className={`transition-transform duration-200 ${showAll ? "rotate-90" : ""}`} />
      </button>
    </div>
  );
});
BudgetTracker.displayName = "BudgetTracker";

// ─── Main Section ─────────────────────────────────────────────────────────────

const PlanningPreviewSection = memo(({ category }) => {
  const router = useRouter();

  // Fallback to checking the URL path if the store is not initialized or still "Default"
  let categoryToCheck = category;
  if (!categoryToCheck || categoryToCheck === "Default" || categoryToCheck === "events") {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      if (path.includes("anniversary")) categoryToCheck = "Anniversary";
      else if (path.includes("birthday")) categoryToCheck = "Birthday";
      else categoryToCheck = "Wedding"; // Default to Wedding if not Anniversary or Birthday
    } else {
      categoryToCheck = "Wedding"; // Default fallback
    }
  }

  const config = CATEGORY_CONFIG[categoryToCheck];
  if (!config) return null;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Section heading */}
      <motion.div variants={cardVariants} className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{config.emoji}</span>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Plan Your{" "}
              <span style={{ color: config.primary }}>{config.label}</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Stay organised with your personal planning tools
            </p>
          </div>
        </div>
      </motion.div>

      {/* Two-column card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Checklist Card */}
        <motion.div
          variants={cardVariants}
          className={`bg-gradient-to-br ${config.accentBg} rounded-3xl p-8 border border-white/60 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-sm`}
        >
          <PlanningChecklist config={config} />
        </motion.div>

        {/* Budget Card */}
        <motion.div
          variants={cardVariants}
          className={`bg-gradient-to-br ${config.accentBg} rounded-3xl p-8 border border-white/60 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-sm`}
        >
          <BudgetTracker config={config} />
        </motion.div>
      </div>

      {/* Bottom hint */}
      <motion.p
        variants={cardVariants}
        className="text-center text-[12px] text-gray-400 mt-6 font-medium"
      >
        ✨ These tools update in real-time as you plan your event
      </motion.p>
    </motion.section>
  );
});

PlanningPreviewSection.displayName = "PlanningPreviewSection";
export default PlanningPreviewSection;
