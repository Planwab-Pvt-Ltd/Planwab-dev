import React from "react";  
import { Card } from './Wedding';

export default function Anniversary() {
  const anniversaryIdeas = [{ title: "Romantic Getaway", description: "Surprise your partner with a weekend trip to the mountains.", image: "https://images.unsplash.com/photo-1533109721025-d1ae7de64092?w=600&q=80", tag: "Travel", tagColor: "bg-amber-500" }, { title: "Private Dinner", description: "Arrange a candlelit dinner with a private chef.", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80", tag: "Dining", tagColor: "bg-amber-500" }, { title: "Couple's Spa Day", description: "Relax and rejuvenate with a luxurious spa treatment.", image: "https://images.unsplash.com/photo-1597352873209-913a26a353c6?w=600&q=80", tag: "Relax", tagColor: "bg-amber-500" }, { title: "Adventure Day", description: "Go for a hot air balloon ride or a scenic hike.", image: "https://images.unsplash.com/photo-1525902379029-3d02a98f1a14?w=600&q=80", tag: "Adventure", tagColor: "bg-amber-500" }];
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800 dark:text-gray-100 mb-8">Unforgettable Anniversary Ideas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {anniversaryIdeas.map((idea) => (<Card key={idea.title} {...idea} />))}
      </div>
    </div>
  );
}
