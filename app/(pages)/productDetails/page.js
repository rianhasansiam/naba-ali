import ProductDetailsClient from './ProductDetailsClient';

export const metadata = {
  title: 'Premium Cotton T-Shirt - NABA ALI | High Quality Fashion',
  description: 'Discover our premium cotton t-shirt crafted with the finest materials. Perfect fit, exceptional comfort, and timeless style from NABA ALI.',
  keywords: 'premium t-shirt, cotton fashion, NABA ALI, quality clothing, comfortable wear',
};

// Generate comprehensive product data - In real app, this would come from a database or API
const generateProductData = () => {
  const product = {
    id: 1,
    name: "Premium Cotton T-Shirt",
    brand: "NABA ALI",
    category: "T-Shirts",
    subcategory: "Casual Wear",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    rating: 4.8,
    totalReviews: 324,
    inStock: true,
    stockCount: 45,
    sku: "NABA-TS-001",
    description: "Crafted from 100% premium organic cotton, this t-shirt offers unparalleled comfort and style. The perfect addition to your wardrobe, featuring a modern fit and exceptional durability.",
    features: [
      "100% Organic Cotton",
      "Pre-shrunk for perfect fit",
      "Reinforced collar and seams",
      "Machine washable",
      "Breathable fabric",
      "Eco-friendly production"
    ],
    specifications: {
      material: "100% Organic Cotton",
      weight: "180 GSM",
      fit: "Regular Fit",
      care: "Machine wash cold, tumble dry low",
      origin: "Made in Bangladesh",
      sustainability: "GOTS Certified Organic"
    },
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        alt: "Premium Cotton T-Shirt - Front View",
        type: "main"
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1583743814966-8936f37f26db?w=800",
        alt: "Premium Cotton T-Shirt - Back View",
        type: "back"
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800",
        alt: "Premium Cotton T-Shirt - Side View",
        type: "side"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800",
        alt: "Premium Cotton T-Shirt - Detail",
        type: "detail"
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800",
        alt: "Premium Cotton T-Shirt - Lifestyle",
        type: "lifestyle"
      }
    ],
    colors: [
      { name: "Black", value: "#000000", available: true },
      { name: "White", value: "#FFFFFF", available: true },
      { name: "Navy", value: "#1a237e", available: true },
      { name: "Gray", value: "#6B7280", available: true },
      { name: "Olive", value: "#6B8E23", available: false }
    ],
    sizes: [
      { name: "XS", available: true, measurements: { chest: 32, length: 26 } },
      { name: "S", available: true, measurements: { chest: 36, length: 27 } },
      { name: "M", available: true, measurements: { chest: 40, length: 28 } },
      { name: "L", available: true, measurements: { chest: 44, length: 29 } },
      { name: "XL", available: true, measurements: { chest: 48, length: 30 } },
      { name: "XXL", available: false, measurements: { chest: 52, length: 31 } }
    ],
    tags: ["Casual", "Comfortable", "Organic", "Breathable", "Durable"],
    isNew: false,
    isBestseller: true,
    isEcoFriendly: true
  };

  const reviews = [
    {
      id: 1,
      userName: "Sarah Johnson",
      userImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      rating: 5,
      date: "2025-09-10",
      title: "Excellent quality and comfort!",
      comment: "This t-shirt exceeded my expectations. The fabric is incredibly soft and the fit is perfect. I've washed it multiple times and it still looks brand new.",
      verified: true,
      helpful: 24,
      size: "M",
      color: "Black"
    },
    {
      id: 2,
      userName: "Michael Chen",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 4,
      date: "2025-09-08",
      title: "Great value for money",
      comment: "Really happy with this purchase. The cotton is high quality and the design is simple yet elegant. Would definitely buy again.",
      verified: true,
      helpful: 18,
      size: "L",
      color: "White"
    },
    {
      id: 3,
      userName: "Emma Wilson",
      userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      rating: 5,
      date: "2025-09-05",
      title: "Perfect for everyday wear",
      comment: "Love the organic cotton material. It's breathable and comfortable for all-day wear. The fit is true to size.",
      verified: true,
      helpful: 31,
      size: "S",
      color: "Navy"
    },
    {
      id: 4,
      userName: "David Rodriguez",
      userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      rating: 4,
      date: "2025-09-03",
      title: "Good quality basics",
      comment: "Solid t-shirt with good construction. The seams are well-made and the collar holds its shape well after washing.",
      verified: false,
      helpful: 12,
      size: "XL",
      color: "Gray"
    }
  ];

  const relatedProducts = [
    {
      id: 2,
      name: "Classic Polo Shirt",
      price: 69.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
      rating: 4.6,
      reviews: 156,
      isOnSale: true
    },
    {
      id: 3,
      name: "Premium Hoodie",
      price: 129.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      rating: 4.9,
      reviews: 89,
      isOnSale: false
    },
    {
      id: 4,
      name: "Casual Button Shirt",
      price: 95.99,
      originalPrice: 125.99,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
      rating: 4.5,
      reviews: 234,
      isOnSale: true
    },
    {
      id: 5,
      name: "Luxury Cardigan",
      price: 189.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
      rating: 4.7,
      reviews: 67,
      isOnSale: false
    }
  ];

  const sizeGuide = {
    title: "Size Guide",
    unit: "inches",
    headers: ["Size", "Chest", "Length", "Sleeve"],
    measurements: [
      { size: "XS", chest: "32-34", length: "26", sleeve: "8" },
      { size: "S", chest: "36-38", length: "27", sleeve: "8.5" },
      { size: "M", chest: "40-42", length: "28", sleeve: "9" },
      { size: "L", chest: "44-46", length: "29", sleeve: "9.5" },
      { size: "XL", chest: "48-50", length: "30", sleeve: "10" },
      { size: "XXL", chest: "52-54", length: "31", sleeve: "10.5" }
    ]
  };

  return {
    product,
    reviews,
    relatedProducts,
    sizeGuide
  };
};

export default function ProductDetailsPage() {
  const data = generateProductData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <ProductDetailsClient productData={data} />
      </div>
    </div>
  );
}
