import AddToCartPageClient from './AddToCartPageClient';

// Server-side data and configuration
const getCartData = () => {
  return {
    seoData: {
      title: "Shopping Cart - NABA ALI | Premium Fashion",
      description: "Review your selected premium fashion items, adjust quantities, and proceed to secure checkout at NABA ALI.",
      keywords: "shopping cart, fashion checkout, NABA ALI cart, premium clothing cart"
    },
    cartItems: [
      {
        id: "item_1",
        productId: "prod_001",
        name: "Premium Cotton Dress",
        brand: "NABA ALI",
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        quantity: 2,
        size: "M",
        color: "Navy Blue",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        inStock: true,
        stockCount: 5,
        category: "Dresses"
      },
      {
        id: "item_2",
        productId: "prod_002",
        name: "Silk Scarf Collection",
        brand: "NABA ALI",
        price: 79.99,
        originalPrice: 89.99,
        discount: 11,
        quantity: 1,
        size: "One Size",
        color: "Emerald Green",
        image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        inStock: true,
        stockCount: 12,
        category: "Accessories"
      },
      {
        id: "item_3",
        productId: "prod_003",
        name: "Designer Leather Handbag",
        brand: "NABA ALI",
        price: 299.99,
        originalPrice: 299.99,
        discount: 0,
        quantity: 1,
        size: "Standard",
        color: "Black",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        inStock: false,
        stockCount: 0,
        category: "Handbags"
      },
      {
        id: "item_4",
        productId: "prod_004",
        name: "Luxury Evening Gown",
        brand: "NABA ALI",
        price: 459.99,
        originalPrice: 559.99,
        discount: 18,
        quantity: 1,
        size: "S",
        color: "Burgundy",
        image: "https://images.unsplash.com/photo-1566479179817-c0e6eaac7092?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        inStock: true,
        stockCount: 3,
        category: "Evening Wear"
      }
    ],
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
    recommendations: [
      {
        id: "rec_1",
        name: "Statement Earrings",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        category: "Jewelry"
      },
      {
        id: "rec_2",
        name: "Cashmere Cardigan",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1564257577036-9a0b1b1c6e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        category: "Knitwear"
      },
      {
        id: "rec_3",
        name: "Designer Sunglasses",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        category: "Accessories"
      },
      {
        id: "rec_4",
        name: "Luxury Watch",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        category: "Watches"
      }
    ],
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
};

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  const cartData = getCartData();
  
  return {
    title: cartData.seoData.title,
    description: cartData.seoData.description,
    keywords: cartData.seoData.keywords,
    openGraph: {
      title: cartData.seoData.title,
      description: cartData.seoData.description,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: cartData.seoData.title,
      description: cartData.seoData.description
    }
  };
}

export default function AddToCartPage() {
  // Server-side data fetching
  const cartData = getCartData();

  return (
    <main className="min-h-screen bg-gray-50">
      <AddToCartPageClient cartData={cartData} />
    </main>
  );
}
