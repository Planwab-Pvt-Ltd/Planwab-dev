"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Crown,
  Star,
  Zap,
  Shield,
  Users,
  Camera,
  Calendar,
  TrendingUp,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Gift,
  Target,
} from "lucide-react";

const PricingPageWrapper = () => {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free Starter",
      description: "Perfect for new vendors getting started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      originalMonthlyPrice: 0,
      badge: null,
      color: "border-gray-300",
      buttonColor: "bg-gray-100 text-gray-700",
      features: [
        { text: "Basic vendor profile", included: true },
        { text: "Up to 3 service listings", included: true },
        { text: "5 portfolio images", included: true },
        { text: "Basic customer inquiries", included: true },
        { text: "Community support", included: true },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
        { text: "Featured listings", included: false },
        { text: "Social media integration", included: false },
        { text: "Custom branding", included: false },
      ],
    },
    {
      id: "basic",
      name: "Growth Plan",
      description: "Best for growing businesses",
      monthlyPrice: 499,
      yearlyPrice: 4990,
      originalMonthlyPrice: 599,
      badge: "Most Popular",
      color: "border-pink-500 ring-2 ring-pink-200",
      buttonColor: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
      features: [
        { text: "Complete vendor profile", included: true },
        { text: "Unlimited service listings", included: true },
        { text: "50 portfolio images", included: true },
        { text: "Lead management system", included: true },
        { text: "Basic analytics dashboard", included: true },
        { text: "Email support", included: true },
        { text: "Social media integration", included: true },
        { text: "Featured in search results", included: true },
        { text: "Custom branding", included: false },
        { text: "Advanced analytics", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium Pro",
      description: "For established vendors who want more",
      monthlyPrice: 999,
      yearlyPrice: 9990,
      originalMonthlyPrice: 1199,
      badge: "Best Value",
      color: "border-purple-500",
      buttonColor: "bg-gradient-to-r from-purple-500 to-violet-500 text-white",
      features: [
        { text: "Premium vendor profile", included: true },
        { text: "Unlimited everything", included: true },
        { text: "Unlimited portfolio images", included: true },
        { text: "Advanced lead management", included: true },
        { text: "Detailed analytics & insights", included: true },
        { text: "Priority customer support", included: true },
        { text: "Full social media integration", included: true },
        { text: "Top featured listings", included: true },
        { text: "Custom branding & themes", included: true },
        { text: "Performance marketing tools", included: true },
      ],
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Customer Reach",
      description: "Connect with thousands of customers actively looking for your services",
    },
    {
      icon: Calendar,
      title: "Booking Management",
      description: "Streamlined booking system to manage your appointments efficiently",
    },
    {
      icon: TrendingUp,
      title: "Business Growth",
      description: "Analytics and insights to help grow your business faster",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing with instant settlements",
    },
  ];

  const faqs = [
    {
      question: "How does PlanWAB pricing work?",
      answer:
        "PlanWAB offers subscription-based pricing for vendors. Choose a plan that fits your business needs and pay monthly or yearly. All plans include different levels of features and support.",
    },
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes! You can upgrade or downgrade your plan anytime from your dashboard. Changes take effect immediately, and billing is prorated accordingly.",
    },
    {
      question: "Is there a commission on bookings?",
      answer:
        "Our plans include most features with the subscription fee. Some plans may have a small transaction fee on successful bookings, which is clearly mentioned in the plan details.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our certified payment partners.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Yes, you can cancel your subscription anytime. Your account will remain active until the end of your current billing period, after which it will revert to the free plan.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      business: "Wedding Photographer",
      text: "PlanWAB has doubled my bookings in just 3 months. The platform is amazing!",
      rating: 5,
    },
    {
      name: "Rajesh Caterers",
      business: "Catering Service",
      text: "Best investment for my business. The lead quality is excellent.",
      rating: 5,
    },
    {
      name: "Mehndi by Kavya",
      business: "Mehendi Artist",
      text: "Love how easy it is to manage bookings and showcase my work.",
      rating: 5,
    },
  ];

  const getCurrentPrice = (plan) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (billingCycle === "yearly" && plan.monthlyPrice > 0) {
      const yearlyTotal = plan.monthlyPrice * 12;
      const savings = yearlyTotal - plan.yearlyPrice;
      return Math.round((savings / yearlyTotal) * 100);
    }
    return 0;
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Pricing Plans</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-8">
        {/* Hero Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Growth Plan</h2>
          <p className="text-gray-600 mb-6">Start free, upgrade when you're ready to grow faster</p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                billingCycle === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-2xl p-5 border-2 ${
                selectedPlan === plan.id ? plan.color : "border-gray-200"
              } relative overflow-hidden`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">₹{getCurrentPrice(plan)}</span>
                {plan.monthlyPrice > 0 && (
                  <>
                    <span className="text-gray-600">/{billingCycle === "monthly" ? "month" : "year"}</span>
                    {billingCycle === "yearly" && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        Save {getSavings(plan)}%
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <X size={16} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-semibold text-sm ${plan.buttonColor} transition-all`}>
                {plan.id === "free" ? "Get Started Free" : "Choose Plan"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Why Choose PlanWAB?</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="p-3 bg-pink-100 rounded-xl">
                  <feature.icon size={20} className="text-pink-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">What Our Vendors Say</h3>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-2">"{testimonial.text}"</p>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">{testimonial.name}</span>
                  <span> • </span>
                  <span>{testimonial.business}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl p-5 text-white">
          <div className="text-center">
            <Crown size={32} className="mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Need Something Custom?</h3>
            <p className="text-sm text-purple-100 mb-4">
              Large business or have specific requirements? We've got you covered.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold text-sm">
                Contact Sales Team
              </button>
              <p className="text-xs text-purple-200">Custom pricing • Dedicated support • Advanced features</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp size={18} className="text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 text-gray-600 text-sm">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield size={20} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">30-Day Money-Back Guarantee</h4>
              <p className="text-sm text-green-700">
                Try any paid plan risk-free for 30 days. If you're not satisfied, we'll refund your money, no questions
                asked.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Need Help Choosing?</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Our team is here to help you find the perfect plan for your business.
          </p>
          <div className="space-y-3">
            <a
              href="tel:+916267430959"
              className="flex items-center justify-center gap-3 w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium text-sm"
            >
              <Phone size={16} />
              Call us: +91 6267430959
            </a>
            <a
              href="https://wa.me/916267430959"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium text-sm"
            >
              <MessageCircle size={16} />
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Grow Your Business?</h3>
          <p className="text-gray-600 mb-6">Join thousands of successful vendors on PlanWAB</p>
          <div className="space-y-3">
            <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg">
              Start Your Free Trial
            </button>
            <p className="text-xs text-gray-500">No credit card required • Setup in 2 minutes • Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPageWrapper;
