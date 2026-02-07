"use client";

import React from "react";
import { MapPin, Mail, Phone, Instagram, Linkedin, Facebook, ArrowRight } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="w-full relative z-60 bg-[#F8FAFC] dark:bg-gray-900"
      id="footer"
      style={{ contentVisibility: "auto", containIntrinsicSize: "600px" }}
    >
      {/* Top Curve Decoration */}
      <div className="w-full relative z-10 pointer-events-none leading-none">
        <img
          alt=""
          loading="lazy"
          className="w-full max-h-16 object-cover object-top"
          src="https://www.theweddingcompany.com/images/HomePage/new/pink-curve.svg"
          aria-hidden="true"
        />
      </div>

      <div className="bg-[#FFEFF4] pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">
                  PlanWAB
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                  Turning Your Moments into Perfect Plans
                </p>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                A smart vendor-media platform designed to simplify event planning. From weddings and parties to personal celebrations, we connect customers with trusted vendors and help vendors grow their digital presence.
              </p>

              {/* Social Media Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/planwab.official?igsh=MWlqMmxpcnF6NThjZw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#C33765] hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/planwab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#C33765] hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="https://www.facebook.com/share/16sos5hq5m/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#C33765] hover:text-white transition-all duration-300 shadow-sm"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Home</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/vendors/marketplace" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Explore Vendors</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pricing" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Pricing</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about/blogs" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Blog</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about/contact" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#C33765] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    Noida, Uttar Pradesh, India
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-[#C33765] flex-shrink-0 mt-0.5" />
                  <a 
                    href="mailto:support@planwab.com" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors"
                  >
                    support@planwab.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-[#C33765] flex-shrink-0 mt-0.5" />
                  <a 
                    href="tel:+916267430959" 
                    className="text-sm text-gray-600 hover:text-[#C33765] transition-colors"
                  >
                    +91 6267430959
                  </a>
                </li>
              </ul>
            </div>

            {/* Vendor CTA */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-[#C33765] to-[#a02952] p-6 rounded-xl shadow-lg text-white space-y-4">
                <h4 className="text-lg font-bold">
                  Are you a vendor?
                </h4>
                <p className="text-sm leading-relaxed opacity-95">
                  Join PlanWAB today and grow your business faster with digital visibility and real leads.
                </p>
                <Link
                  href="/vendor/register"
                  className="inline-flex items-center gap-2 bg-white text-[#C33765] px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all duration-300 group"
                >
                  <span>List Your Business</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <p>© 2026 PlanWAB. All Rights Reserved.</p>
                <span className="hidden md:inline text-gray-400">|</span>
                <p>Built with ❤️ for Vendors & Creators in India</p>
              </div>
              <div className="flex items-center gap-2">
                <span>Designed & Developed by</span>
                <a
                  href="https://www.linkedin.com/in/balram-dhakad-2a9110210/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#C33765] hover:underline"
                >
                  PlanWAB Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;