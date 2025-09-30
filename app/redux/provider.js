'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './store'
import { loadCartFromStorage, loadWishlistFromStorage } from './slice'

export default function StoreProvider({ children }) {
  const storeRef = useRef()

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(loadCartFromStorage())
      storeRef.current.dispatch(loadWishlistFromStorage())
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}