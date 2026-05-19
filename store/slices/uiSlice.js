/**
 * store/slices/uiSlice.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend UI state ONLY — no MongoDB data stored here.
 *
 * Controls:
 *  - Sidebar / drawer open/close state
 *  - Mobile menu
 *  - Theme
 *  - Active modal name
 *  - Toast/notification queue
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen:     false,
  cartDrawerOpen:  false,
  mobileMenuOpen:  false,
  theme:           'light',   // 'light' | 'dark'
  activeModal:     null,      // null or string modal name

  // Toast / notification queue
  toasts: [],   // [{ id, type, message, duration }]
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ── Drawers ──────────────────────────────────────────────────────────────
    setSidebarOpen:    (state, { payload }) => { state.sidebarOpen    = Boolean(payload) },
    setCartDrawerOpen: (state, { payload }) => { state.cartDrawerOpen = Boolean(payload) },
    setMobileMenuOpen: (state, { payload }) => { state.mobileMenuOpen = Boolean(payload) },

    toggleSidebar:    state => { state.sidebarOpen    = !state.sidebarOpen },
    toggleCartDrawer: state => { state.cartDrawerOpen = !state.cartDrawerOpen },
    toggleMobileMenu: state => { state.mobileMenuOpen = !state.mobileMenuOpen },

    // Close all overlays at once (e.g. on route change)
    closeAllOverlays: state => {
      state.sidebarOpen    = false
      state.cartDrawerOpen = false
      state.mobileMenuOpen = false
      state.activeModal    = null
    },

    // ── Theme ─────────────────────────────────────────────────────────────────
    setTheme:   (state, { payload }) => { state.theme = payload },
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },

    // ── Modal ─────────────────────────────────────────────────────────────────
    openModal:  (state, { payload }) => { state.activeModal = payload },
    closeModal: state => { state.activeModal = null },

    // ── Toasts ────────────────────────────────────────────────────────────────
    addToast: (state, { payload }) => {
      state.toasts.push({
        id:       payload.id       || `toast_${Date.now()}`,
        type:     payload.type     || 'info',   // 'info' | 'success' | 'error' | 'warning'
        message:  payload.message  || '',
        duration: payload.duration || 4000,
      })
    },
    removeToast: (state, { payload }) => {
      state.toasts = state.toasts.filter(t => t.id !== payload)
    },
    clearToasts: state => { state.toasts = [] },
  },
})

export const {
  setSidebarOpen, setCartDrawerOpen, setMobileMenuOpen,
  toggleSidebar, toggleCartDrawer, toggleMobileMenu,
  closeAllOverlays,
  setTheme, toggleTheme,
  openModal, closeModal,
  addToast, removeToast, clearToasts,
} = uiSlice.actions

export default uiSlice.reducer
