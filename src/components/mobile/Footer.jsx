"use client";

import React, { useState, memo } from "react";
import { ChevronDown, ChevronUp, MapPin, Mail, Phone, Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import Link from "next/link";

// 1. Optimization: Move static content OUTSIDE to save memory on re-renders
const SECTIONS = [
  {
    title: "Quick Links",
    content: (
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Link href="/" className="hover:text-[#C33765] transition-colors">
          Home
        </Link>
        <Link href="/about" className="hover:text-[#C33765] transition-colors">
          About Us
        </Link>
        <Link href="/ideas" className="hover:text-[#C33765] transition-colors">
          Ideas & Inspiration
        </Link>
        <Link href="/vendors/marketplace" className="hover:text-[#C33765] transition-colors">
          Explore Vendors
        </Link>
        <Link href="/vendors/explore/events" className="hover:text-[#C33765] transition-colors">
          Wedding Vendors
        </Link>
        <Link href="/vendor/onboarding" className="hover:text-[#C33765] transition-colors">
          List Your Business
        </Link>
        <Link href="/pricing" className="hover:text-[#C33765] transition-colors">
          Pricing
        </Link>
        <Link href="/about/blogs" className="hover:text-[#C33765] transition-colors">
          Blogs / Stories
        </Link>
        <Link href="/about/contact" className="hover:text-[#C33765] transition-colors">
          Contact Us
        </Link>
      </div>
    ),
  },
  // {
  //   title: "For Vendors",
  //   content: (
  //     <div className="space-y-2 text-sm">
  //       <p>• Vendor Registration</p>
  //       <p>• Upload Services & Portfolio</p>
  //       <p>• Manage Leads</p>
  //       <p>• Marketing & Promotions</p>
  //       <p>• Vendor Support</p>
  //     </div>
  //   ),
  // },
  {
    title: "Contact Information",
    content: (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#C33765] flex-shrink-0" />
          <span>Noida, Uttar Pradesh, India</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-[#C33765] flex-shrink-0" />
          <a href="mailto:support@planwab.com" className="hover:text-[#C33765] transition-colors">
            support@planwab.com
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-[#C33765] flex-shrink-0" />
          <a href="tel:+916267430959" className="hover:text-[#C33765] transition-colors">
            +91 6267430959
          </a>
        </div>
      </div>
    ),
  },
  {
    title: "Social Media",
    content: (
      <div className="space-y-3">
        <p className="text-sm font-medium">Stay connected and grow with us</p>
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/planwab.official?igsh=MWlqMmxpcnF6NThjZw=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-[#C33765] transition-colors"
          >
            <Instagram size={16} />
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/planwab/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-[#C33765] transition-colors"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a
            href="https://www.facebook.com/share/16sos5hq5m/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-[#C33765] transition-colors"
          >
            <Facebook size={16} />
            Facebook
          </a>
        </div>
      </div>
    ),
  },
  // {
  //   title: "Legal",
  //   content: (
  //     <div className="flex flex-wrap gap-4 text-sm">
  //       <a href="/privacy-policy" className="hover:text-[#C33765] transition-colors">
  //         Privacy Policy
  //       </a>
  //       <a href="/terms" className="hover:text-[#C33765] transition-colors">
  //         Terms & Conditions
  //       </a>
  //       <a href="/refund-policy" className="hover:text-[#C33765] transition-colors">
  //         Refund Policy
  //       </a>
  //     </div>
  //   ),
  // },
  {
    title: "Are you a vendor?",
    content: (
      <div className="bg-gradient-to-r from-[#C33765]/10 to-pink-100/50 p-4 rounded-lg space-y-3">
        <p className="text-sm">
          🚀 Join PlanWAB today and grow your business faster with digital visibility and real leads.
        </p>
        <Link
          href="/vendor/onboarding"
          className="inline-flex items-center gap-2 bg-[#C33765] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a02952] transition-colors"
        >
          👉 List Your Business Now
        </Link>
      </div>
    ),
  },
];

const SeoFooterLinks = () => {
  const [open, setOpen] = useState(null);

  const toggle = (section) => {
    setOpen(open === section ? null : section);
  };

  const BASE_URL =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://planwab.com";

  // Vendor Data
  const categories = [
    { id: "venues", label: "Wedding Venues" },
    { id: "photographers", label: "Wedding Photographers" },
    { id: "catering", label: "Caterers" },
    { id: "makeup", label: "Makeup Artists" },
    { id: "mehendi", label: "Mehendi Artists" },
    { id: "djs", label: "DJs & Music" },
    { id: "planners", label: "Event Planners" },
    { id: "clothes", label: "Wedding Clothing" },
  ];

  const cities = ["Delhi NCR", "Mumbai", "Jaipur", "Bangalore"];

  // Ideas Data
  const ideaEvents = [
    { id: "wedding", label: "Wedding Ideas" },
    { id: "birthday", label: "Birthday Party Ideas" },
    { id: "anniversary", label: "Anniversary Ideas" },
    { id: "corporate", label: "Corporate Event Ideas" },
  ];

  const ideaCategories = [
    { id: "venues", label: "Venue & Mandap Ideas" },
    { id: "decor", label: "Wedding Decor Ideas" },
    { id: "makeup", label: "Bridal Makeup Looks" },
    { id: "clothes", label: "Bridal Lehenga & Outfits" },
    { id: "photographers", label: "Photography & Poses" },
    { id: "mehendi", label: "Latest Mehendi Designs" },
  ];

  const ideaMoments = [
    { id: "haldi", label: "Haldi Ceremony Ideas" },
    { id: "mehendi", label: "Mehendi Function Ideas" },
    { id: "sangeet", label: "Sangeet Dance & Decor" },
    { id: "baraat", label: "Baraat & Groom Entry" },
    { id: "reception", label: "Reception Party Ideas" },
    { id: "destination", label: "Destination Weddings" },
  ];

  const Section = ({ title, id, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggle(id)}
        className="w-full flex justify-between items-center py-3 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 uppercase">
          {title}
        </span>
        <span className="text-gray-500 text-lg">
          {open === id ? "-" : "+"}
        </span>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open === id ? "max-h-[500px] mt-3" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="mt-2 pt-6 border-t border-gray-200 px-2 w-full">
      {/* Existing: Category Links */}
      <Section title="Browse Vendors by Category" id="cat">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`${BASE_URL}/vendors/marketplace/${cat.id}`}
            className="text-sm text-gray-600 hover:text-[#C33765]"
          >
            {cat.label}
          </a>
        ))}
      </Section>

      {/* Existing: City + Category SEO Links */}
      <Section title="Vendors by City" id="city">
        {categories.map((cat) =>
          cities.map((city) => (
            <a
              key={`${cat.id}-${city}`}
              href={`${BASE_URL}/vendors/marketplace/${cat.id}?cities=${city.replace(
                " ",
                "+"
              )}`}
              className="text-sm text-gray-600 hover:text-[#C33765]"
            >
              {cat.label} in {city}
            </a>
          ))
        )}
      </Section>

      {/* NEW: Ideas & Inspiration by Event */}
      <Section title="Event Ideas & Inspiration" id="idea-events">
        {ideaEvents.map((event) => (
          <a
            key={event.id}
            href={`${BASE_URL}/ideas?type=${event.id}`}
            className="text-sm text-gray-600 hover:text-[#C33765] transition-colors"
          >
            {event.label}
          </a>
        ))}
      </Section>

      {/* NEW: Wedding Ideas by Category */}
      <Section title="Trending Wedding Categories" id="idea-categories">
        {ideaCategories.map((cat) => (
          <a
            key={cat.id}
            href={`${BASE_URL}/ideas?type=wedding&category=${cat.id}`}
            className="text-sm text-gray-600 hover:text-[#C33765] transition-colors"
          >
            {cat.label}
          </a>
        ))}
      </Section>

      {/* NEW: Wedding Ideas by Moments/Functions */}
      <Section title="Wedding Ceremony Ideas" id="idea-moments">
        {ideaMoments.map((moment) => (
          <a
            key={moment.id}
            href={`${BASE_URL}/ideas?type=wedding&subType=${moment.id}`}
            className="text-sm text-gray-600 hover:text-[#C33765] transition-colors"
          >
            {moment.label}
          </a>
        ))}
      </Section>

      {/* Existing: Filter Based Links */}
      <Section title="Discover Vendors" id="filters">
        <a href={`${BASE_URL}/vendors/marketplace?sortBy=price-asc`} className="text-sm text-gray-600">
          Budget Vendors
        </a>
        <a href={`${BASE_URL}/vendors/marketplace?sortBy=price-desc`} className="text-sm text-gray-600">
          Premium Vendors
        </a>
        <a href={`${BASE_URL}/vendors/marketplace?sortBy=bookings`} className="text-sm text-gray-600">
          Popular Vendors
        </a>
        <a href={`${BASE_URL}/vendors/marketplace?sortBy=newest`} className="text-sm text-gray-600">
          Newly Added Vendors
        </a>
        <a href={`${BASE_URL}/vendors/marketplace?sortBy=reviews`} className="text-sm text-gray-600">
          Most Reviewed Vendors
        </a>
        <a href={`${BASE_URL}/vendors/marketplace?maxPrice=50000`} className="text-sm text-gray-600">
          Vendors Under ₹50,000
        </a>
        <a href={`${BASE_URL}/vendors/marketplace?minRating=4`} className="text-sm text-gray-600">
          Top Rated Vendors (4★+)
        </a>
      </Section>

      {/* Existing: Event Links */}
      <Section title="Explore Events" id="events">
        {["wedding", "birthday", "anniversary", "corporate"].map((event) => (
          <a
            key={event}
            href={`${BASE_URL}/events/${event}`}
            className="text-sm text-gray-600 hover:text-[#C33765]"
          >
            {event.charAt(0).toUpperCase() + event.slice(1)} Planning
          </a>
        ))}
      </Section>
    </div>
  );
};

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="mb-0 w-full relative z-10 bg-white"
      id="more_about_planwab"
      // 2. Optimization: Skip rendering layout until scrolled into view
      // This is huge for footers!
      style={{ contentVisibility: "auto", containIntrinsicSize: "600px" }}
    >
      {/* Top Curve Decoration */}
      {/* <div className="w-full -mt-0 md:-mt-0 relative z-10 pointer-events-none leading-none">
        <img
          alt=""
          loading="lazy"
          className="w-full max-h-16 object-cover object-top"
          src="https://www.theweddingcompany.com/images/HomePage/new/pink-curve.svg"
          aria-hidden="true"
        />
      </div> */}

      <div className="pb-12 pt-5 px-4 md:px-0 bg-[#FFEFF4]">
        <div className="mx-auto flex max-w-screen-lg flex-col justify-center items-center">
          <h2 className="mb-6 font-serif text-2xl font-semibold md:mb-10 md:text-4xl text-center text-gray-700">
            PlanWAB – Turning Your Moments into Perfect Plans
          </h2>

          <div className="flex flex-col gap-y-2 text-sm md:text-base leading-relaxed text-gray-700 max-w-4xl">
            {/* Intro Block (Always Visible) */}
            <div className="space-y-4 text-center">
              <p className="text-lg">
                PlanWAB is a smart vendor-media platform designed to simplify event planning. From weddings and parties
                to personal celebrations, we connect customers with trusted vendors and help vendors grow their digital
                presence — all in one place.
              </p>

              {/* Copyright and Credits (Always Visible) */}
              <div className="border-t border-gray-300 pt-4 mt-6 space-y-2 text-sm text-gray-600">
                <p>© 2026 PlanWAB. All Rights Reserved.</p>
                <p>Built with ❤️ for Vendors & Creators in India.</p>
                <p className="font-medium">
                  Designed & Developed by PlanWAB{" "}
                  <a
                    href="https://www.linkedin.com/in/balram-dhakad-2a9110210/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Team
                  </a>
                </p>
              </div>
            </div>

            {/* Hidden / Expandable Content */}
            <div
              className={`space-y-3 mt-2 transition-all duration-500 ease-in-out overflow-hidden will-change-[max-height,opacity] ${
                isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {SECTIONS.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
                    <div>{section.content}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="self-center flex items-center gap-1 border-b-[1.5px] border-[#C33765] pt-2 text-[#C33765] font-semibold hover:opacity-80 transition-opacity active:scale-95"
              aria-expanded={isExpanded}
              aria-controls="footer-expanded-content"
            >
              {isExpanded ? "Show Less" : "Quick Links & More"}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          <SeoFooterLinks />
        </div>
      </div>
    </section>
  );
};

export default Footer;
