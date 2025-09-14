'use client';

import { useState } from 'react';
import { FiSliders } from 'react-icons/fi';
import Cards from '../../componets/cards/Cards';
import Filters from './filters/Filters';
import MobileFilters from './filters/MobileFilters';
import Pagination from './Pagination';

const ProductsPageClient = ({ allProducts = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('most-popular');
  const productsPerPage = 8;

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div className="flex md:space-x-5 items-start">
      {/* Desktop Filters */}
      <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-black text-xl">Filters</span>
          <FiSliders className="text-2xl text-black/40" />
        </div>
        <Filters />
      </div>

      {/* Products Section */}
      <div className="flex flex-col w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl md:text-[32px]">All Products</h1>
            <MobileFilters />
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row">
            <span className="text-sm md:text-base text-black/60 mr-3">
              Showing {startIndex + 1}-{Math.min(endIndex, allProducts.length)} of {allProducts.length} Products
            </span>
            <div className="flex items-center">
              Sort by:{" "}
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="most-popular">Most Popular</option>
                <option value="low-price">Low Price</option>
                <option value="high-price">High Price</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full">
          <Cards products={currentProducts} />
        </div>

        {/* Pagination */}
        <hr className="border-t-black/10" />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductsPageClient;