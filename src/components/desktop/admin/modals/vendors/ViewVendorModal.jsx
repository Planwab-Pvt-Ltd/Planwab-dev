// components/modals/vendors/ViewVendorModal.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Award,
  Gift,
  FileText,
  MessageSquare,
  Camera,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Tag,
  Layers,
  Navigation,
  Info,
} from "lucide-react";

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

// Section Component
const Section = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-blue-600 dark:text-blue-400" />}
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
};

// Info Row Component
const InfoRow = ({ label, value, icon: Icon }) => {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
          {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
        </p>
      </div>
    </div>
  );
};

// Tag List Component
const TagList = ({ items, emptyText = "None" }) => {
  if (!items || items.length === 0) {
    return <span className="text-sm text-gray-400">{emptyText}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
        >
          {typeof item === "object" ? item.name || item.title || item.label : item}
        </span>
      ))}
    </div>
  );
};

// Copy Button Component
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
};

export default function ViewVendorModal({ vendor, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!vendor) return null;

  const images = vendor.images || [];
  const socialLinks = vendor.socialLinks || {};

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Vendor Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {vendor._id}
                <CopyButton text={vendor._id} />
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Vendor Header Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="flex gap-4">
              {/* Image Gallery */}
              <div className="w-32 h-32 flex-shrink-0">
                <Image
                  src={images[activeImageIndex] || vendor.defaultImage || "/placeholder-vendor.jpg"}
                  alt={vendor.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-xl"
                />
                {images.length > 1 && (
                  <div className="flex gap-1 mt-2 overflow-x-auto">
                    {images.slice(0, 4).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-8 h-8 rounded-md overflow-hidden flex-shrink-0 ring-2 ${
                          activeImageIndex === idx ? "ring-blue-500" : "ring-transparent hover:ring-gray-300"
                        }`}
                      >
                        <Image src={img} alt="" width={32} height={32} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {images.length > 4 && (
                      <span className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                        +{images.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vendor.name}</h3>
                      {vendor.isVerified && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold rounded-full flex items-center gap-1">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      )}
                      {vendor.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs font-bold rounded-full flex items-center gap-1">
                          <Sparkles size={12} />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">@{vendor.username}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vendor.availabilityStatus === "Available"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                        : vendor.availabilityStatus === "Busy"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    }`}
                  >
                    {vendor.availabilityStatus || "Available"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <Tag size={14} className="text-gray-400" />
                    <span className="capitalize">{vendor.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin size={14} className="text-gray-400" />
                    {vendor.address?.city || "N/A"}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    {vendor.rating?.toFixed(1) || "0.0"} ({vendor.reviews || 0} reviews)
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <DollarSign size={14} className="text-gray-400" />₹
                    {vendor.basePrice?.toLocaleString("en-IN") || "N/A"} / {vendor.priceUnit || "day"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Section title="Contact Information" icon={Phone}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Email" value={vendor.email} icon={Mail} />
              <InfoRow label="Phone" value={vendor.phoneNo} icon={Phone} />
              <InfoRow label="WhatsApp" value={vendor.whatsappNo} icon={Phone} />
              <InfoRow
                label="Contact Person"
                value={
                  vendor.contactPerson?.firstName || vendor.contactPerson?.lastName
                    ? `${vendor.contactPerson?.firstName || ""} ${vendor.contactPerson?.lastName || ""}`.trim()
                    : null
                }
                icon={Users}
              />
            </div>
          </Section>

          {/* Location */}
          <Section title="Location" icon={MapPin}>
            <div className="space-y-3">
              <InfoRow label="Street Address" value={vendor.address?.street} icon={Navigation} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoRow label="City" value={vendor.address?.city} />
                <InfoRow label="State" value={vendor.address?.state} />
                <InfoRow label="Postal Code" value={vendor.address?.postalCode} />
                <InfoRow label="Country" value={vendor.address?.country} />
              </div>
              {vendor.address?.googleMapUrl && (
                <a
                  href={vendor.address.googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <ExternalLink size={14} />
                  View on Google Maps
                </a>
              )}

              {vendor.landmarks && vendor.landmarks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Nearby Landmarks</p>
                  <div className="space-y-1">
                    {vendor.landmarks.map((lm, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{lm.name}</span>
                        <span className="text-gray-500">{lm.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vendor.directions && vendor.directions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Directions</p>
                  <div className="space-y-2">
                    {vendor.directions.map((dir, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{dir.type}:</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">{dir.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Description */}
          {(vendor.description || vendor.shortDescription) && (
            <Section title="Description" icon={FileText}>
              {vendor.shortDescription && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Short Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{vendor.shortDescription}</p>
                </div>
              )}
              {vendor.description && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{vendor.description}</p>
                </div>
              )}
            </Section>
          )}

          {/* Stats & Metrics */}
          <Section title="Stats & Metrics" icon={BarChart3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendor.yearsExperience || 0}</p>
                <p className="text-xs text-gray-500">Years Experience</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendor.bookings || 0}</p>
                <p className="text-xs text-gray-500">Total Bookings</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendor.responseTime || "N/A"}</p>
                <p className="text-xs text-gray-500">Response Time</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendor.responseRate || "N/A"}</p>
                <p className="text-xs text-gray-500">Response Rate</p>
              </div>
            </div>

            {vendor.stats && vendor.stats.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom Stats</p>
                <div className="grid grid-cols-2 gap-2">
                  {vendor.stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Operating Hours */}
          {vendor.operatingHours && vendor.operatingHours.length > 0 && (
            <Section title="Operating Hours" icon={Clock}>
              <div className="space-y-2">
                {vendor.operatingHours.map((oh, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span className="text-gray-600 dark:text-gray-400">{oh.day}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{oh.hours}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Pricing */}
          <Section title="Pricing" icon={DollarSign}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoRow label="Base Price" value={`₹${vendor.basePrice?.toLocaleString("en-IN") || "N/A"}`} />
              <InfoRow label="Price Unit" value={vendor.priceUnit} />
              {vendor.perDayPrice?.min && (
                <InfoRow
                  label="Price Range"
                  value={`₹${vendor.perDayPrice.min.toLocaleString("en-IN")}${
                    vendor.perDayPrice.max ? ` - ₹${vendor.perDayPrice.max.toLocaleString("en-IN")}` : "+"
                  }`}
                />
              )}
            </div>

            {vendor.paymentMethods && vendor.paymentMethods.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Payment Methods</p>
                <TagList items={vendor.paymentMethods} />
              </div>
            )}
          </Section>

          {/* Packages */}
          {vendor.packages && vendor.packages.length > 0 && (
            <Section title="Packages" icon={Gift}>
              <div className="space-y-3">
                {vendor.packages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      pkg.isPopular
                        ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{pkg.name}</h4>
                          {pkg.isPopular && (
                            <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-bold rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{pkg.duration}</p>
                      </div>
                      <div className="text-right">
                        {pkg.originalPrice && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{pkg.originalPrice.toLocaleString("en-IN")}
                          </p>
                        )}
                        <p className="text-lg font-bold text-blue-600">₹{pkg.price?.toLocaleString("en-IN")}</p>
                        {pkg.savingsPercentage > 0 && (
                          <p className="text-xs text-green-600 font-medium">Save {pkg.savingsPercentage}%</p>
                        )}
                      </div>
                    </div>
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Included:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.features.map((f, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {pkg.notIncluded && pkg.notIncluded.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Not Included:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.notIncluded.map((f, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded line-through"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Features */}
          <Section title="Features & Amenities" icon={Layers}>
            {vendor.amenities && vendor.amenities.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Amenities</p>
                <TagList items={vendor.amenities} />
              </div>
            )}
            {vendor.facilities && vendor.facilities.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Facilities</p>
                <TagList items={vendor.facilities} />
              </div>
            )}
            {vendor.highlightPoints && vendor.highlightPoints.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Highlights</p>
                <ul className="space-y-1">
                  {vendor.highlightPoints.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {vendor.eventTypes && vendor.eventTypes.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Event Types</p>
                <TagList items={vendor.eventTypes} />
              </div>
            )}
          </Section>

          {/* Awards */}
          {vendor.awards && vendor.awards.length > 0 && (
            <Section title="Awards & Recognition" icon={Award}>
              <div className="grid grid-cols-2 gap-2">
                {vendor.awards.map((award, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Award size={16} className="text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{award.title}</p>
                      {award.year && <p className="text-xs text-gray-500">{award.year}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Special Offers */}
          {vendor.specialOffers && vendor.specialOffers.length > 0 && (
            <Section title="Special Offers" icon={Sparkles}>
              <div className="space-y-2">
                {vendor.specialOffers.map((offer, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{offer.title}</p>
                        {offer.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{offer.description}</p>
                        )}
                      </div>
                      {offer.discount && (
                        <span className="px-2 py-1 bg-pink-500 text-white text-xs font-bold rounded">
                          {offer.discount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Policies */}
          {vendor.policies && vendor.policies.length > 0 && (
            <Section title="Policies" icon={Shield}>
              <div className="space-y-3">
                {vendor.policies.map((policy, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{policy.title}</h4>
                    {policy.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{policy.content}</p>
                    )}
                    {policy.details && policy.details.length > 0 && (
                      <ul className="space-y-1">
                        {policy.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ChevronRight size={12} className="text-gray-400" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* FAQs */}
          {vendor.faqs && vendor.faqs.length > 0 && (
            <Section title="FAQs" icon={MessageSquare}>
              <div className="space-y-3">
                {vendor.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">{faq.question}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Social Links */}
          {Object.values(socialLinks).some((v) => v) && (
            <Section title="Social Links" icon={Globe}>
              <div className="flex flex-wrap gap-3">
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Globe size={16} />
                    Website
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-sm text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                  >
                    <Instagram size={16} />
                    Instagram
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Facebook size={16} />
                    Facebook
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Youtube size={16} />
                    YouTube
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg text-sm text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
                  >
                    <Twitter size={16} />
                    Twitter
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                )}
              </div>
            </Section>
          )}

          {/* SEO */}
          {(vendor.metaTitle || vendor.metaDescription || vendor.metaKeywords?.length > 0) && (
            <Section title="SEO Settings" icon={TrendingUp} defaultOpen={false}>
              <InfoRow label="Meta Title" value={vendor.metaTitle} />
              <InfoRow label="Meta Description" value={vendor.metaDescription} />
              {vendor.metaKeywords && vendor.metaKeywords.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Meta Keywords</p>
                  <TagList items={vendor.metaKeywords} />
                </div>
              )}
            </Section>
          )}

          {/* Timestamps */}
          <Section title="Record Info" icon={Info} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label="Created At"
                value={vendor.createdAt ? new Date(vendor.createdAt).toLocaleString() : "N/A"}
                icon={Calendar}
              />
              <InfoRow
                label="Updated At"
                value={vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleString() : "N/A"}
                icon={Clock}
              />
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
