import React from "react";
import { Card } from "./Wedding";

export default function Birthday() {
  const birthdayParties = [
    {
      title: "Themed Party Bash",
      description: "From superheroes to princesses, we do it all.",
      image:
        "https://images.unsplash.com/photo-1560439514-e960a3ef50d9?w=600&q=80",
      tag: "Kids",
      tagColor: "bg-blue-500",
    },
    {
      title: "Pool Party Fun",
      description: "Make a splash with a fun-filled pool party.",
      image:
        "https://images.unsplash.com/photo-1575126473950-5a8a5291a505?w=600&q=80",
      tag: "Summer",
      tagColor: "bg-blue-500",
    },
    {
      title: "Gaming Tournament",
      description: "An epic gaming setup for the ultimate birthday.",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
      tag: "Gaming",
      tagColor: "bg-blue-500",
    },
    {
      title: "Outdoor Adventure",
      description: "A treasure hunt or a camping themed party.",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
      tag: "Adventure",
      tagColor: "bg-blue-500",
    },
  ];
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800 mb-8">
        Amazing Birthday Party Themes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {birthdayParties.map((party) => (
          <Card key={party.title} {...party} />
        ))}
      </div>
    </div>
  );
}
