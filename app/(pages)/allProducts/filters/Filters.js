'use client';

import CategoriesSection from './CategoriesSection';
import PriceSection from './PriceSection';
import SizeSection from './SizeSection';
import DressStyleSection from './DressStyleSection';

const Filters = () => {
  return (
    <div className="space-y-6">
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <SizeSection />
      {/* <hr className="border-t-black/10" /> */}
      {/* <DressStyleSection /> */}
      <button
        type="button"
        className="bg-gray-900 w-full rounded-full text-sm font-medium py-4 h-12 text-white hover:bg-gray-800 transition-colors"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default Filters;