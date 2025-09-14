import CategoryClient from './CategoryClient';

// Demo categories data - In real app, this would come from a database or API
const generateCategories = () => {
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
    },
    {
      id: 7,
      name: "Shorts",
      slug: "shorts",
      image: "https://images.unsplash.com/photo-1506629905607-53e103a0265d?w=500&h=500&fit=crop&auto=format",
      itemCount: 152,
      description: "Summer essentials"
    },
    {
      id: 8,
      name: "Accessories",
      slug: "accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&auto=format",
      itemCount: 312,
      description: "Complete your look"
    },
    {
      id: 9,
      name: "Bags",
      slug: "bags",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&auto=format",
      itemCount: 89,
      description: "Stylish carry options"
    },
    {
      id: 10,
      name: "Watches",
      slug: "watches",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop&auto=format",
      itemCount: 76,
      description: "Timeless accessories"
    }
  ];

  return categories;
};

export default function Category() {
  const categories = generateCategories();

  return (
    <section className="pt-16  bg-gray-50">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <CategoryClient categories={categories} />
      </div>
    </section>
  );
}
