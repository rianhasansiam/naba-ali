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
      label: 'All Products', 
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
     { 
      label: 'Admin', 
      hasDropdown: false,
      href: '/admin',
      icon: ''
    },
  ];

  // Shop categories will be loaded dynamically in NavbarClient
  // This provides default fallback categories
  const defaultShopCategories = [
    {
      name: 'All Products',
      description: 'Browse our complete collection',
      icon: '🛍️',
      count: 0,
      href: '/allProducts'
    },
    {
      name: 'New Arrivals',
      description: 'Latest fashion trends',
      icon: '✨',
      count: 0,
      href: '/allProducts?sort=newest'
    },
    {
      name: 'Sale Items',
      description: 'Great deals and discounts',
      icon: '🏷️',
      count: 0,
      href: '/allProducts?sale=true'
    },
    {
      name: 'Popular',
      description: 'Trending products',
      icon: '�',
      count: 0,
      href: '/allProducts?sort=popular'
    }
  ];

  return (
    <NavbarClient 
      navItems={navItems}
      defaultShopCategories={defaultShopCategories}
    />
  );
}