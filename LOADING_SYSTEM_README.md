# Loading System Documentation

## Overview

This comprehensive loading system provides beautiful, animated loading states throughout the NABA ALI e-commerce website. The system includes global loading pages, component-level loading states, skeleton loaders, and contextual loading management.

## Components

### 1. LoadingSpinner
**Location:** `app/componets/loading/LoadingSpinner.js`

A flexible spinner component with multiple variants and sizes.

```javascript
import LoadingSpinner from '@/app/componets/loading/LoadingSpinner';

// Usage examples
<LoadingSpinner size="md" variant="spin" />
<LoadingSpinner size="lg" variant="dots" />
<LoadingSpinner size="sm" variant="pulse" />
```

**Props:**
- `size`: 'sm', 'md', 'lg', 'xl' (default: 'md')
- `color`: 'primary', 'secondary', 'success', 'warning', 'danger', 'white' (default: 'primary')
- `variant`: 'spin', 'dots', 'pulse' (default: 'spin')
- `className`: Additional CSS classes

### 2. GlobalLoadingPage
**Location:** `app/componets/loading/GlobalLoadingPage.js`

Full-screen loading page with logo, animations, and branded styling.

```javascript
import GlobalLoadingPage from '@/app/componets/loading/GlobalLoadingPage';

// Usage examples
<GlobalLoadingPage message="Loading..." />
<GlobalLoadingPage message="Processing..." variant="minimal" />
```

**Props:**
- `message`: Loading message text (default: 'Loading...')
- `showLogo`: Show NABA ALI logo (default: true)
- `variant`: 'default', 'minimal' (default: 'default')

### 3. Skeleton Loaders
**Location:** `app/componets/loading/SkeletonLoaders.js`

Skeleton loading components for different content types.

```javascript
import { 
  ProductCardSkeleton, 
  ProductGridSkeleton, 
  CategorySkeleton,
  CategoriesSkeleton,
  TextSkeleton 
} from '@/app/componets/loading/SkeletonLoaders';

// Usage examples
<ProductGridSkeleton count={8} />
<CategoriesSkeleton count={6} />
<TextSkeleton lines={3} />
```

## Context & Providers

### LoadingProvider
**Location:** `lib/LoadingProvider.js`

Global loading state management with React Context.

```javascript
import { LoadingProvider, useLoading } from '@/lib/LoadingProvider';

// In your layout or app root
<LoadingProvider>
  <App />
</LoadingProvider>

// In any component
const { showLoading, hideLoading, updateLoadingMessage } = useLoading();
```

### Custom Hooks
**Location:** `lib/hooks/useLoadingHooks.js`

Convenient hooks for different loading scenarios.

```javascript
import { useLoadingState, useApiLoading, useNavigationLoading } from '@/lib/hooks/useLoadingHooks';

// Basic loading state
const { showLoading, hideLoading } = useLoadingState();

// API loading wrapper
const { withLoading } = useApiLoading();
const result = await withLoading(apiCall, 'Fetching data...');

// Navigation loading
const { showNavigationLoading, hideNavigationLoading } = useNavigationLoading();
showNavigationLoading('Products');
```

## Implementation Examples

### Page-Level Loading (Next.js)
Create `loading.js` files in route segments:

```javascript
// app/(pages)/products/loading.js
import GlobalLoadingPage from '../../componets/loading/GlobalLoadingPage';

export default function Loading() {
  return <GlobalLoadingPage message="Loading products..." />;
}
```

### Component Loading States
Enhanced components with loading support:

```javascript
// ProductCard with loading
import ProductCardWithLoading from '@/app/componets/shared/ProductCardWithLoading';

<ProductCardWithLoading 
  product={product} 
  isLoading={isLoading}
  onProductClick={handleClick}
/>

// Manual loading control
const { showLoading, hideLoading } = useLoadingState();

const handleSubmit = async () => {
  showLoading('Processing your request...');
  try {
    await submitForm();
  } finally {
    hideLoading();
  }
};
```

### API Integration
Loading states with data fetching:

```javascript
import { useGetData } from '@/lib/hooks/useGetData';
import { ProductGridSkeleton } from '@/app/componets/loading/SkeletonLoaders';

const ProductsPage = () => {
  const { data, isLoading, error } = useGetData({ 
    name: "products", 
    api: "/api/products" 
  });

  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  return <ProductGrid products={data} />;
};
```

## Features

### 🎨 **Beautiful Animations**
- Framer Motion powered animations
- Smooth transitions and micro-interactions
- Brand-consistent styling

### 📱 **Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### ⚡ **Performance Optimized**
- Lazy loading support
- Memoized components
- Efficient re-render prevention

### 🎯 **Contextual Loading**
- Different loading messages for different actions
- Progressive loading states
- Smart loading state management

### 🔧 **Developer Friendly**
- TypeScript support ready
- Comprehensive documentation
- Easy integration

## Integration Status

### ✅ **Implemented:**
- Global loading pages for all major routes
- Skeleton loaders for product grids and categories
- Enhanced navbar with category loading states
- Login/signup form loading states
- ProductCard loading overlays
- Loading context provider system

### 🎯 **Usage Locations:**
- **Layout:** Integrated LoadingProvider in root layout
- **Pages:** Loading components for all major routes
- **Components:** Enhanced ProductCard, Navbar, forms
- **API Integration:** Skeleton loaders during data fetching

## Customization

### Theming
Modify colors and styles in the component files:
```css
/* Custom loading colors */
.loading-primary { @apply border-blue-600; }
.loading-secondary { @apply border-gray-600; }
```

### Adding New Loading States
1. Create new skeleton components in `SkeletonLoaders.js`
2. Add loading variants to existing components
3. Extend the LoadingProvider with new states

### Brand Customization
Update the GlobalLoadingPage component:
- Replace logo/branding elements
- Modify color schemes
- Adjust animation timings

## Best Practices

1. **Use appropriate loading types:**
   - Global loading for page transitions
   - Skeleton loaders for content loading
   - Spinner overlays for form submissions

2. **Provide meaningful messages:**
   - "Loading products..." vs generic "Loading..."
   - Context-specific messaging

3. **Handle error states:**
   - Always provide fallback UI
   - Clear error messaging
   - Retry mechanisms

4. **Performance considerations:**
   - Use skeleton loaders for perceived performance
   - Avoid blocking the entire UI unnecessarily
   - Clean up loading states properly

## Browser Support

- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports reduced motion preferences
- Graceful fallbacks for older browsers