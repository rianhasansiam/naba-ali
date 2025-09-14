import ReviewClient from './ReviewClient';

// Demo customer reviews data - In real app, this would come from a database or API
const generateCustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612bb6b?w=150&h=150&fit=crop&auto=format",
      rating: 5,
      title: "Amazing Quality!",
      comment: "I absolutely love the quality of the clothes from NABA ALI. The fabric is soft, the fit is perfect, and the designs are trendy. Will definitely shop here again!",
      product: "Premium Cotton T-Shirt",
      date: "2 days ago",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
      rating: 5,
      title: "Excellent Service",
      comment: "Fast shipping, excellent customer service, and the hoodie I ordered exceeded my expectations. The material is thick and warm, perfect for winter.",
      product: "Classic Hoodie",
      date: "1 week ago",
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format",
      rating: 4,
      title: "Great Fashion Choices",
      comment: "Love the variety of styles available. The dress I bought fits perfectly and the color is exactly as shown in the pictures. Highly recommend!",
      product: "Summer Dress",
      date: "3 days ago",
      verified: true
    },
    {
      id: 4,
      name: "David Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
      rating: 5,
      title: "Best Sneakers Ever",
      comment: "These sneakers are incredibly comfortable and stylish. I've been wearing them for months and they still look brand new. Worth every penny!",
      product: "Sport Sneakers",
      date: "5 days ago",
      verified: true
    },
    {
      id: 5,
      name: "Jessica Kim",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&auto=format",
      rating: 5,
      title: "Perfect Fit",
      comment: "Finding jeans that fit perfectly is always a challenge, but NABA ALI nailed it! The sizing guide was accurate and the quality is outstanding.",
      product: "Skinny Jeans",
      date: "1 week ago",
      verified: true
    },
    {
      id: 6,
      name: "Robert Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format",
      rating: 4,
      title: "Good Value for Money",
      comment: "Quality products at reasonable prices. The jacket I bought is well-made and looks exactly like the website photos. Will shop again soon.",
      product: "Winter Jacket",
      date: "4 days ago",
      verified: true
    },
    {
      id: 7,
      name: "Amanda Davis",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format",
      rating: 5,
      title: "Love Everything!",
      comment: "This is my go-to store for trendy clothes. Everything I've ordered has been perfect - from casual wear to formal dresses. Customer service is also top-notch!",
      product: "Office Dress",
      date: "6 days ago",
      verified: true
    },
    {
      id: 8,
      name: "James Martinez",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&auto=format",
      rating: 5,
      title: "Impressive Quality",
      comment: "The attention to detail in these clothes is remarkable. The stitching is perfect, colors are vibrant, and the fit is exactly what I expected.",
      product: "Polo Shirt",
      date: "1 week ago",
      verified: true
    }
  ];

  return reviews;
};

export default function Review() {
  const customerReviews = generateCustomerReviews();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <ReviewClient reviews={customerReviews} />
      </div>
    </section>
  );
}
