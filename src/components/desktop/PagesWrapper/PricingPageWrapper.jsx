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
      color: "border-gray-200 hover:border-gray-300",
      buttonColor: "bg-gray-100 text-gray-700 hover:bg-gray-200",
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
      color: "border-pink-500 ring-2 ring-pink-100 shadow-xl shadow-pink-100",
      buttonColor: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600",
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
      color: "border-purple-500 hover:border-purple-600",
      buttonColor: "bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600",
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Desktop Header / Breadcrumb Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Simple Pricing for <span className="text-pink-600">Exponential Growth</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Choose the perfect plan to scale your vendor business. Start for free, upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                billingCycle === "yearly"
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Yearly
              <span className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-3xl p-8 border-2 ${
                selectedPlan === plan.id || plan.id === "basic"
                  ? plan.color
                  : "border-gray-100 hover:border-gray-200"
              } relative overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl transition-all duration-300`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 h-10">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-extrabold text-gray-900">
                  ₹{getCurrentPrice(plan).toLocaleString("en-IN")}
                </span>
                {plan.monthlyPrice > 0 && (
                  <div className="flex flex-col items-start">
                    <span className="text-gray-500 font-medium">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                    {billingCycle === "yearly" && (
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full mt-1">
                        Save {getSavings(plan)}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 p-0.5 rounded-full ${
                        feature.included ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {feature.included ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <X size={14} className="text-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-sm leading-relaxed ${
                        feature.included ? "text-gray-700 font-medium" : "text-gray-400 line-through"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold text-base ${plan.buttonColor} shadow-lg active:scale-95 transition-all`}
              >
                {plan.id === "free" ? "Get Started Free" : "Choose Plan"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose PlanWAB?</h3>
            <p className="text-gray-500">Everything you need to manage and grow your event business</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="p-4 bg-pink-50 rounded-2xl mb-4 text-pink-600">
                  <feature.icon size={28} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Trusted by Vendors Like You</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise & Support Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Enterprise Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-10 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <Crown size={48} className="mb-6 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-3">Enterprise Solutions</h3>
            <p className="text-gray-300 mb-8 max-w-sm">
              Large agency or multiple locations? Get a custom plan tailored to your scale.
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Contact Sales Team
            </button>
            <p className="text-xs text-gray-400 mt-4 font-medium">
              Custom Pricing • API Access • Dedicated Account Manager
            </p>
          </div>

          {/* Contact / Help Section */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help Choosing?</h3>
              <p className="text-gray-500">Our team is available 24/7 to answer your questions.</p>
            </div>
            <div className="grid gap-4">
              <a
                href="tel:+916267430959"
                className="flex items-center justify-center gap-3 w-full py-4 bg-green-50 text-green-700 border border-green-100 rounded-xl font-bold hover:bg-green-100 transition-colors"
              >
                <Phone size={20} />
                Call us: +91 6267430959
              </a>
              <a
                href="https://wa.me/916267430959"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                <MessageCircle size={20} />
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <span className="font-bold text-gray-900">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp size={20} className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
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
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
          <div className="p-4 bg-white rounded-full shadow-sm text-green-600">
            <Shield size={32} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-green-900 mb-2">30-Day Money-Back Guarantee</h4>
            <p className="text-green-800 leading-relaxed">
              Try any paid plan risk-free for 30 days. If you're not completely satisfied with the features and results, we'll refund your money in full, no questions asked.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pb-12 pt-8">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Ready to Grow Your Business?</h3>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Join thousands of successful vendors on PlanWAB and start getting quality leads today.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button className="px-10 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-pink-200 hover:shadow-2xl hover:-translate-y-1 transition-all">
              Start Your Free Trial
            </button>
            <p className="text-sm text-gray-400 font-medium">
              No credit card required • Setup in 2 minutes • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPageWrapper;