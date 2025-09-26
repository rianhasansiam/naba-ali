'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterState, useFilterActions } from '../context/FilterContext';

const ColorFilter = ({ products = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const filters = useFilterState();
  const { setColors } = useFilterActions();

  // Extract unique colors from products
  const availableColors = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    const colorSet = new Set();
    products.forEach(product => {
      if (Array.isArray(product.colors)) {
        product.colors.forEach(color => {
          if (color && color.trim()) {
            colorSet.add(color.trim());
          }
        });
      }
    });
    
    return Array.from(colorSet).sort();
  }, [products]);

  const handleColorToggle = (color) => {
    const updatedColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    
    setColors(updatedColors);
  };

  // Color display mapping for better UI
  const colorDisplayMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#EF4444',
    'Blue': '#3B82F6',
    'Green': '#10B981',
    'Yellow': '#F59E0B',
    'Purple': '#8B5CF6',
    'Pink': '#EC4899',
    'Brown': '#92400E',
    'Gray': '#6B7280',
    'Grey': '#6B7280',
    'Orange': '#F97316',
    'Navy': '#1E3A8A',
    'Beige': '#F5F5DC'
  };

  const getColorStyle = (color) => {
    const colorCode = colorDisplayMap[color] || colorDisplayMap[color.toLowerCase()];
    if (colorCode) {
      return {
        backgroundColor: colorCode,
        border: colorCode === '#FFFFFF' ? '2px solid #E5E7EB' : '2px solid transparent'
      };
    }
    return {
      backgroundColor: '#F3F4F6',
      border: '2px solid #E5E7EB'
    };
  };

  if (availableColors.length === 0) return null;

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
      >
        <span>Colors</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          {availableColors.map((color) => (
            <label key={color} className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.colors.includes(color)}
                  onChange={() => handleColorToggle(color)}
                  className="sr-only"
                />
                <div 
                  className={`
                    w-6 h-6 rounded-full mr-3 flex-shrink-0 transition-all duration-200
                    ${filters.colors.includes(color) 
                      ? 'ring-2 ring-black ring-offset-2' 
                      : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                    }
                  `}
                  style={getColorStyle(color)}
                >
                  {filters.colors.includes(color) && (
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path 
                          d="M10 3L4.5 8.5L2 6" 
                          stroke={color === 'White' ? '#000' : '#fff'} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-gray-700 group-hover:text-black transition-colors">
                {color}
              </span>
            </label>
          ))}
          
          {filters.colors.length > 0 && (
            <button
              onClick={() => setColors([])}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear all colors
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorFilter;