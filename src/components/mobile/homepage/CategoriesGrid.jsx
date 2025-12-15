import React from "react";

const CategoryGrid = () => {
  // Data extraction based on the provided HTML structure
  const categories = [
    {
      name: "Salon for Women",
      image: "https://cdn.yesmadam.com/images/live/category/Salon.jpg",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Spa for Women",
      image: "https://cdn.yesmadam.com/images/live/category/Spa-30oct.jpg",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "HydraGlo Facials",
      // Note: This image spans 2 columns in the source
      image: "https://cdn.yesmadam.com/images/live/category/Hydra%20Category_Wedding%20Season-18-11-25.gif",
      span: 2,
      widthClass: "w-40", // Corresponds to the wider image in source
    },
    {
      name: "Laser Treatments",
      image: "https://cdn.yesmadam.com/images/live/category/Cat-Icon-Laser-Female-27nov25.jpg",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Makeup & Styling",
      image: "https://cdn.yesmadam.com/images/live/category/Makeup-30oct.jpg",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Hair Cut & Style",
      image: "https://cdn.yesmadam.com/images/live/category/Hair-30oct.jpg",
      span: 1,
      widthClass: "w-20",
    },
    {
      name: "Pre Bridal",
      image: "https://cdn.yesmadam.com/images/live/category/Bridal-30oct.jpg",
      span: 1,
      widthClass: "w-20",
    },
  ];

  return (
    <>
      <div className="p-4 py-2 bg-white">
        <h2 className="text-xl font-semibold text-gray-900" aria-hidden="true">
          What are you looking for ?
        </h2>

        <div className="grid grid-cols-4 gap-3 mt-4">
          {categories.map((item, index) => (
            <div key={index} className={`flex items-center flex-col ${item.span === 2 ? "col-span-2" : "col-span-1"}`}>
              <img
                src={item.image}
                alt={item.name}
                width={item.span === 2 ? 150 : 74} // Approximate pixel width based on visual weight
                height={74}
                loading="lazy"
                className={`rounded-[12px] object-cover h-20 ${item.widthClass} shadow-sm`}
              />
              <p className="m-1 p-0 text-xs font-sans text-center text-black">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryGrid;
