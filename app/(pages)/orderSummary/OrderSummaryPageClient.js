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
  
  // Payment method icons mapping - Only COD available
  const paymentIcons = {
    cod: Truck
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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // === Enhanced Color Scheme ===
    const colors = {
      primary: [0, 0, 0],           // Black
      accent: [59, 130, 246],       // Blue
      success: [34, 197, 94],       // Green
      text: [31, 41, 55],           // Gray 800
      lightGray: [243, 244, 246],   // Gray 100
      mediumGray: [156, 163, 175],  // Gray 400
      border: [229, 231, 235]       // Gray 200
    };

    // === Header Section with Professional Design ===
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Company name/logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SKYZONEE', 20, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Fashion & Lifestyle', 20, 30);
    doc.text('Since 2025', 20, 36);
    
    // Order Receipt badge
    doc.setFillColor(...colors.accent);
    doc.roundedRect(pageWidth - 70, 15, 50, 15, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT', pageWidth - 60, 24);

    // === Order ID & Status Banner ===
    let y = 55;
    doc.setFillColor(...colors.lightGray);
    doc.rect(15, y, pageWidth - 30, 18, 'F');
    
    doc.setTextColor(...colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order #${orderData.orderId}`, 20, y + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...colors.mediumGray);
    doc.text(`Placed on ${orderData.date}`, 20, y + 14);
    
    // Status badge
    const statusColors = {
      pending: [251, 191, 36],
      processing: [59, 130, 246],
      shipped: [139, 92, 246],
      delivered: [34, 197, 94],
      cancelled: [239, 68, 68],
      confirmed: [34, 197, 94]
    };
    const statusColor = statusColors[orderData.status] || colors.mediumGray;
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - 50, y + 5, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(orderData.status.toUpperCase(), pageWidth - 46, y + 10);

    // === Customer & Payment Info in Two Columns ===
    y = 80;
    
    // Left column - Customer Info
    doc.setTextColor(...colors.text);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 20, y);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(orderData.customer?.name || 'N/A', 20, y + 8);
    
    doc.setFontSize(9);
    doc.setTextColor(...colors.mediumGray);
    doc.text(orderData.customer?.email || 'N/A', 20, y + 14);
    doc.text(orderData.customer?.phone || 'N/A', 20, y + 20);
    doc.text(orderData.customer?.address || 'N/A', 20, y + 26);
    doc.text(`${orderData.customer?.city || 'N/A'}, ${orderData.customer?.zipCode || 'N/A'}`, 20, y + 32);
    
    // Right column - Payment Info
    doc.setTextColor(...colors.text);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT', pageWidth - 75, y);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(orderData.payment?.name || 'N/A', pageWidth - 75, y + 8);
    
    doc.setFontSize(9);
    doc.setTextColor(...colors.mediumGray);
    doc.text('Payment Status:', pageWidth - 75, y + 14);
    doc.setTextColor(...colors.success);
    doc.text('Confirmed', pageWidth - 75, y + 20);

    // === Items Table with Enhanced Design ===
    y = 125;
    doc.setTextColor(...colors.text);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER ITEMS', 20, y);
    y += 8;

    // Table header
    doc.setFillColor(...colors.primary);
    doc.rect(15, y, pageWidth - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCT', 20, y + 6);
    doc.text('QTY', 110, y + 6);
    doc.text('PRICE', 130, y + 6);
    doc.text('TOTAL', pageWidth - 20, y + 6, { align: 'right' });
    y += 12;

    // Table rows
    const itemsToShow = (orderData.items || []).slice(0, 6);
    itemsToShow.forEach((item, index) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(...colors.lightGray);
        doc.rect(15, y - 4, pageWidth - 30, 8, 'F');
      }
      
      const itemPrice = parseFloat(item.price || 0);
      const itemQty = parseInt(item.quantity || 1);
      const itemTotal = (itemPrice * itemQty).toFixed(2);
      const truncatedName = (item.name || 'Product').length > 32 ?
        (item.name || 'Product').substring(0, 29) + '...' :
        (item.name || 'Product');

      doc.setTextColor(...colors.text);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(truncatedName, 20, y + 2);
      doc.text(itemQty.toString(), 110, y + 2);
      doc.text('BDT ' + itemPrice.toFixed(2), 130, y + 2);
      doc.setFont('helvetica', 'bold');
      doc.text('BDT ' + itemTotal, pageWidth - 20, y + 2, { align: 'right' });
      y += 8;
    });

    if ((orderData.items || []).length > 6) {
      doc.setTextColor(...colors.mediumGray);
      doc.setFontSize(8);
      doc.text(`+ ${(orderData.items || []).length - 6} more items`, 20, y + 2);
      y += 8;
    }

    // === Order Summary Box ===
    y += 10;
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(pageWidth - 85, y, 70, 40, 3, 3, 'S');
    
    // Subtotal
    doc.setTextColor(...colors.mediumGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', pageWidth - 80, y + 8);
    doc.setTextColor(...colors.text);
    doc.text('BDT ' + parseFloat(orderData.totals?.subtotal || 0).toFixed(2), pageWidth - 20, y + 8, { align: 'right' });
    
    // Shipping
    doc.setTextColor(...colors.mediumGray);
    doc.text('Shipping:', pageWidth - 80, y + 16);
    doc.setTextColor(...colors.text);
    doc.text('BDT ' + parseFloat(orderData.totals?.shipping || 0).toFixed(2), pageWidth - 20, y + 16, { align: 'right' });
    
    // Tax
    doc.setTextColor(...colors.mediumGray);
    doc.text('Tax:', pageWidth - 80, y + 24);
    doc.setTextColor(...colors.text);
    doc.text('BDT ' + parseFloat(orderData.totals?.tax || 0).toFixed(2), pageWidth - 20, y + 24, { align: 'right' });
    
    // Divider
    doc.setDrawColor(...colors.border);
    doc.line(pageWidth - 80, y + 28, pageWidth - 20, y + 28);
    
    // Total
    doc.setFillColor(...colors.success);
    doc.rect(pageWidth - 85, y + 30, 70, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', pageWidth - 80, y + 37);
    doc.text('BDT ' + parseFloat(orderData.totals?.total || 0).toFixed(2), pageWidth - 20, y + 37, { align: 'right' });

    // === Professional Footer ===
    doc.setDrawColor(...colors.border);
    doc.line(15, pageHeight - 35, pageWidth - 15, pageHeight - 35);
    
    doc.setTextColor(...colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing SkyZonee!', pageWidth / 2, pageHeight - 27, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.mediumGray);
    doc.text('Questions? Contact us: support@skyzonee.com | +880 1234-567890', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('www.skyzonee.com | Bangladesh\'s Premium Fashion Store', pageWidth / 2, pageHeight - 14, { align: 'center' });

    // Save the PDF
    doc.save(`SkyZonee_Receipt_${orderData.orderId}.pdf`);
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
              <span className="font-bold text-lg price-number">BDT {orderData.totals?.total}</span>
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
                  <p className="font-semibold text-gray-900 price-number">
                    BDT {parseFloat(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 price-number">
                    BDT {parseFloat(item.price).toFixed(2)}/item
                  </p>
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
              <span className="font-medium price-number">
                BDT {parseFloat(orderData.totals?.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium price-number">
                BDT {parseFloat(orderData.totals?.shipping || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium price-number">
                BDT {parseFloat(orderData.totals?.tax || 0).toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-indigo-600 price-number">
                BDT {parseFloat(orderData.totals?.total || 0).toFixed(2)}
              </span>
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
                      <p className="text-gray-900 font-semibold price-number">
                        BDT {parseFloat(orderData.totals?.total || 0).toFixed(2)}
                      </p>
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
                    <span className="font-bold text-lg text-green-600 price-number">
                      BDT {parseFloat(orderData.totals?.total || 0).toFixed(2)}
                    </span>
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
                          <p className="font-semibold text-gray-900 price-number">
                            BDT {parseFloat(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 price-number">
                            BDT {parseFloat(item.price).toFixed(2)}/item
                          </p>
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
                      <span className="font-medium price-number">
                        BDT {parseFloat(orderData.totals?.subtotal || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium price-number">
                        BDT {parseFloat(orderData.totals?.shipping || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium price-number">
                        BDT {parseFloat(orderData.totals?.tax || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span className="text-gray-900">TOTAL:</span>
                      <span className="text-green-600 price-number">
                        BDT {parseFloat(orderData.totals?.total || 0).toFixed(2)}
                      </span>
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