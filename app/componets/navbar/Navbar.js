// Navbar.js - Server Component (handles data)
import NavbarClient from './NavbarClient';

export default function Navbar() {
  // Navigation data (this runs on the server)
  const navItems = [
    { 
      label: 'Shop', 
      hasDropdown: true,
      href: '/allProducts',
      icon: '🛍️'
    },
    { 
      label: 'Products', 
      hasDropdown: false,
      href: '/allProducts',
      icon: ''
    },
    { 
      label: 'Contact', 
      hasDropdown: false,
      href: '/contact',
      icon: ''
    },
    { 
      label: 'About Us', 
      hasDropdown: false,
      href: '/about',
      icon: ''
    },
  ];

  const shopCategories = [
    {
      title: 'All Products',
      description: 'Browse our complete collection',
      icon: '🛍️',
      featured: true,
      href: '/allProducts'
    },
    {
      title: 'Product Details',
      description: 'View detailed product information',
      icon: '🔍',
      featured: true,
      href: '/productDetails'
    },
    {
      title: 'Men\'s Fashion',
      description: 'Shirts, pants, jackets and more',
      icon: '👔',
      featured: false,
      href: '/allProducts?category=men'
    },
    {
      title: 'Women\'s Fashion',
      description: 'Dresses, tops, accessories',
      icon: '👗',
      featured: true,
      href: '/allProducts?category=women'
    }
  ];

  return (
    <NavbarClient 
      navItems={navItems}
      shopCategories={shopCategories}
    />
  );
}