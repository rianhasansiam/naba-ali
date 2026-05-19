/**
 * store/store.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Redux store factory.
 *
 * Architecture rule: Redux manages ONLY frontend UI state.
 *   ✅ uiSlice   — drawers, modals, toasts, theme
 *   ✅ filterSlice — search, sort, category filter, price range
 *   ✅ modalSlice  — specific modal open/close + minimal IDs
 *   ✅ userSlice   — local cart/wishlist (localStorage-backed)
 *
 *   ❌ Products data from MongoDB  → React Query
 *   ❌ Orders data from MongoDB    → React Query
 *   ❌ Reviews data from MongoDB   → React Query
 *   ❌ Users data from MongoDB     → React Query
 */

import { configureStore } from '@reduxjs/toolkit'
import userReducer   from '../app/redux/slice'     // existing cart/wishlist slice (preserved)
import uiReducer     from './slices/uiSlice'
import filterReducer from './slices/filterSlice'
import modalReducer  from './slices/modalSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      user:   userReducer,   // cart + wishlist (localStorage-backed UI state)
      ui:     uiReducer,
      filter: filterReducer,
      modal:  modalReducer,
    },
  })
