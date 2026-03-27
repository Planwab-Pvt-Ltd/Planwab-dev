"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Shield,
  Info,
  CheckCircle,
  Crown,
  Sparkles,
} from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "For getting started",
    monthly: 0,
    yearly: 0,
    features: [
      { text: "Browse all vendors", included: true },
      { text: "Basic search", included: true },
      { text: "Save up to 5 vendors", included: true },
      { text: "Email support", included: true },
      { text: "Priority support", included: false },
      { text: "Advanced filters", included: false },
      { text: "Direct vendor chat", included: false },
      { text: "Analytics", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious planners",
    monthly: 499,
    yearly: 4990,
    popular: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Unlimited vendor saves", included: true },
      { text: "Advanced search filters", included: true },
      { text: "Priority support", included: true },
      { text: "Direct vendor chat", included: true },
      { text: "Early access to deals", included: true },
      { text: "Dedicated planner", included: false },
      { text: "Analytics dashboard", included: false },
    ],
  },
  {
    id: "max",
    name: "Max",
    description: "The complete package",
    monthly: 999,
    yearly: 9990,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Dedicated event planner", included: true },
      { text: "Premium vendor access", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Priority booking", included: true },
      { text: "Exclusive discounts", included: true },
      { text: "Custom recommendations", included: true },
      { text: "White-glove support", included: true },
    ],
  },
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      return resolve(true);
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export default function PricingPageWrapper() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fullAuthRedirectUrl = `${pathname}?${searchParams.toString()}`;

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  }, []);

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/user/subscription?userId=${user.id}`);
      if (res.ok) setSubscription(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded) fetchSubscription();
  }, [isLoaded, fetchSubscription]);

  const handleSelectPlan = async (planId) => {
    if (!user) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(fullAuthRedirectUrl)}`);
      return;
    }

    const current = subscription?.plan || "free";
    if (planId === current) return;

    if (planId === "free") {
      setProcessing(true);
      try {
        const res = await fetch("/api/user/subscription", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, plan: "free" }),
        });
        if (res.ok) {
          await fetchSubscription();
          showToast("Switched to Free plan");
        } else {
          showToast("Failed to switch plan", "error");
        }
      } catch {
        showToast("Something went wrong", "error");
      } finally {
        setProcessing(false);
      }
      return;
    }

    setProcessing(true);
    const scriptOk = await loadRazorpayScript();
    if (!scriptOk) {
      setProcessing(false);
      return showToast("Payment system unavailable", "error");
    }

    try {
      const res = await fetch("/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan: planId, billingCycle }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Order failed");

      const label =
        planId.charAt(0).toUpperCase() + planId.slice(1);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "PlanWAB",
        description: `${label} Plan — ${billingCycle}`,
        order_id: data.razorpayOrderId,
        modal: {
          ondismiss: () => {
            setProcessing(false);
            showToast("Payment cancelled", "info");
          },
        },
        handler: async (response) => {
          try {
            const v = await fetch("/api/user/subscription", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                plan: planId,
                billingCycle,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const vd = await v.json();
            if (vd.success) {
              await fetchSubscription();
              showToast(`Upgraded to ${label}!`);
            } else {
              showToast("Verification failed", "error");
            }
          } catch {
            showToast("Verification error", "error");
          }
          setProcessing(false);
        },
        prefill: {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        },
        theme: { color: "#111827" },
      };

      const rp = new window.Razorpay(options);
      rp.open();
      rp.on("payment.failed", (r) => {
        showToast(r.error.description || "Payment failed", "error");
        setProcessing(false);
      });
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
      setProcessing(false);
    }
  };

  const current = subscription?.plan || "free";

  const btnConfig = (id) => {
    if (id === current)
      return {
        text: "Current Plan",
        disabled: true,
        cls: "bg-gray-100 dark:bg-gray-800 text-gray-400",
      };
    if (id === "free")
      return {
        text: "Switch to Free",
        disabled: false,
        cls: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200",
      };
    return {
      text: `Get ${id === "pro" ? "Pro" : "Max"}`,
      disabled: false,
      cls: "bg-gray-900 dark:bg-white text-white dark:text-black",
    };
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black pb-16">
      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className={`fixed top-4 left-4 right-4 z-[200] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white text-sm font-medium ${
              toast.type === "error"
                ? "bg-red-500"
                : toast.type === "info"
                ? "bg-gray-700"
                : "bg-emerald-500"
            }`}
          >
            <Info size={16} />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast((t) => ({ ...t, visible: false }))}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
          >
            <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Plans
          </h1>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Choose your plan
          </h2>
          <p className="text-[13px] text-gray-400">
            Start free, upgrade anytime
          </p>
        </div>

        {/* Active Plan Banner */}
        {!loading && user && current !== "free" && subscription?.isActive && (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Crown size={16} className="text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
                {current.charAt(0).toUpperCase() + current.slice(1)} Plan Active
              </p>
              {subscription.planExpiresAt && (
                <p className="text-[11px] text-gray-400">
                  Renews{" "}
                  {new Date(subscription.planExpiresAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </p>
              )}
              {subscription.planPurchasedAt && (
                <p className="text-[11px] text-gray-400">
                  Purchased On{" "}
                  {new Date(subscription.planPurchasedAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </p>
              )}
            </div>
            <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-100 dark:border-gray-800">
            {["monthly", "yearly"].map((c) => (
              <button
                key={c}
                onClick={() => setBillingCycle(c)}
                className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all relative ${
                  billingCycle === c
                    ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm"
                    : "text-gray-400"
                }`}
              >
                {c === "monthly" ? "Monthly" : "Yearly"}
                {c === "yearly" && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[8px] font-bold px-1 py-px rounded leading-none">
                    -17%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {PLANS.map((plan) => {
              const b = btnConfig(plan.id);
              const price =
                billingCycle === "monthly" ? plan.monthly : plan.yearly;
              const isCurrent = plan.id === current;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-gray-900 rounded-2xl border-2 p-5 relative transition-colors ${
                    isCurrent
                      ? "border-violet-200 dark:border-violet-800"
                      : plan.popular
                      ? "border-gray-900 dark:border-white"
                      : "border-gray-100 dark:border-gray-800"
                  }`}
                >
                  {/* Badges */}
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-4 bg-violet-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Current
                    </span>
                  )}
                  {plan.popular && !isCurrent && (
                    <span className="absolute -top-2.5 left-4 bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={9} /> Popular
                    </span>
                  )}

                  <div className="mb-3 pt-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    {plan.monthly > 0 && (
                      <span className="text-[13px] text-gray-400">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-5">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        {f.included ? (
                          <Check
                            size={14}
                            className="text-emerald-500 shrink-0"
                            strokeWidth={3}
                          />
                        ) : (
                          <X
                            size={14}
                            className="text-gray-200 dark:text-gray-700 shrink-0"
                          />
                        )}
                        <span
                          className={`text-[13px] ${
                            f.included
                              ? "text-gray-700 dark:text-gray-200"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={b.disabled || processing}
                    className={`w-full py-3 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 ${b.cls}`}
                  >
                    {b.text}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Guarantee */}
        {/* <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-start gap-3">
          <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center shrink-0">
            <Shield size={15} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
              7-day money-back guarantee
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              Not satisfied? Get a full refund within 7 days. No questions asked.
            </p>
          </div>
        </div> */}

        <p className="text-center text-[10px] text-gray-200 dark:text-gray-700 pb-4 select-none">
          Prices in INR · Inclusive of applicable taxes
        </p>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 dark:bg-black/90 z-50 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-[3px] border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-white rounded-full animate-spin mb-4" />
            <p className="font-semibold text-gray-900 dark:text-white">
              Processing…
            </p>
            <p className="text-[13px] text-gray-400 mt-1">
              Do not close this page
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}