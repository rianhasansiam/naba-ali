'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetData } from '@/lib/hooks/useGetData';
import { useAddData } from '@/lib/hooks/useAddData';
import { useAppSelector, useAppDispatch } from '@/app/redux/reduxHooks';
import { loadCartFromStorage, clearCart } from '@/app/redux/slice';
import { useShippingTaxSettings } from '@/lib/hooks/useShippingTaxSettings';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';
import { 
  ShoppingBag, CreditCard, Lock, CheckCircle, AlertCircle, 
  ArrowLeft, User, MapPin, Phone, Mail, Truck, Star, X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../componets/loading/LoadingSpinner';

const CheckoutPageClient = () => {
  // Hooks
  const router = useRouter();
  
  // Shipping and tax settings
  const { calculateTotals: calculateDynamicTotals, taxName, taxEnabled, isLoading: settingsLoading } = useShippingTaxSettings();
  
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
        description: currentProduct.shortDescription || currentProduct.description,
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
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderProcessed, setOrderProcessed] = useState(false); // Prevent multiple submissions
  const [isRedirecting, setIsRedirecting] = useState(false); // Prevent showing empty cart during redirect
  
  // Transaction form refs to avoid re-rendering during typing
  const transactionIdRef = useRef(null);
  const paymentDateRef = useRef(null);
  const bankNameRef = useRef(null);
  const accountNumberRef = useRef(null);
  const amountRef = useRef(null);
  const noteRef = useRef(null);

  // Reset transaction form
  const resetTransactionForm = () => {
    if (transactionIdRef.current) transactionIdRef.current.value = '';
    if (paymentDateRef.current) paymentDateRef.current.value = '';
    if (bankNameRef.current) bankNameRef.current.value = '';
    if (accountNumberRef.current) accountNumberRef.current.value = '';
    if (amountRef.current) amountRef.current.value = '';
    if (noteRef.current) noteRef.current.value = '';
  };
  
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

  // Reset order processed flag when cart changes
  useEffect(() => {
    setOrderProcessed(false);
  }, [enrichedCartItems.length, selectedPayment]);

  // Calculate totals with dynamic shipping and tax
  const calculateTotals = () => {
    const subtotal = enrichedCartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    
    // Use dynamic calculation if settings are loaded, otherwise fallback
    if (!settingsLoading && calculateDynamicTotals) {
      return calculateDynamicTotals(subtotal, 0); // No coupon discount in checkout
    }
    
    // Fallback to static calculation while loading
    const shipping = subtotal >= 500 ? 0 : 15.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      taxName: 'Tax'
    };
  };

  const totals = calculateTotals();

  // Debug logs


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

  // Create user if email doesn't exist in database
  const createUserIfNotExists = async (customerData) => {
    try {
      // Check if user exists by email
      const checkUserResponse = await fetch(`/api/users?email=${encodeURIComponent(customerData.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const checkResult = await checkUserResponse.json();

      // If user doesn't exist, create new user
      if (!checkResult.success || !checkResult.user) {

        
        const newUserData = {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          zipCode: customerData.zipCode,
          provider: 'checkout', // Mark as created during checkout
          role: 'user',
          emailVerified: false, // Since they haven't verified email yet
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const createUserResponse = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserData)
        });

        const createResult = await createUserResponse.json();

        if (createResult.success) {

        } else {
          console.error('Failed to create user:', createResult.error);
        }
      } else {

      }
    } catch (error) {
      console.error('Error checking/creating user:', error);
      // Don't throw error - order should still complete even if user creation fails
    }
  };

  // Process order
  const processOrder = async () => {
    if (orderProcessed) return; // Prevent multiple submissions
    
    if (!isFormValid()) {
      alert('Please fill in all required fields and select a payment method.');
      return;
    }

    // If payment method is not COD, show transaction form
    if (selectedPayment !== 'cod') {
      if (!orderProcessed) {
        setShowTransactionForm(true);
      }
      return;
    }

    // For COD, process order directly
    await processOrderWithPayment();
  };

  // Process order with payment information
  const processOrderWithPayment = async (transactionData = null) => {
    if (orderProcessed || isProcessing) return; // Prevent multiple submissions
    
    setIsProcessing(true);
    setOrderProcessed(true); // Mark order as being processed

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
          name: paymentMethods.find(p => p.id === selectedPayment)?.name,
          ...(transactionData && { transactionInfo: transactionData })
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


      // Check if user exists and create new user if not
      await createUserIfNotExists(customerInfo);

      // Create order details for display
      const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);
      const order = {
        orderId: orderData.orderId,
        date: new Date().toLocaleDateString(),
        customer: customerInfo,
        items: enrichedCartItems,
        payment: {
          id: selectedPaymentMethod?.id,
          type: selectedPaymentMethod?.id, // Include both for compatibility
          name: selectedPaymentMethod?.name,
          description: selectedPaymentMethod?.description,
          ...(transactionData && { transactionInfo: transactionData })
        },
        totals: totals,
        status: 'confirmed'
      };

      setIsProcessing(false);
      setShowTransactionForm(false);

      // Set redirecting state to prevent showing empty cart
      setIsRedirecting(true);

      // Clear cart from localStorage and Redux store
      dispatch(clearCart());
      
      // Reset transaction form
      resetTransactionForm();

      // Redirect to order summary page
      const orderDataParam = encodeURIComponent(JSON.stringify(order));
      router.push(`/orderSummary?orderData=${orderDataParam}`);

    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      alert('There was an error processing your order. Please try again.');
    }
  };

  // Transaction Form Modal for non-COD payments
  const TransactionForm = () => (
    <AnimatePresence>
      {showTransactionForm && !orderProcessed && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
                  <p className="text-gray-600">Please provide transaction details</p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetTransactionForm();
                  setShowTransactionForm(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">
              {/* Payment Method Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Selected Payment Method</h3>
                <div className="flex items-center space-x-3">
                  {(() => {
                    const PaymentIcon = paymentMethods.find(p => p.id === selectedPayment)?.icon;
                    return PaymentIcon ? <PaymentIcon className="w-6 h-6 text-gray-600" /> : null;
                  })()}
                  <span className="font-medium">{paymentMethods.find(p => p.id === selectedPayment)?.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Total Amount: ৳{totals.total}</p>
              </div>

              {/* Transaction Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID *
                  </label>
                  <input
                    ref={transactionIdRef}
                    type="text"
                    placeholder="Enter transaction ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date *
                  </label>
                  <input
                    ref={paymentDateRef}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    ref={bankNameRef}
                    type="text"
                    placeholder="Enter bank name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number (Last 4 digits)
                  </label>
                  <input
                    ref={accountNumberRef}
                    type="text"
                    placeholder="****"
                    maxLength="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <input
                    ref={amountRef}
                    type="number"
                    step="0.01"
                    placeholder={`${totals.total}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    ref={noteRef}
                    placeholder="Any additional notes about the transaction..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    resetTransactionForm();
                    setShowTransactionForm(false);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (orderProcessed || isProcessing) return; // Prevent multiple submissions
                    
                    // Get values from refs
                    const transactionId = transactionIdRef.current?.value || '';
                    const paymentDate = paymentDateRef.current?.value || '';
                    const amount = amountRef.current?.value || '';
                    const bankName = bankNameRef.current?.value || '';
                    const accountNumber = accountNumberRef.current?.value || '';
                    const note = noteRef.current?.value || '';
                    
                    // Validate required fields
                    if (!transactionId.trim() || !paymentDate || !amount) {
                      alert('Please fill in all required fields (Transaction ID, Payment Date, and Amount).');
                      return;
                    }
                    
                    // Create transaction data object
                    const transactionData = {
                      transactionId: transactionId.trim(),
                      paymentDate,
                      amount: parseFloat(amount),
                      bankName: bankName.trim(),
                      accountNumber: accountNumber.trim(),
                      note: note.trim(),
                      paymentMethod: paymentMethods.find(p => p.id === selectedPayment)?.name
                    };
                    
                    // Process order with transaction data
                    processOrderWithPayment(transactionData);
                  }}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:bg-gray-400"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Empty cart state or redirecting state
  if ((!isLoading && enrichedCartItems.length === 0 && !isRedirecting) || isRedirecting) {
    if (isRedirecting) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Order...</h2>
            <p className="text-gray-600 mb-6">Please wait while we confirm your order.</p>
            <div className="flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          </motion.div>
        </div>
      );
    }

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
            className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
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
        <LoadingSpinner size="lg" />
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
                        src={item.image || PLACEHOLDER_IMAGES.PRODUCT_MINI}
                        alt={item.name || 'Product'}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized={true}
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
                        ৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
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
                  <span>৳{totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>৳{totals.shipping}</span>
                </div>
                {taxEnabled && parseFloat(totals.tax) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>{totals.taxName || 'Tax'}</span>
                    <span>৳{totals.tax}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>৳{totals.total}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                onClick={processOrder}
                disabled={!isFormValid() || isProcessing || orderProcessed}
                className={`w-full mt-6 py-4 rounded-lg font-medium text-white transition-colors ${
                  isFormValid() && !isProcessing && !orderProcessed
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                whileHover={isFormValid() && !isProcessing && !orderProcessed ? { scale: 1.02 } : {}}
                whileTap={isFormValid() && !isProcessing && !orderProcessed ? { scale: 0.98 } : {}}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" color="white" />
                    <span>{isAddingOrder ? 'Saving order...' : 'Processing payment...'}</span>
                  </div>
                ) : orderProcessed ? (
                  'Order Placed Successfully!'
                ) : (
                  `Place Order - ৳${totals.total}`
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

      {/* Transaction Form Modal */}
      <TransactionForm />
    </div>
  );
};

export default CheckoutPageClient;