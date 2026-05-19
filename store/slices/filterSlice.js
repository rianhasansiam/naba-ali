/**
 * store/slices/filterSlice.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend UI state for product filtering / sorting.
 * No product data is stored here — only the CRITERIA the user selected.
 * Components read from React Query and apply these filters client-side.
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedCategory: '',        // '' means "All"
  sortBy:           'newest',  // 'newest' | 'price-asc' | 'price-desc' | 'rating'
  searchQuery:      '',
  priceRange:       { min: 0, max: 100000 },
  inStockOnly:      false,
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSelectedCategory: (state, { payload }) => { state.selectedCategory = payload ?? '' },
    setSortBy:           (state, { payload }) => { state.sortBy           = payload },
    setSearchQuery:      (state, { payload }) => { state.searchQuery      = payload ?? '' },
    setPriceRange:       (state, { payload }) => { state.priceRange       = payload },
    setInStockOnly:      (state, { payload }) => { state.inStockOnly      = Boolean(payload) },

    // Reset all filters to defaults
    resetFilters: () => initialState,
  },
})

export const {
  setSelectedCategory,
  setSortBy,
  setSearchQuery,
  setPriceRange,
  setInStockOnly,
  resetFilters,
} = filterSlice.actions

export default filterSlice.reducer
