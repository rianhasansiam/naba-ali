// Server component - main Navbar entry point
import NavbarClient from './NavbarClient';

// Static navigation data (server-side)
const navItems = [
  { 
    label: 'Shop', 
    hasDropdown: true,
    href: '/shop',
    icon: '🛍️'
  },
  { 
    label: 'On Sale', 
    hasDropdown: false,
    href: '/sale',
    badge: 'HOT',
    icon: '🔥'
  },
  { 
    label: 'New Arrivals', 
    hasDropdown: false,
    href: '/new-arrivals',
    badge: 'NEW',
    icon: '✨'
  },
  { 
    label: 'Brands', 
    hasDropdown: false,
    href: '/brands',
    icon: '🏷️'
  },
];

const shopCategories = [
  {
    title: 'Men\'s Fashion',
    description: 'Shirts, pants, jackets and more',
    icon: '👔',
    featured: true,
    href: '/men'
  },
  {
    title: 'Women\'s Fashion',
    description: 'Dresses, tops, accessories',
    icon: '👗',
    featured: true,
    href: '/women'
  },
  {
    title: 'Kids & Baby',
    description: 'Clothes for little ones',
    icon: '👶',
    featured: false,
    href: '/kids'
  },
  {
    title: 'Footwear',
    description: 'Sneakers, boots, sandals',
    icon: '👟',
    featured: true,
    href: '/shoes'
  },
  {
    title: 'Accessories',
    description: 'Bags, watches, jewelry',
    icon: '💼',
    featured: false,
    href: '/accessories'
  },
  {
    title: 'Sports & Outdoors',
    description: 'Athletic wear and gear',
    icon: '⚽',
    featured: true,
    href: '/sports'
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