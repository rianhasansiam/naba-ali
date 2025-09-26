'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterState, useFilterActions } from '../context/FilterContext';

const CategoryFilter = ({ categoriesData }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const filters = useFilterState();
  const { setCategory } = useFilterActions();

  // Extract unique categories from products
  const categories = useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];
    
    return categoriesData
      .filter(cat => cat.status === 'active')
      .map(cat => ({
        name: cat.name,
        count: cat.productCount || 0
      }));
  }, [categoriesData]);

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
      >
        <span>Category</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => setCategory('')}
              className="mr-3 text-black focus:ring-black"
            />
            <span className="text-gray-700">All Categories</span>
          </label>
          
          {categories.map((category) => (
            <label key={category.name} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category.name}
                  onChange={() => setCategory(category.name)}
                  className="mr-3 text-black focus:ring-black"
                />
                <span className="text-gray-700">{category.name}</span>
              </div>
              <span className="text-gray-400 text-sm">({category.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;