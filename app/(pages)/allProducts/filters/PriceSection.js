'use client';

import { useState } from "react";

const PriceSection = () => {
  const [priceRange, setPriceRange] = useState([50, 200]);
  const minPrice = 0;
  const maxPrice = 250;

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-black font-bold text-xl">Price</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Min</label>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="w-full"
            />
            <span className="text-sm">${priceRange[0]}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Max</label>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="w-full"
            />
            <span className="text-sm">${priceRange[1]}</span>
          </div>
        </div>
        <div className="text-center text-sm font-medium">
          ${priceRange[0]} - ${priceRange[1]}
        </div>
      </div>
    </div>
  );
};

export default PriceSection;