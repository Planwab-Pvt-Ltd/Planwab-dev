import React from "react";

const MostBooked = () => {
  // Data extraction from the source HTML
  const services = [
    {
      id: 1,
      title: "Full Arms + Full Legs + Underarms Korean Waxing",
      description: "",
      price: "₹799",
      duration: "1 hr 15 mins",
      image: "https://cdn.yesmadam.com/images/live/iDescription/fullArmsHoneyWaxing%2027-sep-2025.jpg",
    },
    {
      id: 2,
      title: "Korean Body Polishing",
      description: "9 Steps Including Face",
      price: "₹1,599",
      duration: "2 hr",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Body-Polishing%20(1).webp",
    },
    {
      id: 3,
      title: "Korean Luxe Manicure & Pedicure",
      description: "",
      price: "₹999",
      duration: "1 hr 50 mins",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-mani-pedi-7Nov25.webp",
    },
    {
      id: "4",
      title: "Korean Clean Up",
      description: "7 Step Clean-Up | Free Silicone Face Brush Included",
      price: "₹749",
      duration: "50 mins",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Korean%20Facial.jpg",
    },
    {
      id: 5,
      title: "Korean Glow Facial",
      description: "9 Steps Facial | Includes FREE silicone facial brush",
      price: "₹1,299",
      duration: "1 hr 15 mins",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Glow-7Nov25.webp",
    },
    {
      id: 6,
      title: "Full Arms, Underarms & Full Legs - Rica Tin Wax - 1 Session",
      description: "",
      price: "₹898",
      duration: "1 hr 5 mins",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Parent-SSI-RicaTin-5dec25.webp",
    },
    {
      id: 7,
      title: "Golden Glow Facial",
      description: "8 Steps Facial",
      price: "₹1,119",
      duration: "1 hr 10 mins",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Golden-glow-.webp",
    },
    {
      id: 8,
      title: "O3+ Shine & Glow Facial - 1 Session",
      description: "7 Steps Facial | Includes Korean Day & Night Sheet Mask",
      price: "₹1,349",
      duration: "1 hr 10 mins",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Shine-Glow-1-7Nov25.webp",
    },
    {
      id: 9,
      title: "Stripless Korean Bikini Wax",
      description: "One-time use peel-off wax",
      price: "₹749",
      duration: "1 hr",
      image: "https://cdn.yesmadam.com/images/live/iDescription/Korean-Bikini-Wax-7Nov25.webp",
    },
  ];

  const filters = [
    { label: "Salon for Women", active: true, bg: "bg-[#AC2B571A]", text: "text-[#AC2B57]" },
    { label: "Spa for Women", active: false, bg: "bg-[#F5F5F5]", text: "text-[#646464]" },
    { label: "HydraGlo Facials", active: false, bg: "bg-[#F5F5F5]", text: "text-[#646464]" },
    { label: "Laser Treatments", active: false, bg: "bg-[#F5F5F5]", text: "text-[#646464]" },
  ];

  return (
    <>
      <div className="p-4 bg-white mt-2">
        <h2 className="text-xl font-semibold my-2 text-gray-900">Most Booked</h2>

        {/* Filters Scrollable Row */}
        <div className="flex gap-2 text-sm mb-4 overflow-x-auto scrollbar-hide pb-2">
          {filters.map((filter, index) => (
            <div
              key={index}
              className={`p-2 px-3 rounded-lg cursor-pointer text-xs whitespace-nowrap font-medium transition-colors ${filter.bg} ${filter.text}`}
            >
              {filter.label}
            </div>
          ))}
        </div>

        {/* Services Horizontal Scroll */}
        <div className="flex overflow-x-auto w-full gap-4 scrollbar-hide pb-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex-shrink-0 flex items-center gap-4 w-[320px] bg-white border border-gray-100 rounded-xl p-3 h-full relative min-h-[120px] shadow-sm"
            >
              {/* Image */}
              <img
                alt={service.title}
                src={service.image}
                width={90}
                height={90}
                loading="lazy"
                className="rounded-lg object-cover w-[90px] h-[90px] flex-shrink-0 bg-gray-100"
              />

              {/* Content */}
              <div className="flex flex-col justify-center flex-1 min-w-0 pr-2 pb-8">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{service.title}</p>
                {service.description && (
                  <p className="text-gray-500 text-[10px] mt-1 line-clamp-1">{service.description}</p>
                )}
                <div className="flex items-center space-x-2 mt-1.5">
                  <p className="text-sm font-bold text-gray-900">{service.price}</p>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <p className="text-[10px] text-gray-500">{service.duration}</p>
                </div>
              </div>

              {/* Add Button */}
              <button className="absolute bottom-3 right-3 inline-flex items-center justify-center px-4 py-1.5 bg-white border border-gray-200 text-xs font-bold text-[#AC2B57] rounded-lg uppercase shadow-sm hover:bg-gray-50 transition-colors">
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Tailwind Scrollbar Hide Utility */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  );
};

export default MostBooked;
