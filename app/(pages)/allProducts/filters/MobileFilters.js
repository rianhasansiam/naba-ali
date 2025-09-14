'use client';

import { useState } from 'react';
import { FiSliders } from 'react-icons/fi';
import Filters from './Filters';

const MobileFilters = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="h-8 w-8 rounded-full bg-[#F0F0F0] text-black p-1 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <FiSliders className="text-base mx-auto" />
      </button>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-gray-900/50" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90%] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black text-xl">Filters</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-black/40"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-4">
              <Filters />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilters;