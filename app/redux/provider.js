'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../../store/store'       // ← new unified store
import { loadCartFromStorage, loadWishlistFromStorage } from './slice'

export default function StoreProvider({ children }) {
  const storeRef = useRef()

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  // Rehydrate localStorage-backed cart & wishlist on first render
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(loadCartFromStorage())
      storeRef.current.dispatch(loadWishlistFromStorage())
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}