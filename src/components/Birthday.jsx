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

const Birthday = () => {
    const birthdayParties = [
        { title: 'Themed Party Bash', description: 'From superheroes to princesses, we do it all.', image: 'https://placehold.co/600x400/FFE4E1/DC143C?text=Party+1' },
        { title: 'Pool Party Fun', description: 'Make a splash with a fun-filled pool party.', image: 'https://placehold.co/600x400/E0FFFF/00FFFF?text=Party+2' },
        { title: 'Gaming Tournament', description: 'An epic gaming setup for the ultimate birthday.', image: 'https://placehold.co/600x400/F0F8FF/4169E1?text=Party+3' },
        { title: 'Outdoor Adventure', description: 'A treasure hunt or a camping themed party.', image: 'https://placehold.co/600x400/FAFAD2/BDB76B?text=Party+4' },
    ]
  return (
    <div>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Amazing Birthday Party Themes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {birthdayParties.map(party => <Card key={party.title} {...party} />)}
        </div>
    </div>
  )
}

export default Birthday
