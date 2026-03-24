"use client";

import React from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const VenueCard = ({ name, location, image, tag, tagColor, onViewDetails }) => (
  <div
    className="relative rounded-3xl overflow-hidden group cursor-pointer select-none"
    style={{ aspectRatio: "3/4", minWidth: 0 }}
    onClick={onViewDetails}
  >
    <img
      src={image}
      alt={name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

    {tag && (
      <div className="absolute top-3 right-3">
        <span className={`px-2.5 py-1 text-[11px] font-bold text-white rounded-full backdrop-blur-sm ${tagColor || "bg-rose-500/90"}`}>
          {tag}
        </span>
      </div>
    )}

    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
      <div className="flex-1 min-w-0 mr-2">
        <h3 className="text-white font-bold text-base leading-tight truncate drop-shadow">{name}</h3>
        {location && (
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-white/70 flex-shrink-0" />
            <span className="text-white/70 text-xs truncate">{location}</span>
          </div>
        )}
      </div>
      <button
        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 transition-all duration-200 whitespace-nowrap flex-shrink-0 group-hover:border-white/60"
        onClick={(e) => { e.stopPropagation(); if (onViewDetails) onViewDetails(); }}
      >
        <ArrowUpRight size={13} />
        View
      </button>
    </div>
  </div>
);

export const VenueGrid = ({ title, venues = [] }) => {
  if (!venues || venues.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ aspectRatio: "3/4" }} />
          ))}
        </div>
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-6">No venues available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {venues.map((venue, i) => (
          <VenueCard
            key={venue.id || venue.name || i}
            name={venue.name}
            location={venue.location}
            image={venue.image}
            tag={venue.tag}
            tagColor={venue.tagColor}
            onViewDetails={venue.onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default function Wedding({ venues, title = "Dream Wedding Venues" }) {
  return <VenueGrid title={title} venues={venues} />;
}
