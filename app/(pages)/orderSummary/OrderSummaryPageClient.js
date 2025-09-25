'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, Download, Truck, MapPin, CreditCard, Lock,
  Calendar, Package, ArrowLeft, Star, Clock, User, Mail, Phone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const OrderSummaryPageClient = ({ orderData }) => {
  // Payment method icons mapping
  const paymentIcons = {
    card: CreditCard,
    paypal: Lock,
    cod: Truck,
    apple: CheckCircle,
    google: CheckCircle
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: CheckCircle,
      processing: Clock,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: Clock
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-green-600 bg-green-100',
      processing: 'text-yellow-600 bg-yellow-100',
      shipped: 'text-blue-600 bg-blue-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const StatusIcon = getStatusIcon(orderData.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order #{orderData.orderId}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                Placed on {orderData.date}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(orderData.status)}`}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-medium capitalize">{orderData.status}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <span className="font-medium w-16">Name:</span>
                  <span>{orderData.customer?.name}</span>
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="font-medium w-14">Email:</span>
                  <span>{orderData.customer?.email}</span>
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="font-medium w-14">Phone:</span>
                  <span>{orderData.customer?.phone}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h3>
              <div className="text-sm text-gray-700">
                <p>{orderData.customer?.address}</p>
                <p>{orderData.customer?.city}, {orderData.customer?.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  // Get the payment method type from orderData and map to icon
                  const paymentType = orderData.payment?.type || orderData.payment?.id;
                  const PaymentIcon = paymentIcons[paymentType];
                  return PaymentIcon ? <PaymentIcon className="w-6 h-6 text-gray-600" /> : <CreditCard className="w-6 h-6 text-gray-600" />;
                })()}
                <span className="font-medium">{orderData.payment?.name}</span>
              </div>
              <span className="font-bold text-lg">${orderData.totals?.total}</span>
            </div>
            
            {/* Transaction Details if available */}
            {orderData.payment?.transactionInfo && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Transaction Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Transaction ID:</span>
                    <p className="text-gray-600">{orderData.payment.transactionInfo.transactionId}</p>
                  </div>
                  <div>
                    <span className="font-medium">Payment Date:</span>
                    <p className="text-gray-600">{orderData.payment.transactionInfo.paymentDate}</p>
                  </div>
                  {orderData.payment.transactionInfo.bankName && (
                    <div>
                      <span className="font-medium">Bank:</span>
                      <p className="text-gray-600">{orderData.payment.transactionInfo.bankName}</p>
                    </div>
                  )}
                  {orderData.payment.transactionInfo.accountNumber && (
                    <div>
                      <span className="font-medium">Account:</span>
                      <p className="text-gray-600">****{orderData.payment.transactionInfo.accountNumber}</p>
                    </div>
                  )}
                </div>
                {orderData.payment.transactionInfo.note && (
                  <div className="mt-3">
                    <span className="font-medium">Note:</span>
                    <p className="text-gray-600 text-sm">{orderData.payment.transactionInfo.note}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Package className="w-6 h-6 mr-2" />
            Order Items ({orderData.items?.length || 0} items)
          </h2>
          
          <div className="space-y-4">
            {(orderData.items || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || '/placeholder-image.jpg'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> • </span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">${item.price}/item</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${orderData.totals?.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">${orderData.totals?.shipping}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${orderData.totals?.tax}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-indigo-600">${orderData.totals?.total}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/allProducts"
            className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
          
          <Link
            href="/profile"
            className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium flex items-center justify-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>View All Orders</span>
          </Link>
          
          <button
            onClick={() => window.print()}
            className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Print Receipt</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSummaryPageClient;