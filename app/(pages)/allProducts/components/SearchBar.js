'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useFilterState, useFilterActions } from '../context/FilterContext';

const SearchBar = ({ placeholder = "Search products..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const filters = useFilterState();
  const { setSearch } = useFilterActions();

  // Initialize search term from filter state
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, setSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setSearch('');
  }, [setSearch]);

  return (
    <div className="relative w-full max-w-md">
      <div className={`
        relative flex items-center bg-white border-2 rounded-full transition-all duration-200
        ${isFocused ? 'border-black shadow-md' : 'border-gray-200'}
      `}>
        <Search 
          size={20} 
          className={`absolute left-4 transition-colors ${
            isFocused ? 'text-black' : 'text-gray-400'
          }`} 
        />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-transparent rounded-full outline-none text-gray-900 placeholder-gray-400"
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {/* Search suggestions or results count could be added here */}
    </div>
  );
};

export default SearchBar;