import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [
    {
      name: "Rian Hasan Siam",
      email: "rian@example.com"
    }
  ],
  cart: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  },
  wishlist: {
    items: [],
    totalItems: 0
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    
    // Cart actions
    addToCart: (state, action) => {
      const payload = action.payload;
      
      // Handle both old format { product, quantity, size, color } and new format { id, name, price, etc. }
      let itemToAdd;
      if (payload.product) {
        // Old format
        const { product, quantity = 1, size, color } = payload;
        itemToAdd = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          quantity,
          size,
          color,
          stock: product.stockCount || 10
        };
      } else {
        // New format (from wishlist and other components)
        itemToAdd = {
          id: payload.id,
          name: payload.name,
          price: payload.price,
          image: payload.image,
          quantity: payload.quantity || 1,
          size: payload.size,
          color: payload.color,
          stock: payload.stock || 10
        };
      }
      
      const existingItem = state.cart.items.find(
        item => item.id === itemToAdd.id && item.size === itemToAdd.size && item.color === itemToAdd.color
      );
      
      if (existingItem) {
        existingItem.quantity += itemToAdd.quantity;
      } else {
        state.cart.items.push(itemToAdd);
      }
      
      state.cart.totalQuantity += itemToAdd.quantity;
      state.cart.totalAmount += itemToAdd.price * itemToAdd.quantity;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        const cartForStorage = state.cart.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          stock: item.stock
        }));
        localStorage.setItem('cart', JSON.stringify(cartForStorage));
      }
    },
    
    updateCartQuantity: (state, action) => {
      const { id, size, color, newQuantity } = action.payload;
      const item = state.cart.items.find(
        item => item.id === id && item.size === size && item.color === color
      );
      
      if (item && newQuantity > 0) {
        const quantityDiff = newQuantity - item.quantity;
        item.quantity = newQuantity;
        state.cart.totalQuantity += quantityDiff;
        state.cart.totalAmount += item.price * quantityDiff;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          const cartForStorage = state.cart.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            stock: item.stockCount
          }));
          localStorage.setItem('cart', JSON.stringify(cartForStorage));
        }
      }
    },
    
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      const itemIndex = state.cart.items.findIndex(
        item => item.id === id && item.size === size && item.color === color
      );
      
      if (itemIndex >= 0) {
        const item = state.cart.items[itemIndex];
        state.cart.totalQuantity -= item.quantity;
        state.cart.totalAmount -= item.price * item.quantity;
        state.cart.items.splice(itemIndex, 1);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          const cartForStorage = state.cart.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            stock: item.stockCount
          }));
          localStorage.setItem('cart', JSON.stringify(cartForStorage));
        }
      }
    },
    
    clearCart: (state) => {
      state.cart.items = [];
      state.cart.totalQuantity = 0;
      state.cart.totalAmount = 0;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },
    
    loadCartFromStorage: (state, action) => {
      if (typeof window !== 'undefined') {
        const cartFromStorage = localStorage.getItem('cart');
        if (cartFromStorage) {
          try {
            const cartItems = JSON.parse(cartFromStorage);
            // Load cart items from storage with proper stock information
            state.cart.items = cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image || item.imageUrl,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              stock: item.stock || 10 // Default stock if not provided
            }));
            state.cart.totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            state.cart.totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          } catch (error) {
            console.error('Error loading cart from storage:', error);
          }
        }
      }
    },
    
    // Wishlist actions
    addToWishlist: (state, action) => {
      const payload = action.payload;
      
      // Handle both old format (full product object) and new format { id, name, price, etc. }
      let itemToAdd;
      if (payload._id) {
        // Old format - full product object
        itemToAdd = {
          id: payload._id,
          name: payload.name,
          price: payload.price,
          image: payload.imageUrl || payload.image,
          addedAt: new Date().toISOString()
        };
      } else {
        // New format
        itemToAdd = {
          id: payload.id,
          name: payload.name,
          price: payload.price,
          image: payload.image,
          addedAt: new Date().toISOString()
        };
      }
      
      const existingItem = state.wishlist.items.find(item => item.id === itemToAdd.id);
      
      if (!existingItem) {
        state.wishlist.items.push(itemToAdd);
        state.wishlist.totalItems += 1;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          const wishlistForStorage = state.wishlist.items.map(item => ({
            id: item.id,
            addedAt: item.addedAt
          }));
          localStorage.setItem('wishlist', JSON.stringify(wishlistForStorage));
        }
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.wishlist.items.findIndex(item => item.id === productId);
      
      if (itemIndex >= 0) {
        state.wishlist.items.splice(itemIndex, 1);
        state.wishlist.totalItems -= 1;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          const wishlistForStorage = state.wishlist.items.map(item => ({
            id: item.id,
            addedAt: item.addedAt
          }));
          localStorage.setItem('wishlist', JSON.stringify(wishlistForStorage));
        }
      }
    },
    
    loadWishlistFromStorage: (state, action) => {
      if (typeof window !== 'undefined') {
        const wishlistFromStorage = localStorage.getItem('wishlist');
        if (wishlistFromStorage) {
          try {
            const wishlistItems = JSON.parse(wishlistFromStorage);
            // Just load the basic structure, products will be matched in component
            state.wishlist.items = wishlistItems.map(item => ({
              id: item.id,
              addedAt: item.addedAt || new Date().toISOString()
            }));
            state.wishlist.totalItems = wishlistItems.length;
          } catch (error) {
            console.error('Error loading wishlist from storage:', error);
          }
        }
      }
    }
  },
})

// Export the actions
export const { 
  addUser, 
  addToCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  loadCartFromStorage,
  addToWishlist, 
  removeFromWishlist, 
  loadWishlistFromStorage 
} = userSlice.actions

export default userSlice.reducer;