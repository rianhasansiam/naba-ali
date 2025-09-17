// Category.js - Server Component (handles data)
import CategoryClient from './CategoryClient';

export default function Category() {
  // Categories data (this runs on the server)
  const categories = [
    {
      id: 1,
      name: "T-Shirts",
      slug: "t-shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format",
      itemCount: 245,
      description: "Comfortable cotton tees"
    },
    {
      id: 2,
      name: "Hoodies",
      slug: "hoodies",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&auto=format",
      itemCount: 128,
      description: "Cozy winter essentials"
    },
    {
      id: 3,
      name: "Jeans",
      slug: "jeans",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&auto=format",
      itemCount: 186,
      description: "Premium denim collection"
    },
    {
      id: 4,
      name: "Sneakers",
      slug: "sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&auto=format",
      itemCount: 167,
      description: "Trendy footwear"
    },
    {
      id: 5,
      name: "Dresses",
      slug: "dresses",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop&auto=format",
      itemCount: 203,
      description: "Elegant fashion pieces"
    },
    {
      id: 6,
      name: "Jackets",
      slug: "jackets",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop&auto=format",
      itemCount: 94,
      description: "Stylish outerwear"
    }
  ];

  return (
    <section className="pt-16 bg-gray-50">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <CategoryClient categories={categories} />
      </div>
    </section>
  );
}
