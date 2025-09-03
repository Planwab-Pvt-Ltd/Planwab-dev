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

const Anniversary = () => {
    const anniversaryIdeas = [
        { title: 'Romantic Getaway', description: 'Surprise your partner with a weekend trip to the mountains.', image: 'https://placehold.co/600x400/FFF5EE/CD853F?text=Idea+1' },
        { title: 'Private Dinner', description: 'Arrange a candlelit dinner with a private chef.', image: 'https://placehold.co/600x400/FFFFF0/FFD700?text=Idea+2' },
        { title: 'Couple\'s Spa Day', description: 'Relax and rejuvenate with a luxurious spa treatment.', image: 'https://placehold.co/600x400/F0FFF0/98FB98?text=Idea+3' },
        { title: 'Adventure Day', description: 'Go for a hot air balloon ride or a scenic hike.', image: 'https://placehold.co/600x400/ADD8E6/4682B4?text=Idea+4' },
    ]
  return (
    <div>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Unforgettable Anniversary Ideas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {anniversaryIdeas.map(idea => <Card key={idea.title} {...idea} />)}
        </div>
    </div>
  )
}

export default Anniversary
