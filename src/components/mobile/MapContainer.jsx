// components/MapComponent.js
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix for default marker icons missing in Leaflet + Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ vendors, onVendorSelect, center }) => {
  return (
    <div className="h-[80vh] rounded-2xl overflow-hidden">
      <MapContainer center={[center.lat, center.lng]} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vendors.map((vendor) => (
          <Marker key={vendor._id} position={[vendor.position.lat, vendor.position.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.address?.city}</p>
                <button
                  onClick={() => onVendorSelect?.(vendor)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
