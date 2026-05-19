/**
 * store/slices/modalSlice.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend UI state for specific named modals.
 * No product data from MongoDB is stored — only IDs needed to open a modal.
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loginModalOpen:         false,
  productQuickViewOpen:   false,
  selectedProductId:      null,  // Only the ID — product data lives in React Query cache
  deleteConfirmOpen:      false,
  deleteTargetId:         null,
  deleteTargetType:       null,  // 'product' | 'category' | 'review' | 'order'
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    // ── Login modal ───────────────────────────────────────────────────────────
    openLoginModal:  state => { state.loginModalOpen = true },
    closeLoginModal: state => { state.loginModalOpen = false },

    // ── Product quick-view ────────────────────────────────────────────────────
    openProductQuickView: (state, { payload }) => {
      state.productQuickViewOpen = true
      state.selectedProductId   = payload   // string ID only
    },
    closeProductQuickView: state => {
      state.productQuickViewOpen = false
      state.selectedProductId   = null
    },

    // ── Delete confirm ────────────────────────────────────────────────────────
    openDeleteConfirm: (state, { payload }) => {
      state.deleteConfirmOpen = true
      state.deleteTargetId   = payload.id
      state.deleteTargetType = payload.type
    },
    closeDeleteConfirm: state => {
      state.deleteConfirmOpen = false
      state.deleteTargetId   = null
      state.deleteTargetType = null
    },
  },
})

export const {
  openLoginModal, closeLoginModal,
  openProductQuickView, closeProductQuickView,
  openDeleteConfirm, closeDeleteConfirm,
} = modalSlice.actions

export default modalSlice.reducer
