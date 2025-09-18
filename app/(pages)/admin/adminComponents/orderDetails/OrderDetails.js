import OrderDetailsClient from './OrderDetailsClient';

// Server Component - Handles data fetching
const OrderDetails = () => {
  // Server-side orders data (could come from database/API)
  const ordersData = {
    orders: [
      {
        id: '#3210',
        customer: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        status: 'delivered',
        paymentStatus: 'paid',
        total: 156.90,
        items: 3,
        date: '2025-09-18',
        shippingAddress: '123 Main St, New York, NY 10001',
        trackingNumber: 'TN123456789',
        paymentMethod: 'Credit Card',
        products: [
          { name: 'Premium Cotton T-Shirt', quantity: 2, price: 49.99 },
          { name: 'Designer Jeans', quantity: 1, price: 129.99 }
        ]
      },
      {
        id: '#3209',
        customer: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 987-6543',
        status: 'processing',
        paymentStatus: 'paid',
        total: 89.50,
        items: 1,
        date: '2025-09-18',
        shippingAddress: '456 Oak Ave, San Francisco, CA 94102',
        trackingNumber: 'TN987654321',
        paymentMethod: 'PayPal',
        products: [
          { name: 'Casual Sneakers', quantity: 1, price: 89.99 }
        ]
      },
      {
        id: '#3208',
        customer: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 456-7890',
        status: 'shipped',
        paymentStatus: 'paid',
        total: 234.80,
        items: 2,
        date: '2025-09-17',
        shippingAddress: '789 Pine St, Los Angeles, CA 90210',
        trackingNumber: 'TN456789012',
        paymentMethod: 'Credit Card',
        products: [
          { name: 'Summer Dress', quantity: 1, price: 79.99 },
          { name: 'Leather Jacket', quantity: 1, price: 249.99 }
        ]
      }
    ],
    stats: {
      totalOrders: 1250,
      pendingOrders: 45,
      processingOrders: 23,
      shippedOrders: 67,
      deliveredOrders: 1115,
      totalRevenue: 124500
    }
  };

  // Pass data to client component
  return <OrderDetailsClient ordersData={ordersData} />;
};

export default OrderDetails;