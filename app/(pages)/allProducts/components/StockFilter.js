'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useFilterState, useFilterActions } from '../context/FilterContext';

const StockFilter = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const filters = useFilterState();
  const { setInStock } = useFilterActions();

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
      >
        <span>Availability</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="mr-3 text-black focus:ring-black rounded"
            />
            <Package 
              size={16} 
              className={`mr-2 ${filters.inStock ? 'text-green-600' : 'text-gray-400'}`} 
            />
            <span className="text-gray-700 group-hover:text-black transition-colors">
              In Stock Only
            </span>
          </label>
          
          <p className="text-xs text-gray-500 ml-8">
            Show only products available for purchase
          </p>
        </div>
      )}
    </div>
  );
};

export default StockFilter;