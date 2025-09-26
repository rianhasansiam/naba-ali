import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'

// Enhanced hooks for Redux with error handling
export const useAppDispatch = () => useDispatch()

// Enhanced selector with error handling to prevent proxy revocation errors
export const useAppSelector = (selector) => {
  return useSelector(useCallback((state) => {
    try {
      if (!state || !state.user) {
        // Return safe defaults if state is not available
        if (selector.toString().includes('cart.items')) return []
        if (selector.toString().includes('cart.totalQuantity')) return 0
        if (selector.toString().includes('cart.totalAmount')) return 0
        if (selector.toString().includes('wishlist.items')) return []
        if (selector.toString().includes('wishlist.totalItems')) return 0
        return null
      }
      return selector(state)
    } catch (error) {
      console.error('Error in useAppSelector:', error)
      // Return safe defaults based on common selectors
      if (selector.toString().includes('cart.items')) return []
      if (selector.toString().includes('cart.totalQuantity')) return 0
      if (selector.toString().includes('cart.totalAmount')) return 0
      if (selector.toString().includes('wishlist.items')) return []
      if (selector.toString().includes('wishlist.totalItems')) return 0
      return null
    }
  }, [selector]))
}