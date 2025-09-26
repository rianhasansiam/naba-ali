'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterState, useFilterActions } from '../context/FilterContext';

const SizeFilter = ({ products = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const filters = useFilterState();
  const { setSizes } = useFilterActions();

  // Extract unique sizes from products with proper ordering
  const availableSizes = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    const sizeSet = new Set();
    products.forEach(product => {
      if (Array.isArray(product.sizes)) {
        product.sizes.forEach(size => {
          if (size && size.trim()) {
            sizeSet.add(size.trim());
          }
        });
      }
    });
    
    const sizes = Array.from(sizeSet);
    
    // Custom sorting for clothing sizes
    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const numberSizes = sizes.filter(size => /^\d+/.test(size)).sort((a, b) => parseInt(a) - parseInt(b));
    const letterSizes = sizes.filter(size => sizeOrder.includes(size)).sort((a, b) => {
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
    const otherSizes = sizes.filter(size => !sizeOrder.includes(size) && !/^\d+/.test(size)).sort();
    
    return [...letterSizes, ...numberSizes, ...otherSizes];
  }, [products]);

  const handleSizeToggle = (size) => {
    const updatedSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    
    setSizes(updatedSizes);
  };

  if (availableSizes.length === 0) return null;

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
      >
        <span>Sizes</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`
                  px-3 py-2 text-sm border rounded-lg transition-all duration-200
                  ${filters.sizes.includes(size)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
          
          {filters.sizes.length > 0 && (
            <button
              onClick={() => setSizes([])}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear all sizes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SizeFilter;