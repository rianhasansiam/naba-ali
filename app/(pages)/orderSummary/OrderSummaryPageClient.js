'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Download, Truck, MapPin, CreditCard, Lock,
  Calendar, Package, ArrowLeft, Star, Clock, User, Mail, Phone, X, FileText
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import jsPDF from 'jspdf';

const OrderSummaryPageClient = ({ orderData }) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
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

  // Show receipt modal
  const viewReceipt = () => {
    setShowReceiptModal(true);
  };

  // Generate and download PDF receipt
  const downloadReceipt = () => {
    const doc = new jsPDF();

    // Set up colors and fonts
    const primaryColor = [41, 128, 185]; // Blue
    const secondaryColor = [52, 73, 94]; // Dark gray
    const accentColor = [46, 204, 113]; // Green

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('SkyZonee', 20, 18);

    doc.setFontSize(12);
    doc.text('Order Receipt', 150, 18);

    // Order details
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(12);
    doc.text('Order Details', 20, 40);

    doc.setFontSize(9);
    doc.text(`Order ID: ${orderData.orderId}`, 20, 50);
    doc.text(`Date: ${orderData.date}`, 20, 58);
    doc.text(`Status: ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}`, 20, 66);

    // Customer information
    doc.setFontSize(12);
    doc.text('Customer Information', 20, 80);

    doc.setFontSize(9);
    doc.text(`Name: ${orderData.customer?.name || 'N/A'}`, 20, 90);
    doc.text(`Email: ${orderData.customer?.email || 'N/A'}`, 20, 98);
    doc.text(`Phone: ${orderData.customer?.phone || 'N/A'}`, 20, 106);
    doc.text(`Address: ${orderData.customer?.address || 'N/A'}`, 20, 114);
    doc.text(`${orderData.customer?.city || 'N/A'}, ${orderData.customer?.zipCode || 'N/A'}`, 20, 122);

    // Payment information
    doc.setFontSize(12);
    doc.text('Payment Information', 20, 136);

    doc.setFontSize(9);
    doc.text(`Method: ${orderData.payment?.name || 'N/A'}`, 20, 146);
    doc.text(`Total: $${orderData.totals?.total || '0.00'}`, 20, 154);

    // Order items
    let yPosition = 168;
    doc.setFontSize(12);
    doc.text('Order Items', 20, yPosition);
    yPosition += 10;

    // Table headers
    doc.setFontSize(9);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 3, 170, 8, 'F');
    doc.text('Item', 25, yPosition + 2);
    doc.text('Qty', 120, yPosition + 2);
    doc.text('Price', 140, yPosition + 2);
    doc.text('Total', 165, yPosition + 2);
    yPosition += 12;

    // Items - limit to 4-5 items to fit on one page
    const itemsToShow = (orderData.items || []).slice(0, 5);
    itemsToShow.forEach((item, index) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      const truncatedName = (item.name || 'Product').length > 30 ?
        (item.name || 'Product').substring(0, 27) + '...' :
        (item.name || 'Product');

      doc.text(truncatedName, 25, yPosition);
      doc.text(item.quantity?.toString() || '1', 120, yPosition);
      doc.text(`$${item.price?.toFixed(2) || '0.00'}`, 140, yPosition);
      doc.text(`$${itemTotal}`, 165, yPosition);
      yPosition += 8;
    });

    // Show "and X more items..." if there are more items
    if ((orderData.items || []).length > 5) {
      const remainingItems = (orderData.items || []).length - 5;
      doc.text(`and ${remainingItems} more item${remainingItems > 1 ? 's' : ''}...`, 25, yPosition);
      yPosition += 8;
    }

    // Order summary
    yPosition += 5;
    doc.setFontSize(12);
    doc.text('Order Summary', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.text(`Subtotal: $${orderData.totals?.subtotal || '0.00'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Shipping: $${orderData.totals?.shipping || '0.00'}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Tax: $${orderData.totals?.tax || '0.00'}`, 20, yPosition);
    yPosition += 12;

    // Total
    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text(`Total: $${orderData.totals?.total || '0.00'}`, 20, yPosition);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(8);
    doc.text('Thank you for shopping with SkyZonee!', 20, pageHeight - 20);
    doc.text('For any questions, please contact our support team.', 20, pageHeight - 12);

    // Save the PDF
    doc.save(`SkyZonee_Order_${orderData.orderId}.pdf`);
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
            className="flex-1 bg-gray-600 text-white py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors text-center font-medium flex items-center justify-center space-x-2"
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
            onClick={viewReceipt}
            className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>View Receipt</span>
          </button>
        </motion.div>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Order Receipt</h2>
                      <p className="text-blue-100">Order #{orderData.orderId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Order ID:</span>
                      <p className="text-gray-900">{orderData.orderId}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <p className="text-gray-900">{orderData.date}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Total Amount:</span>
                      <p className="text-gray-900 font-semibold">${orderData.totals?.total}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium text-gray-600 w-12">Name:</span>
                      <span>{orderData.customer?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium text-gray-600 w-12">Email:</span>
                      <span>{orderData.customer?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium text-gray-600 w-12">Phone:</span>
                      <span>{orderData.customer?.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium text-gray-600 w-12">Address:</span>
                      <span>{orderData.customer?.address}, {orderData.customer?.city} {orderData.customer?.zipCode}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const paymentType = orderData.payment?.type || orderData.payment?.id;
                        const PaymentIcon = paymentIcons[paymentType];
                        return PaymentIcon ? <PaymentIcon className="w-6 h-6 text-gray-600" /> : <CreditCard className="w-6 h-6 text-gray-600" />;
                      })()}
                      <span className="font-medium">{orderData.payment?.name}</span>
                    </div>
                    <span className="font-bold text-lg text-green-600">${orderData.totals?.total}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {(orderData.items || []).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || '/placeholder-image.jpg'}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="text-sm text-gray-600">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span> • </span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">${item.price}/item</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${orderData.totals?.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">${orderData.totals?.shipping}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">${orderData.totals?.tax}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">${orderData.totals?.total}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      downloadReceipt();
                      setShowReceiptModal(false);
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderSummaryPageClient;