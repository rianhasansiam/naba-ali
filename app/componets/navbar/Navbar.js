// Server component - main Navbar entry point
import NavbarClient from './NavbarClient';

// Static navigation data (server-side)
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
    badge: '',
    icon: ''
  },
  { 
    label: 'Contact', 
    hasDropdown: false,
    href: '/contact',
    badge: '',
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
  },
  {
    title: 'Footwear',
    description: 'Sneakers, boots, sandals',
    icon: '👟',
    featured: true,
    href: '/allProducts?category=shoes'
  },
  {
    title: 'Accessories',
    description: 'Bags, watches, jewelry',
    icon: '💼',
    featured: false,
    href: '/allProducts?category=accessories'
  }
];

const Navbar = () => {
  return (
    <NavbarClient 
      navItems={navItems}
      shopCategories={shopCategories}
      cartItems={3}
      wishlistItems={5}
      notifications={2}
    />
  );
};

export default Navbar;