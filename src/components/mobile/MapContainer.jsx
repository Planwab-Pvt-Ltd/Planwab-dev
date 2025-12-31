"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";
import Link from "next/link";

// Fix for default marker icons missing in Leaflet + Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Fallbacks for when extraction fails completely
const CITY_FALLBACK_COORDS = {
  "Delhi NCR": { lat: 28.6139, lng: 77.209 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
};

// Helper component to auto-adjust map bounds
const FitBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      // Check if all markers are at the exact same spot to avoid infinity zoom
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        map.setView(bounds.getCenter(), 14);
      } else {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [markers, map]);
  return null;
};

const MapComponent = ({ vendors, center }) => {
  const validMarkers = useMemo(() => {
    return vendors.map((vendor) => {
      // 1. EXTRACT FROM DB
      let lat = vendor.address?.location?.coordinates?.[1];
      let lng = vendor.address?.location?.coordinates?.[0];

      // 2. PRODUCTION-GRADE VALIDATION
      // If coords are [0,0], [0,-1], null, or undefined, they are INVALID.
      const isInvalid = !lat || !lng || (Math.abs(lat) < 0.1 && Math.abs(lng) < 1.1); // Catches 0,0 and 0,-1

      if (isInvalid) {
        const url = vendor.address?.googleMapUrl || "";

        // Try parsing long format coordinates from URL (@lat,lng)
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        // Try parsing parameter format (!3dLat!4dLng)
        const paramMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);

        if (atMatch) {
          lat = parseFloat(atMatch[1]);
          lng = parseFloat(atMatch[2]);
        } else if (paramMatch) {
          lat = parseFloat(paramMatch[1]);
          lng = parseFloat(paramMatch[2]);
        } else {
          // 3. FINAL FALLBACK: Only if DB is 0,0 AND URL is a short-link (no coords)
          const city = vendor.address?.city || "Delhi";
          const fallback = CITY_FALLBACK_COORDS[city] || CITY_FALLBACK_COORDS["Delhi"];
          lat = fallback.lat;
          lng = fallback.lng;
        }
      }

      return {
        ...vendor,
        lat: lat,
        lng: lng,
      };
    });
  }, [vendors]);

  return (
    <div className="h-[75vh] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative mb-4">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* Satellite Imagery Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community"
        />

        {/* Label Overlay for Street Names */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          opacity={0.8}
        />

        <FitBounds markers={validMarkers} />

        {validMarkers.map((vendor) => (
          <Marker key={vendor._id} position={[vendor.lat, vendor.lng]}>
            <Popup>
              <div className="p-1 min-w-[160px]">
                <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{vendor.category}</p>
                <h3 className="font-bold text-sm leading-tight mb-1">{vendor.name}</h3>
                <p className="text-[10px] text-gray-500 mb-2 flex items-start gap-1">
                  <MapPin size={10} className="shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{vendor.address?.street}</span>
                </p>
                <Link
                  href={`/m/vendor/${vendor.category}/${vendor._id}`}
                  className="block w-full py-2 bg-blue-600 text-white rounded-lg text-center text-[11px] font-bold hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Search Result Statistics */}
      <div className="absolute top-4 left-4 z-[500] bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <p className="text-xs font-black text-gray-800 uppercase tracking-tight">
            {validMarkers.length} Live Results
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
