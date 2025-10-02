'use client';

import { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterState, useFilterActions } from '../context/FilterContext';

const PriceRangeFilter = ({ products = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const filters = useFilterState();
  const { setPriceRange } = useFilterActions();

  // Calculate min and max prices from products
  const { minPrice, maxPrice } = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return { minPrice: 0, maxPrice: 1000 };
    }
    
    const prices = products.map(p => p.price || 0);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  const handleMinChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange({
      min: Math.min(value, filters.priceRange.max - 1),
      max: filters.priceRange.max
    });
  }, [filters.priceRange.max, setPriceRange]);

  const handleMaxChange = useCallback((e) => {
    const value = parseInt(e.target.value) || maxPrice;
    setPriceRange({
      min: filters.priceRange.min,
      max: Math.max(value, filters.priceRange.min + 1)
    });
  }, [filters.priceRange.min, maxPrice, setPriceRange]);

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
      >
        <span>Price Range</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="space-y-4">
          {/* Price Range Slider */}
          <div className="px-1">
            <div className="relative">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.priceRange.min}
                onChange={handleMinChange}
                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{ zIndex: 1 }}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.priceRange.max}
                onChange={handleMaxChange}
                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{ zIndex: 2 }}
              />
            </div>
          </div>
          
          {/* Price Inputs */}
          <div className="flex items-center space-x-3 ">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 mt-5 ml-2">Min</label>
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={handleMinChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 mt-5 ml-2">Max</label>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={handleMaxChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                placeholder={maxPrice.toString()}
              />
            </div>
          </div>
          
          {/* Current Range Display */}
          <div className="text-center text-sm text-gray-600">
            ৳{filters.priceRange.min} - ৳{filters.priceRange.max}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default PriceRangeFilter;