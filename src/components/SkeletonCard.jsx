import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
      <div className="p-6">
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
