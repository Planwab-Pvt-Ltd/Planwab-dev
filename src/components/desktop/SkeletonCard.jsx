import React from 'react';

const SkeletonCard = () => {
  return (
    <div
      className="rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse"
      style={{ aspectRatio: "3/4" }}
    />
  );
};

export default SkeletonCard;