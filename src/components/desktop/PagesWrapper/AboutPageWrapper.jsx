"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Target,
  Users,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  Star,
  ChevronRight,
  Phone,
  Mail,
  ExternalLink,
  Play,
  CheckCircle,
} from "lucide-react";

const AboutPageWrapper = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(null);

  const stats = [
    { number: "5,000+", label: "Events Planned", icon: Calendar },
    { number: "2,000+", label: "Happy Vendors", icon: Users },
    { number: "15+", label: "Cities", icon: MapPin },
    { number: "4.8", label: "Average Rating", icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make prioritizes our customers' experience and satisfaction.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We believe in honest pricing, verified vendors, and clear communication.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Constantly improving our platform with latest technology and user feedback.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for perfection in every event, every interaction, every moment.",
    },
  ];

  const teamMembers = [
    {
      name: "Prashant Chourasiya",
      role: "Founder & CEO",
      image: "/team/ceo.jpg", // Placeholder
      bio: "Visionary leader with 8+ years in event technology. Started PlanWAB to solve real problems in event planning.",
      achievements: ["IIT Graduate", "Forbes 30 Under 30", "Event Tech Pioneer"],
    },
    {
      name: "Sarah Sharma",
      role: "Head of Operations",
      image: "/team/operations.jpg", // Placeholder
      bio: "Operations expert ensuring smooth vendor partnerships and customer experiences across all cities.",
      achievements: ["MBA Operations", "Ex-Zomato", "Process Optimization Expert"],
    },
    {
      name: "Rahul Gupta",
      role: "CTO",
      image: "/team/cto.jpg", // Placeholder
      bio: "Tech wizard building scalable solutions that power thousands of events across India.",
      achievements: ["IIT Delhi", "Ex-Google", "AI/ML Specialist"],
    },
  ];

  const milestones = [
    { year: "2022", event: "PlanWAB Founded", description: "Started with a vision to simplify event planning" },
    { year: "2023", event: "1,000 Events", description: "Reached our first major milestone" },
    { year: "2024", event: "Multi-City Launch", description: "Expanded to 15+ cities across India" },
    { year: "2025", event: "5,000+ Events", description: "Became India's trusted event platform" },
    { year: "2026", event: "AI Integration", description: "Launching smart event planning features" },
  ];

  const testimonials = [
    {
      name: "Anjali Mehta",
      role: "Bride",
      text: "PlanWAB made my wedding planning stress-free. Found amazing vendors and stayed within budget!",
      rating: 5,
      event: "Wedding in Mumbai",
    },
    {
      name: "Rajesh Caterers",
      role: "Vendor",
      text: "Joined PlanWAB 6 months ago, my business has grown 300%. Best platform for vendors!",
      rating: 5,
      event: "Catering Business",
    },
    {
      name: "Kavita Singh",
      role: "Event Organizer",
      text: "Organized 50+ corporate events through PlanWAB. Reliable vendors, transparent pricing.",
      rating: 5,
      event: "Corporate Events",
    },
  ];

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

      {/* Hero Section */}
      <div className="relative overflow-hidden mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl overflow-hidden relative">
            <div className="relative z-10 px-8 py-20 md:py-32 md:px-16 text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  Turning Your Moments <br className="hidden md:block" />
                  into <span className="text-pink-200">Perfect Plans</span>
                </h2>
                <p className="text-pink-50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                  PlanWAB is India's leading event planning platform, connecting customers with trusted vendors to create
                  unforgettable experiences across the country.
                </p>
                <div className="pt-6">
                  <button className="bg-white text-pink-600 px-8 py-4 rounded-xl text-base font-bold flex items-center gap-3 mx-auto hover:bg-pink-50 transition-colors shadow-lg">
                    <Play size={20} className="fill-pink-600" />
                    Watch Our Story
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-10 right-10 w-40 h-40 border-4 border-white rounded-full" />
              <div className="absolute bottom-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
              <div className="absolute top-1/2 left-1/4 w-20 h-20 border-4 border-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Stats Section Overlay */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`text-center ${index > 0 ? "pl-8" : ""}`} // Add padding only if divider exists
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-pink-50 rounded-full">
                      <stat.icon size={24} className="text-pink-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Target size={28} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              To revolutionize event planning in India by creating a seamless, transparent, and reliable platform that
              connects customers with the best vendors, making every celebration memorable and stress-free.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Sparkles size={28} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              To become India's most trusted event planning ecosystem, empowering millions of vendors and creating
              billions of beautiful moments across the country.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-pink-50 rounded-xl w-fit mb-4">
                  <value.icon size={24} className="text-pink-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Meet Our Team</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setActiveTeamMember(activeTeamMember === index ? null : index)}
              >
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shrink-0 text-xl font-bold text-white shadow-md">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                    <p className="text-pink-600 font-medium">{member.role}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 min-h-[48px]">{member.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {member.achievements.map((achievement, achIndex) => (
                    <span
                      key={achIndex}
                      className="bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full border border-pink-100"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Journey</h3>
          <div className="relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full -z-10" />

            <div className="grid md:grid-cols-5 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md mb-4 ring-4 ring-white group-hover:scale-110 transition-transform">
                    {milestone.year.slice(-2)}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{milestone.event}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed mb-1">{milestone.description}</p>
                  <span className="text-pink-600 text-xs font-bold bg-pink-50 px-2 py-0.5 rounded-md">
                    {milestone.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">What People Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <span>{testimonial.role}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{testimonial.event}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Plan Your Event?</h3>
            <p className="text-pink-100 text-lg mb-8">
              Join thousands of satisfied customers who trust PlanWAB with their special moments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-colors shadow-lg">
                Start Planning Now
              </button>
              <div className="flex gap-3 w-full sm:w-auto">
                <a
                  href="tel:+916267430959"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-pink-400/30 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-pink-400/50 transition-colors"
                >
                  <Phone size={18} />
                  Call Us
                </a>
                <a
                  href="mailto:support@planwab.com"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-pink-400/30 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-pink-400/50 transition-colors"
                >
                  <Mail size={18} />
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default AboutPageWrapper;