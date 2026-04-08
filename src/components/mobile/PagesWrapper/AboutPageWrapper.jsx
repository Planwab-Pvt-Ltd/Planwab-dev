"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
  Loader2,
  AlertCircle,
  SendHorizontal,
} from "lucide-react";

const AboutPageWrapper = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  const { user } = useUser();

  const [testimonialData, setTestimonialData] = useState({
    name: "",
    email: "",
    eventType: "",
    eventDate: "",
    location: "",
    guests: "",
    rating: 5,
    testimonial: "",
    vendorUsed: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [fetchedTestimonials, setFetchedTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/user/testimonials?status=APPROVED&limit=6");
        const data = await res.json();
        if (data.success && data.data) {
          setFetchedTestimonials(data.data);
        }
      } catch (error) {
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (user) {
      setTestimonialData((prev) => ({
        ...prev,
        name: user.fullName || user.username || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess(false);

    if (!testimonialData.eventType) {
      setSubmitError("Event Type is mandatory.");
      setSubmitLoading(false);
      return;
    }

    if (!testimonialData.testimonial || testimonialData.testimonial.trim() === "") {
      setSubmitError("Your Message is mandatory.");
      setSubmitLoading(false);
      return;
    }

    if (!testimonialData.rating) {
      setSubmitError("Rating is mandatory.");
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        ...testimonialData,
        avatar: user?.imageUrl || "",
        guests: parseInt(testimonialData.guests) || 0,
      };

      const res = await fetch("/api/user/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit testimonial");
      }

      setSubmitSuccess(true);
      setTestimonialData({
        name: user?.fullName || user?.username || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        eventType: "",
        eventDate: "",
        location: "",
        guests: "",
        rating: 5,
        testimonial: "",
        vendorUsed: "",
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

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



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">About PlanWAB</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="pb-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold">Turning Your Moments into Perfect Plans</h2>
              <p className="text-pink-100 text-sm leading-relaxed">
                PlanWAB is India's leading event planning platform, connecting customers with trusted vendors to create
                unforgettable experiences across the country.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button className="bg-white text-pink-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Play size={16} />
                  Watch Our Story
                </button>
              </div>
            </motion.div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white rounded-full" />
            <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-white rounded-full" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-pink-100 rounded-full">
                      <stat.icon size={20} className="text-pink-600" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="p-4 space-y-6 mt-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              To revolutionize event planning in India by creating a seamless, transparent, and reliable platform that
              connects customers with the best vendors, making every celebration memorable and stress-free.
            </p>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Our Vision</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                To become India's most trusted event planning ecosystem, empowering millions of vendors and creating
                billions of beautiful moments across the country.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Our Core Values</h3>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <value.icon size={18} className="text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{value.title}</h4>
                    <p className="text-gray-600 text-xs mt-1">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Meet Our Team</h3>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  whileTap={{ scale: 0.98 }}
                  className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTeamMember(activeTeamMember === index ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                      <p className="text-pink-600 text-xs">{member.role}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-gray-400 transition-transform ${activeTeamMember === index ? "rotate-90" : ""}`}
                    />
                  </div>

                  {activeTeamMember === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <p className="text-gray-700 text-xs mb-3">{member.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {member.achievements.map((achievement, achIndex) => (
                          <span key={achIndex} className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Our Journey</h3>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {milestone.year.slice(-2)}
                    </div>
                    {index < milestones.length - 1 && <div className="w-0.5 h-8 bg-pink-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-semibold text-gray-900 text-sm">{milestone.event}</h4>
                    <p className="text-gray-600 text-xs mt-1">{milestone.description}</p>
                    <span className="text-pink-600 text-xs font-medium">{milestone.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">What People Say</h3>
            
            {loadingTestimonials ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="animate-spin text-pink-600" size={24} />
              </div>
            ) : fetchedTestimonials.length > 0 ? (
              <div className="space-y-4">
                {fetchedTestimonials.map((t, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-3 italic">"{t.testimonial}"</p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{t.name}</span>
                      <span> • </span>
                      <span>{t.eventType}</span>
                      {t.location && (
                        <>
                          <span> • </span>
                          <span>{t.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">No testimonials yet. Be the first to share your experience!</p>
            )}
          </div>

          {/* Submit a Testimonial Form (Mobile Optimized) */}
          <div id="submit-testimonial" className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 overflow-hidden relative scroll-mt-20">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                 <Heart size={24} />
               </div>
               {user && (
                  <div className="w-12 h-12 rounded-xl border-2 border-pink-200 overflow-hidden shrink-0">
                    <img src={user.imageUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  </div>
               )}
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Share Your Experience</h3>
             <p className="text-gray-600 text-xs mb-5 leading-relaxed">
               We'd love to hear how PlanWAB helped make your event unforgettable. Your stories inspire us!
             </p>
             
             {submitSuccess && (
               <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 mb-4">
                 <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={16} />
                 <div>
                   <h4 className="text-green-900 font-bold text-sm mb-0.5">Thank You!</h4>
                   <p className="text-green-800 text-xs">Your testimonial was submitted successfully.</p>
                 </div>
               </div>
             )}
             
             {submitError && (
               <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 mb-4">
                 <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
                 <p className="text-red-800 text-xs font-medium">{submitError}</p>
               </div>
             )}
             
             <form onSubmit={handleTestimonialSubmit} className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div className="space-y-3">
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                   <input required type="text" value={testimonialData.name} onChange={(e) => setTestimonialData({...testimonialData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm" placeholder="John Doe" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                   <input required type="email" value={testimonialData.email} onChange={(e) => setTestimonialData({...testimonialData, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm" placeholder="john@email.com" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Event Type</label>
                   <select required value={testimonialData.eventType} onChange={(e) => setTestimonialData({...testimonialData, eventType: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all bg-white text-sm">
                     <option value="">Select Type</option>
                     <option value="Wedding">Wedding</option>
                     <option value="Birthday">Birthday</option>
                     <option value="Corporate">Corporate Event</option>
                     <option value="Anniversary">Anniversary</option>
                     <option value="Other">Other Event</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Used (Optional)</label>
                   <input type="text" value={testimonialData.vendorUsed} onChange={(e) => setTestimonialData({...testimonialData, vendorUsed: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm" placeholder="Royal Decorators" />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1">Event Date</label>
                     <input type="date" value={testimonialData.eventDate} onChange={(e) => setTestimonialData({...testimonialData, eventDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                     <input type="number" min="1" value={testimonialData.guests} onChange={(e) => setTestimonialData({...testimonialData, guests: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm" placeholder="100" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="col-span-2">
                     <label className="block text-xs font-medium text-gray-700 mb-1">Location / Venue</label>
                     <input type="text" value={testimonialData.location} onChange={(e) => setTestimonialData({...testimonialData, location: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm" placeholder="City or Venue Name" />
                   </div>
                   <div className="col-span-2">
                     <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                     <select required value={testimonialData.rating} onChange={(e) => setTestimonialData({...testimonialData, rating: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all bg-white text-sm">
                       <option value={5}>5 Stars ★★★★★</option>
                       <option value={4}>4 Stars ★★★★☆</option>
                       <option value={3}>3 Stars ★★★☆☆</option>
                       <option value={2}>2 Stars ★★☆☆☆</option>
                       <option value={1}>1 Star  ★☆☆☆☆</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Your Message</label>
                   <textarea required rows="3" value={testimonialData.testimonial} onChange={(e) => setTestimonialData({...testimonialData, testimonial: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none text-sm" placeholder="Tell us about your experience..."></textarea>
                 </div>
               </div>
               
               <div className="pt-2">
                 <button type="submit" disabled={submitLoading} className="w-full py-3 bg-pink-600 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-pink-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                   {submitLoading ? (
                     <>
                       <Loader2 className="animate-spin" size={16} />
                       Submitting...
                     </>
                   ) : (
                     <>
                       <SendHorizontal size={16} />
                       Submit
                     </>
                   )}
                 </button>
               </div>
             </form>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-5 text-white text-center">
            <h3 className="text-lg font-bold mb-2">Ready to Plan Your Event?</h3>
            <p className="text-pink-100 text-sm mb-4">
              Join thousands of satisfied customers who trust PlanWAB with their special moments.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-white text-pink-600 py-3 rounded-xl font-semibold text-sm">
                Start Planning Now
              </button>
              <div className="flex gap-2">
                <a
                  href="tel:+916267430959"
                  className="flex-1 bg-pink-400 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  Call Us
                </a>
                <a
                  href="mailto:support@planwab.com"
                  className="flex-1 bg-pink-400 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Mail size={14} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageWrapper;
