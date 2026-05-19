/**
 * store/hooks.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Typed Redux hooks for the new store layout.
 * Import from here instead of react-redux directly.
 */

'use client'

import { useDispatch, useSelector } from 'react-redux'

// ── Base hooks ─────────────────────────────────────────────────────────────────
export const useAppDispatch = () => useDispatch()
export const useAppSelector = (selector) => useSelector(selector)

// ── UI selectors ───────────────────────────────────────────────────────────────
export const useUI = () => useAppSelector(state => state.ui)

export const useCartDrawer  = () => useAppSelector(state => state.ui.cartDrawerOpen)
export const useSidebar     = () => useAppSelector(state => state.ui.sidebarOpen)
export const useMobileMenu  = () => useAppSelector(state => state.ui.mobileMenuOpen)
export const useTheme       = () => useAppSelector(state => state.ui.theme)
export const useActiveModal = () => useAppSelector(state => state.ui.activeModal)
export const useToasts      = () => useAppSelector(state => state.ui.toasts)

// ── Filter selectors ───────────────────────────────────────────────────────────
export const useFilters = () => useAppSelector(state => state.filter)

export const useSelectedCategory = () => useAppSelector(state => state.filter.selectedCategory)
export const useSortBy           = () => useAppSelector(state => state.filter.sortBy)
export const useSearchQuery      = () => useAppSelector(state => state.filter.searchQuery)
export const usePriceRange       = () => useAppSelector(state => state.filter.priceRange)

// ── Modal selectors ────────────────────────────────────────────────────────────
export const useModals = () => useAppSelector(state => state.modal)

export const useLoginModal        = () => useAppSelector(state => state.modal.loginModalOpen)
export const useProductQuickView  = () => useAppSelector(state => ({
  isOpen:    state.modal.productQuickViewOpen,
  productId: state.modal.selectedProductId,
}))
export const useDeleteConfirm = () => useAppSelector(state => ({
  isOpen: state.modal.deleteConfirmOpen,
  id:     state.modal.deleteTargetId,
  type:   state.modal.deleteTargetType,
}))

// ── Cart / Wishlist selectors (from existing userSlice) ────────────────────────
export const useCartItems       = () => useAppSelector(state => state.user?.cart?.items ?? [])
export const useCartTotalQty    = () => useAppSelector(state => state.user?.cart?.totalQuantity ?? 0)
export const useCartTotalAmount = () => useAppSelector(state => state.user?.cart?.totalAmount ?? 0)
export const useWishlistItems   = () => useAppSelector(state => state.user?.wishlist?.items ?? [])
export const useWishlistCount   = () => useAppSelector(state => state.user?.wishlist?.totalItems ?? 0)
