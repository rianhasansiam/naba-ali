'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterState, useFilterActions } from '../context/FilterContext';

const StyleFilter = ({ products = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const filters = useFilterState();
  const { setStyle } = useFilterActions();

  // Extract unique styles from products
  const availableStyles = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    const styleSet = new Set();
    products.forEach(product => {
      if (product.style && product.style.trim()) {
        styleSet.add(product.style.trim());
      }
    });
    
    return Array.from(styleSet).sort();
  }, [products]);

  if (availableStyles.length === 0) return null;

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
      >
        <span>Style</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="style"
              checked={!filters.style}
              onChange={() => setStyle('')}
              className="mr-3 text-black focus:ring-black"
            />
            <span className="text-gray-700">All Styles</span>
          </label>
          
          {availableStyles.map((style) => (
            <label key={style} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="style"
                checked={filters.style === style}
                onChange={() => setStyle(style)}
                className="mr-3 text-black focus:ring-black"
              />
              <span className="text-gray-700">{style}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleFilter;