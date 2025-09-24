'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetData } from '@/lib/hooks/useGetData';
import { useAddData } from '@/lib/hooks/useAddData';
import { useAppSelector, useAppDispatch } from '@/app/redux/reduxHooks';
import { loadCartFromStorage, clearCart } from '@/app/redux/slice';
import { 
  ShoppingBag, CreditCard, Lock, CheckCircle, AlertCircle, 
  ArrowLeft, User, MapPin, Phone, Mail, Truck, Star, X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CheckoutPageClient = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.user.cart.items) || [];
  const cartTotalQuantity = useAppSelector((state) => state.user.cart.totalQuantity);
  
  // Fetch products for cart item details
  const { data: products, isLoading, error } = useGetData({
    name: 'products',
    api: '/api/products'
  });

  // Merge cart items with fresh product data to fix undefined values
  const enrichedCartItems = cartItems.map(cartItem => {
    if (!cartItem || !cartItem.id) return cartItem;
    
    // Find the current product data using MongoDB _id
    const currentProduct = products?.find(p => p._id === cartItem.id);
    
    if (currentProduct) {
      // Merge cart item with fresh product data, keeping cart-specific fields
      return {
        ...cartItem,
        name: cartItem.name || currentProduct.name,
        price: cartItem.price || currentProduct.price,
        originalPrice: currentProduct.originalPrice,
        image: cartItem.image || currentProduct.image || currentProduct.images?.[0],
        images: currentProduct.images,
        stock: currentProduct.stock,
        colors: currentProduct.colors,
        sizes: currentProduct.sizes,
        description: currentProduct.description,
        category: currentProduct.category,
        style: currentProduct.style
      };
    }
    
    // If product not found in database, return cart item as is
    return cartItem;
  });
  
  // Hook for adding order to database
  const { addData: addOrder, isLoading: isAddingOrder, error: orderError } = useAddData({
    name: 'orders',
    api: '/api/orders'
  });
  
  // State management
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Payment methods configuration
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, MasterCard, American Express' },
    { id: 'paypal', name: 'PayPal', icon: Lock, description: 'Pay with your PayPal account' },
    { id: 'cod', name: 'Cash on Delivery', icon: Truck, description: 'Pay when you receive your order' },
    { id: 'apple', name: 'Apple Pay', icon: CheckCircle, description: 'Pay with Touch ID or Face ID' },
    { id: 'google', name: 'Google Pay', icon: CheckCircle, description: 'Pay with Google Pay' }
  ];

  // Load cart from localStorage when products are loaded
  useEffect(() => {
    if (products && products.length > 0) {
      const getCartFromStorage = () => {
        try {
          const cart = localStorage.getItem('cart');
          return cart ? JSON.parse(cart) : [];
        } catch (error) {
          console.error('Error loading cart:', error);
          return [];
        }
      };

      const cartData = getCartFromStorage();
      
      if (cartData.length > 0) {
        // Load cart data into Redux store
        dispatch(loadCartFromStorage({ cartItems: cartData, products }));
      }
    }
  }, [products, dispatch]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = enrichedCartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    const shipping = subtotal >= 500 ? 0 : 15.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  // Debug logs
  console.log('Checkout - Cart Items:', cartItems);
  console.log('Checkout - Enriched Cart Items:', enrichedCartItems);
  console.log('Checkout - Totals:', totals);

  // Handle customer info change
  const handleInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  // Validate form
  const isFormValid = () => {
    return (
      customerInfo.name &&
      customerInfo.email &&
      customerInfo.phone &&
      customerInfo.address &&
      customerInfo.city &&
      customerInfo.zipCode &&
      selectedPayment &&
      enrichedCartItems.length > 0
    );
  };

  // Process order
  const processOrder = async () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields and select a payment method.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order details for database
      const orderData = {
        orderId: 'ORD-' + Date.now(),
        orderDate: new Date().toISOString(),
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            street: customerInfo.address,
            city: customerInfo.city,
            zipCode: customerInfo.zipCode
          }
        },
        items: enrichedCartItems.map(item => ({
          productId: item.id,
          productName: item.name || 'Product Name',
          price: item.price || 0,
          quantity: item.quantity || 0,
          size: item.size,
          color: item.color,
          subtotal: (item.price || 0) * (item.quantity || 0)
        })),
        paymentMethod: {
          type: selectedPayment,
          name: paymentMethods.find(p => p.id === selectedPayment)?.name
        },
        orderSummary: {
          subtotal: parseFloat(totals.subtotal),
          shipping: parseFloat(totals.shipping),
          tax: parseFloat(totals.tax),
          total: parseFloat(totals.total)
        },
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save order to database
      const savedOrder = await addOrder(orderData);
      console.log('Order saved successfully:', savedOrder);

      // Create order details for modal display
      const order = {
        orderId: orderData.orderId,
        date: new Date().toLocaleDateString(),
        customer: customerInfo,
        items: enrichedCartItems,
        payment: paymentMethods.find(p => p.id === selectedPayment),
        totals: totals,
        status: 'confirmed'
      };

      setOrderDetails(order);
      setIsProcessing(false);
      setShowOrderModal(true);

      // Clear cart from localStorage and Redux store
      dispatch(clearCart());

    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      alert('There was an error processing your order. Please try again.');
    }
  };

  // Order confirmation modal
  const OrderModal = () => (
    <AnimatePresence>
      {showOrderModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
                  <p className="text-gray-600">Order #{orderDetails?.orderId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {orderDetails?.customer.name}</p>
                  <p><span className="font-medium">Email:</span> {orderDetails?.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {orderDetails?.customer.phone}</p>
                  <p><span className="font-medium">Address:</span> {orderDetails?.customer.address}</p>
                  <p><span className="font-medium">City:</span> {orderDetails?.customer.city}, {orderDetails?.customer.zipCode}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails?.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Totals */}
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                    <orderDetails.payment.icon className="w-6 h-6 text-gray-600" />
                    <span className="font-medium">{orderDetails?.payment.name}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${orderDetails?.totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${orderDetails?.totals.shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${orderDetails?.totals.tax}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${orderDetails?.totals.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Link
                  href="/allProducts"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/profile"
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
                >
                  View Orders
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Empty cart state
  if (!isLoading && enrichedCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
          <Link
            href="/allProducts"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Info & Payment */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerInfo.name}
                  onChange={(e) => handleInfoChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={customerInfo.email}
                  onChange={(e) => handleInfoChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={customerInfo.phone}
                  onChange={(e) => handleInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="ZIP Code *"
                  value={customerInfo.zipCode}
                  onChange={(e) => handleInfoChange('zipCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Street Address *"
                  value={customerInfo.address}
                  onChange={(e) => handleInfoChange('address', e.target.value)}
                  className="w-full md:col-span-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={customerInfo.city}
                  onChange={(e) => handleInfoChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === method.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="sr-only"
                    />
                    <method.icon className="w-6 h-6 text-gray-600 mr-4" />
                    <div>
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle className="w-5 h-5 text-indigo-600 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order Summary ({enrichedCartItems.length} items)
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {enrichedCartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || 'https://via.placeholder.com/64x64/f3f4f6/374151?text=Product'}
                        alt={item.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.name || 'Product Name'}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Price Details</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${totals.shipping}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${totals.tax}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totals.total}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                onClick={processOrder}
                disabled={!isFormValid() || isProcessing}
                className={`w-full mt-6 py-4 rounded-lg font-medium text-white transition-colors ${
                  isFormValid() && !isProcessing
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                whileHover={isFormValid() && !isProcessing ? { scale: 1.02 } : {}}
                whileTap={isFormValid() && !isProcessing ? { scale: 0.98 } : {}}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{isAddingOrder ? 'Saving order...' : 'Processing payment...'}</span>
                  </div>
                ) : (
                  `Place Order - $${totals.total}`
                )}
              </motion.button>

              {/* Error Display */}
              {orderError && (
                <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Error saving order: {orderError.message}
                  </p>
                </div>
              )}

              {/* Back to Cart */}
              <Link
                href="/addToCart"
                className="w-full mt-3 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Cart</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <OrderModal />
    </div>
  );
};

export default CheckoutPageClient;