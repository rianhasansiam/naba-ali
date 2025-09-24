'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetData } from '@/lib/hooks/useGetData';
import { 
  ShoppingBag, Minus, Plus, X, Heart, Truck, Shield, 
  ArrowLeft, ArrowRight, Gift, Percent, Tag, CreditCard,
  Lock, CheckCircle, AlertCircle, Star, ShoppingCart
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AddToCartPageClient = () => {
  // Fetch all products using real API
  const { data: products, isLoading: productsLoading, error: productsError } = useGetData({
    name: 'products',
    api: '/api/products'
  });

  const [cartItems, setCartItems] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Static configuration data (not user-specific)
  const staticData = {
    shipping: {
      freeShippingThreshold: 500.00,
      standardShipping: 15.99,
      expressShipping: 29.99,
      expeditedShipping: 49.99,
      estimatedDays: {
        standard: "5-7 business days",
        express: "2-3 business days",
        expedited: "1-2 business days"
      }
    },
    taxes: {
      salesTaxRate: 0.08,
      region: "NY"
    },
    promocodes: {
      available: [
        {
          code: "WELCOME10",
          description: "10% off your first order",
          discount: 0.10,
          minAmount: 100
        },
        {
          code: "SAVE25",
          description: "25% off orders over $300",
          discount: 0.25,
          minAmount: 300
        }
      ]
    },
    paymentMethods: [
      { name: "Visa", icon: "visa" },
      { name: "Mastercard", icon: "mastercard" },
      { name: "American Express", icon: "amex" },
      { name: "PayPal", icon: "paypal" },
      { name: "Apple Pay", icon: "applepay" },
      { name: "Google Pay", icon: "googlepay" }
    ],
    security: {
      sslSecured: true,
      secureCheckout: true,
      encryptedPayments: true
    }
  };

  // Local Storage utility functions
  const getCartFromStorage = () => {
    if (typeof window !== 'undefined') {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    }
    return [];
  };

  const saveCartToStorage = (cart) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  // Load cart data from localStorage and match with products
  useEffect(() => {
    if (products && products.length > 0) {
      const cartFromStorage = getCartFromStorage();
      
      // Match cart items with full product data
      const fullCartItems = cartFromStorage
        .map(cartItem => {
          const fullProduct = products.find(product => product._id === cartItem.id);
          if (fullProduct) {
            return {
              id: fullProduct._id,
              productId: fullProduct._id,
              name: fullProduct.name,
              brand: "NABA ALI",
              price: fullProduct.price,
              originalPrice: fullProduct.originalPrice || fullProduct.price,
              discount: fullProduct.originalPrice ? Math.round(((fullProduct.originalPrice - fullProduct.price) / fullProduct.originalPrice) * 100) : 0,
              quantity: cartItem.quantity || 1,
              size: cartItem.size || fullProduct.sizes?.[0] || 'M',
              color: cartItem.color || fullProduct.colors?.[0] || 'Default',
              image: fullProduct.image,
              inStock: (fullProduct.stock || 0) > 0,
              stockCount: fullProduct.stock || 0,
              category: fullProduct.category || 'Fashion'
            };
          }
          return null;
        })
        .filter(Boolean); // Remove null entries
      
      setCartItems(fullCartItems);
    }
  }, [products]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = cartItems.reduce((sum, item) => {
      const itemDiscount = item.originalPrice - item.price;
      return sum + (itemDiscount * item.quantity);
    }, 0);
    
    let promoDiscount = 0;
    if (appliedPromo && subtotal >= appliedPromo.minAmount) {
      promoDiscount = subtotal * appliedPromo.discount;
    }

    const discountedSubtotal = subtotal - promoDiscount;
    const salesTax = discountedSubtotal * staticData.taxes.salesTaxRate;
    
    let shippingCost = 0;
    if (discountedSubtotal < staticData.shipping.freeShippingThreshold) {
      shippingCost = staticData.shipping[selectedShipping + 'Shipping'] || staticData.shipping.standardShipping;
    }

    const total = discountedSubtotal + salesTax + shippingCost;

    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      promoDiscount: promoDiscount.toFixed(2),
      salesTax: salesTax.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      total: total.toFixed(2),
      freeShippingRemaining: Math.max(0, staticData.shipping.freeShippingThreshold - discountedSubtotal)
    };
  };

  const totals = calculateTotals();

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    
    // Update localStorage
    const cartForStorage = updatedItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      stock: item.stockCount
    }));
    saveCartToStorage(cartForStorage);
  };

  // Remove item
  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    
    // Update localStorage
    const cartForStorage = updatedItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      stock: item.stockCount
    }));
    saveCartToStorage(cartForStorage);
  };

  // Apply promo code
  const applyPromoCode = () => {
    const promo = staticData.promocodes.available.find(p => p.code === promoCode.toUpperCase());
    if (promo && parseFloat(totals.subtotal) >= promo.minAmount) {
      setAppliedPromo(promo);
      setShowPromoInput(false);
      setPromoCode('');
    } else {
      alert('Invalid promo code or minimum amount not met');
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  // Cart Item Component
  const CartItem = ({ item }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 mb-4"
      variants={itemVariants}
      layout
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Product Image */}
        <div className="relative w-full md:w-32 h-32 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
          {item.discount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{item.discount}%
            </div>
          )}
          {!item.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.brand}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">Size: {item.size}</span>
                <span className="text-sm text-gray-600">Color: {item.color}</span>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">${item.price}</span>
            {item.originalPrice > item.price && (
              <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
            )}
          </div>

          {/* Stock Status */}
          {item.inStock && item.stockCount <= 5 && (
            <div className="flex items-center space-x-1 text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Only {item.stockCount} left in stock</span>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || !item.inStock}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={!item.inStock || item.quantity >= item.stockCount}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Shipping Options Component
  const ShippingOptions = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Truck className="w-5 h-5 mr-2" />
        Shipping Options
      </h3>
      
      <div className="space-y-3">
        {Object.entries(staticData.shipping.estimatedDays).map(([type, days]) => {
          const cost = type === 'standard' ? staticData.shipping.standardShipping :
                      type === 'express' ? staticData.shipping.expressShipping :
                      staticData.shipping.expeditedShipping;
          
          const isFree = parseFloat(totals.total) >= staticData.shipping.freeShippingThreshold && type === 'standard';
          
          return (
            <label key={type} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value={type}
                checked={selectedShipping === type}
                onChange={(e) => setSelectedShipping(e.target.value)}
                className="w-4 h-4 text-black focus:ring-black"
              />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{type} Shipping</p>
                  <p className="text-sm text-gray-600">{days}</p>
                </div>
                <p className="font-medium text-gray-900">
                  {isFree ? 'FREE' : `$${cost}`}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {totals.freeShippingRemaining > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Add <span className="font-semibold">${totals.freeShippingRemaining.toFixed(2)}</span> more for free standard shipping!
          </p>
        </div>
      )}
    </div>
  );

  // Promo Code Component
  const PromoCodeSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Tag className="w-5 h-5 mr-2" />
          Promo Code
        </h3>
        {!showPromoInput && !appliedPromo && (
          <button
            onClick={() => setShowPromoInput(true)}
            className="text-sm text-black font-medium hover:text-gray-700"
          >
            Add Code
          </button>
        )}
      </div>

      {appliedPromo ? (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">{appliedPromo.code}</p>
              <p className="text-sm text-green-700">{appliedPromo.description}</p>
            </div>
          </div>
          <button
            onClick={removePromoCode}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : showPromoInput ? (
        <div className="flex space-x-3">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            onClick={applyPromoCode}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setShowPromoInput(false);
              setPromoCode('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Have a promo code? Click &quot;Add Code&quot; to apply it to your order.
        </p>
      )}
    </div>
  );

  // Order Summary Component
  const OrderSummary = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2" />
        Order Summary
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="font-medium">${totals.subtotal}</span>
        </div>
        
        {parseFloat(totals.totalDiscount) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Item Discounts</span>
            <span>-${totals.totalDiscount}</span>
          </div>
        )}
        
        {appliedPromo && parseFloat(totals.promoDiscount) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Promo Code ({appliedPromo.code})</span>
            <span>-${totals.promoDiscount}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Sales Tax ({(staticData.taxes.salesTaxRate * 100).toFixed(1)}%)</span>
          <span className="font-medium">${totals.salesTax}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {parseFloat(totals.shippingCost) === 0 ? 'FREE' : `$${totals.shippingCost}`}
          </span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totals.total}</span>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-900">Secure Checkout</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• SSL encrypted payment processing</p>
          <p>• 256-bit secure encryption</p>
          <p>• PCI DSS compliant</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-900 mb-2">We Accept:</p>
        <div className="flex items-center space-x-2">
          {staticData.paymentMethods.map((method, index) => (
            <div key={index} className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {method.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Button */}
      <motion.button
        className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Lock className="w-5 h-5" />
        <span>Proceed to Checkout</span>
      </motion.button>

      <p className="text-xs text-gray-600 text-center mt-3">
        Your payment information is secure and encrypted
      </p>
    </div>
  );

  // Recommendations Component
  const RecommendationsSection = () => {
    if (!products || products.length === 0) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          You Might Also Like
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((item) => (
            <motion.div
              key={item._id}
              className="group cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{item.category || item.categoryName}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">${item.price}</span>
                <button className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors duration-200">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">{cartItems.length} items in your cart</p>
            </div>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-black hover:text-gray-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </motion.div>

            <ShippingOptions />
            <PromoCodeSection />
            <RecommendationsSection />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPageClient;