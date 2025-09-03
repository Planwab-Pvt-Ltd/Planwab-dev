import React from 'react';

const Card = ({ title, description, image }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img className="w-full h-56 object-cover" src={image} alt={title} />
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
)

const Wedding = () => {
    const weddingVenues = [
        { title: 'Grand Palace Hall', description: 'A luxurious hall for a royal wedding experience.', image: 'https://placehold.co/600x400/FFF0F5/FF69B4?text=Venue+1' },
        { title: 'Lakeside Gardens', description: 'A serene outdoor venue with a beautiful lake view.', image: 'https://placehold.co/600x400/E0FFFF/00CED1?text=Venue+2' },
        { title: 'The Vintage Manor', description: 'A charming manor with rustic and elegant vibes.', image: 'https://placehold.co/600x400/FAF0E6/D2B48C?text=Venue+3' },
        { title: 'Modern City Loft', description: 'A chic and stylish loft for a contemporary wedding.', image: 'https://placehold.co/600x400/F5F5F5/808080?text=Venue+4' },
    ]
  return (
    <div>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Dream Wedding Venues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {weddingVenues.map(venue => <Card key={venue.title} {...venue} />)}
        </div>
    </div>
  )
}

export default Wedding
