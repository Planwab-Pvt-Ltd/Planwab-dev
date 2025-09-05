import React from "react";
import { ArrowRight } from "lucide-react";

export const Card = ({ title, description, image, tag, tagColor }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
    <div className="relative">
      <img
        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        src={image}
        alt={title}
      />
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 text-xs font-bold text-white rounded-full ${tagColor || "bg-rose-500"}`}
        >
          {tag}
        </span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 h-10">{description}</p>
      <button className="font-semibold text-rose-600 group-hover:text-rose-700 flex items-center transition-colors">
        View Details{" "}
        <ArrowRight
          size={16}
          className="ml-1 transition-transform duration-300 group-hover:ml-2"
        />
      </button>
    </div>
  </div>
);

export default function Wedding() {
  const weddingVenues = [
    {
      title: "Grand Palace Hall",
      description: "A luxurious hall for a royal wedding experience.",
      image:
        "https://images.unsplash.com/photo-1593106579478-675691c2c36a?w=600&q=80",
      tag: "Luxury",
    },
    {
      title: "Lakeside Gardens",
      description: "A serene outdoor venue with a beautiful lake view.",
      image:
        "https://images.unsplash.com/photo-1523554888454-84137e72c3ce?w=600&q=80",
      tag: "Outdoors",
    },
    {
      title: "The Vintage Manor",
      description: "A charming manor with rustic and elegant vibes.",
      image:
        "https://images.unsplash.com/photo-1595839842175-3e25d4a4b272?w=600&q=80",
      tag: "Vintage",
    },
    {
      title: "Modern City Loft",
      description: "A chic and stylish loft for a contemporary wedding.",
      image:
        "https://images.unsplash.com/photo-1511285560921-4c9A9cf33ad?w=600&q=80",
      tag: "Modern",
    },
  ];
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800 mb-8">
        Dream Wedding Venues
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {weddingVenues.map((venue) => (
          <Card key={venue.title} {...venue} />
        ))}
      </div>
    </div>
  );
}
