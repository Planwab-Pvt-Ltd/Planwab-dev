"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Crown,
  Star,
  Shield,
  Users,
  Calendar,
  TrendingUp,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle,
  Loader2,
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
      { text: "Analytics dashboard", included: false },
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

const WHY_FEATURES = [
  {
    icon: Users,
    title: "Customer Reach",
    description: "Connect with thousands of customers actively searching for services",
  },
  {
    icon: Calendar,
    title: "Booking Management",
    description: "Streamlined system to manage appointments and availability",
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "Data-driven insights to scale your business faster",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe payment processing with instant settlements",
  },
];

const FAQS = [
  {
    q: "How does PlanWAB pricing work?",
    a: "Subscription-based pricing. Choose a plan, pay monthly or yearly. Upgrade or downgrade anytime.",
  },
  {
    q: "Can I change my plan anytime?",
    a: "Yes. Upgrade or downgrade from your dashboard. Changes take effect immediately.",
  },
  {
    q: "Is there a commission on bookings?",
    a: "No hidden commissions. Your subscription covers everything listed in your plan features.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, credit/debit cards, net banking, and digital wallets via Razorpay.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes. Cancel anytime. Your plan stays active until the current billing period ends, then reverts to Free.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    business: "Wedding Photographer",
    text: "PlanWAB doubled my bookings in 3 months. The platform is incredible.",
    rating: 5,
  },
  {
    name: "Rajesh Caterers",
    business: "Catering Service",
    text: "Best investment for my business. Lead quality is excellent.",
    rating: 5,
  },
  {
    name: "Mehndi by Kavya",
    business: "Mehendi Artist",
    text: "Love how easy it is to manage bookings and showcase my portfolio.",
    rating: 5,
  },
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]'))
      return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const PricingPageWrapper = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fullAuthRedirectUrl = `${pathname}?${searchParams.toString()}`;

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [processing, setProcessing] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

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
      if (!data.success) throw new Error(data.error || "Order failed");

      const label = planId.charAt(0).toUpperCase() + planId.slice(1);

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
      showToast(err.message || "Something went wrong", "error");
      setProcessing(false);
    }
  };

  const current = subscription?.plan || "free";

  const getPrice = (plan) => (billingCycle === "monthly" ? plan.monthly : plan.yearly);

  const getSavings = (plan) => {
    if (billingCycle === "yearly" && plan.monthly > 0) {
      return Math.round(((plan.monthly * 12 - plan.yearly) / (plan.monthly * 12)) * 100);
    }
    return 0;
  };

  const btnConfig = (id) => {
    if (id === current)
      return {
        text: "Current Plan",
        disabled: true,
        cls: "bg-gray-100 text-gray-400 cursor-default",
      };
    if (id === "free")
      return {
        text: "Switch to Free",
        disabled: false,
        cls: "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50",
      };
    if (id === "pro")
      return {
        text: "Get Pro",
        disabled: false,
        cls: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg",
      };
    return {
      text: "Get Max",
      disabled: false,
      cls: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg",
    };
  };

  const cardBorder = (plan) => {
    const isCurrent = plan.id === current;
    if (isCurrent) return "border-violet-400 ring-2 ring-violet-100";
    if (plan.popular) return "border-gray-900 ring-2 ring-gray-200 shadow-xl";
    return "border-gray-100 hover:border-gray-200";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white text-sm font-medium max-w-md ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Choose your plan
          </h1>
          <p className="text-lg text-gray-500 mb-8">Start free, upgrade when you need more</p>

          {/* Active Plan Banner */}
          {!loading && user && current !== "free" && subscription?.isActive && (
            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-sm mb-6">
              <Crown size={16} className="text-violet-600" />
              <span className="text-sm font-semibold text-gray-900">
                {current.charAt(0).toUpperCase() + current.slice(1)} Plan Active
              </span>
              {subscription.planExpiresAt && (
                <span className="text-xs text-gray-400">
                  · Renews{" "}
                  {new Date(subscription.planExpiresAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
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
              <CheckCircle size={16} className="text-emerald-500" />
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
              {["monthly", "yearly"].map((c) => (
                <button
                  key={c}
                  onClick={() => setBillingCycle(c)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                    billingCycle === c
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {c === "monthly" ? "Monthly" : "Yearly"}
                  {c === "yearly" && (
                    <span className="absolute -top-2.5 -right-2.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      -17%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[520px] bg-white rounded-3xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan) => {
              const b = btnConfig(plan.id);
              const price = getPrice(plan);
              const isCurrent = plan.id === current;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`bg-white rounded-3xl p-8 border-2 ${cardBorder(plan)} relative overflow-hidden h-full flex flex-col transition-all duration-300`}
                >
                  {/* Badges */}
                  {isCurrent && (
                    <span className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                      Current
                    </span>
                  )}
                  {plan.popular && !isCurrent && (
                    <span className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={10} /> Popular
                    </span>
                  )}

                  <div className="mb-6 pt-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    {plan.monthly > 0 && (
                      <div className="flex flex-col items-start">
                        <span className="text-gray-400 font-medium text-sm">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                        {billingCycle === "yearly" && getSavings(plan) > 0 && (
                          <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                            Save {getSavings(plan)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3.5 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-0.5 rounded-full shrink-0 ${
                            f.included ? "bg-emerald-100" : "bg-gray-100"
                          }`}
                        >
                          {f.included ? (
                            <Check size={13} className="text-emerald-600" strokeWidth={3} />
                          ) : (
                            <X size={13} className="text-gray-300" />
                          )}
                        </div>
                        <span
                          className={`text-sm leading-relaxed ${
                            f.included ? "text-gray-700 font-medium" : "text-gray-300"
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
                    className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 ${b.cls}`}
                  >
                    {processing ? (
                      <Loader2 size={18} className="animate-spin mx-auto" />
                    ) : (
                      b.text
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Why Choose Us */}
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Why PlanWAB?</h3>
            <p className="text-gray-400">Everything you need to grow your event business</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-5 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="p-4 bg-gray-50 rounded-2xl mb-4 text-gray-600">
                  <f.icon size={28} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Trusted by vendors
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-5 leading-relaxed text-sm">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise + Support */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-3xl p-10 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <Crown size={40} className="mb-5 text-amber-400" />
            <h3 className="text-2xl font-bold mb-3">Enterprise</h3>
            <p className="text-gray-400 mb-8 max-w-sm text-sm">
              Multiple locations or custom requirements? Let&apos;s build a plan for you.
            </p>
            <a
              href="https://wa.me/916267430959?text=Hi%2C%20I%27m%20interested%20in%20an%20enterprise%20plan"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Contact Sales
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-10 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need help?</h3>
              <p className="text-gray-400 text-sm">Available 24/7</p>
            </div>
            <div className="grid gap-3">
              <a
                href="tel:+916267430959"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition-colors"
              >
                <Phone size={18} />
                +91 6267430959
              </a>
              <a
                href="https://wa.me/916267430959"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">FAQ</h3>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900 text-[15px]">{faq.q}</span>
                  {expandedFAQ === i ? (
                    <ChevronUp size={18} className="text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-300 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFAQ === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        {/* <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
          <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600 shrink-0">
            <Shield size={28} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-emerald-900 mb-1">
              7-day money-back guarantee
            </h4>
            <p className="text-emerald-700 text-sm leading-relaxed">
              Not satisfied? Get a full refund within 7 days, no questions asked.
            </p>
          </div>
        </div> */}

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-xs text-gray-300">
            Prices in INR · Inclusive of applicable taxes
          </p>
        </div>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center"
          >
            <div className="w-14 h-14 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
            <p className="font-semibold text-gray-900 text-lg">Processing…</p>
            <p className="text-sm text-gray-400 mt-1">Do not close this page</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingPageWrapper;