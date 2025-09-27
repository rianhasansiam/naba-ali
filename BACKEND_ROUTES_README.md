# SkyZonee - Website Routes & API Endpoints Documentation

## 📋 Project Overview
**SkyZonee** is a premium fashion e-commerce website built with **Next.js 15** using the App Router. This document provides a comprehensive list of all frontend routes and required API endpoints for backend development.

---

## 🌐 Frontend Routes (Current Implementation)

### **Public Routes**
| Route | File Location | Purpose | Auth Required |
|-------|---------------|---------|---------------|
| `/` | `app/page.js` | Homepage - Hero, Categories, Featured Products, Reviews | ❌ |
| `/about` | `app/(pages)/about/page.js` | About Us - Company story, team, achievements | ❌ |
| `/contact` | `app/(pages)/contact/page.js` | Contact Information & Form | ❌ |
| `/allProducts` | `app/(pages)/allProducts/page.js` | Product Catalog with Filters & Pagination | ❌ |
| `/productDetails` | `app/(pages)/productDetails/page.js` | Individual Product Details | ❌ |
| `/login` | `app/(pages)/login/page.js` | User Login with Google OAuth | ❌ |
| `/signup` | `app/(pages)/signup/page.js` | User Registration | ❌ |

### **Protected Routes (Authentication Required)**
| Route | File Location | Purpose | Auth Level |
|-------|---------------|---------|------------|
| `/profile` | `app/(pages)/profile/page.js` | User Profile Management | User |
| `/addToCart` | `app/(pages)/addToCart/page.js` | Shopping Cart Management | User |
| `/wishList` | `app/(pages)/wishList/page.js` | User Wishlist | User |
| `/admin` | `app/(pages)/admin/page.js` | Admin Dashboard | Admin Only |

### **Special Routes**
| Route | File Location | Purpose |
|-------|---------------|---------|
| `/404` | `app/not-found.js` | Custom 404 Error Page |
| `/error` | `app/error.js` | Custom Error Boundary Page |

### **Admin Sub-Routes (Client-Side Navigation)**
These are rendered within the admin panel using client-side routing:
- `/admin` - Dashboard (Analytics Overview)
- `/admin` - All Products Management
- `/admin` - All Users Management  
- `/admin` - Order Details Management
- `/admin` - User History
- `/admin` - All Reviews Management
- `/admin` - All Categories Management
- `/admin` - All Coupons Management

---

## 🔌 API Endpoints (Required for Backend)

### **Authentication API**
| Method | Endpoint | Purpose | Current Status |
|--------|----------|---------|---------------|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js Google OAuth | ✅ Implemented |
| `POST` | `/api/auth/signin` | Manual user signin | 🔄 Required |
| `POST` | `/api/auth/signup` | User registration | 🔄 Required |
| `POST` | `/api/auth/signout` | User logout | 🔄 Required |

### **User Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/users/profile` | Get user profile | id, name, email, phone, addresses, orders |
| `PUT` | `/api/users/profile` | Update user profile | firstName, lastName, phone, preferences |
| `GET` | `/api/users/addresses` | Get user addresses | addressId, type, street, city, state, country |
| `POST` | `/api/users/addresses` | Add new address | name, street, city, state, zipCode, country |
| `PUT` | `/api/users/addresses/:id` | Update address | Same as POST |
| `DELETE` | `/api/users/addresses/:id` | Delete address | addressId |
| `GET` | `/api/users/orders` | Get user order history | orderId, products, total, status, date |
| `GET` | `/api/users/wishlist` | Get user wishlist | productId, name, price, image |
| `POST` | `/api/users/wishlist` | Add to wishlist | productId |
| `DELETE` | `/api/users/wishlist/:id` | Remove from wishlist | productId |

### **Product Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/products` | Get all products with pagination | id, name, price, images, category, stock |
| `GET` | `/api/products/:id` | Get single product details | Full product data with variants |
| `GET` | `/api/products/categories` | Get all categories | id, name, slug, itemCount, description |
| `GET` | `/api/products/featured` | Get featured products | Same as products |
| `GET` | `/api/products/search` | Search products | query, filters, pagination |

### **Category Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/categories` | Get all categories | id, name, slug, image, itemCount, description |
| `GET` | `/api/categories/:slug` | Get category with products | category data + products array |

### **Cart Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/cart` | Get user cart | userId, items, total, subtotal |
| `POST` | `/api/cart/add` | Add item to cart | productId, quantity, variant, price |
| `PUT` | `/api/cart/update` | Update cart item | cartItemId, quantity |
| `DELETE` | `/api/cart/remove/:id` | Remove cart item | cartItemId |
| `DELETE` | `/api/cart/clear` | Clear entire cart | userId |

### **Order Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `POST` | `/api/orders` | Create new order | userId, items, shippingAddress, paymentMethod |
| `GET` | `/api/orders` | Get user orders | orderId, status, total, items, date |
| `GET` | `/api/orders/:id` | Get order details | Full order information |
| `PUT` | `/api/orders/:id/status` | Update order status | orderId, status |

### **Review Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/reviews/product/:id` | Get product reviews | productId, rating, comment, user, date |
| `POST` | `/api/reviews` | Submit product review | productId, userId, rating, comment |
| `GET` | `/api/reviews/user` | Get user reviews | userId, reviews array |

### **Contact & Support API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `POST` | `/api/contact` | Submit contact form | name, email, subject, message |
| `GET` | `/api/contact/info` | Get contact information | address, phone, email, hours |

---

## 🛡️ Admin API Endpoints

### **Admin Dashboard API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/admin/analytics` | Dashboard analytics | revenue, orders, customers, charts |
| `GET` | `/api/admin/overview` | Business overview | stats, recent activities |

### **Admin Product Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/admin/products` | Get all products for admin | Full product data with inventory |
| `POST` | `/api/admin/products` | Create new product | name, description, price, images, category |
| `PUT` | `/api/admin/products/:id` | Update product | All product fields |
| `DELETE` | `/api/admin/products/:id` | Delete product | productId |
| `PUT` | `/api/admin/products/:id/stock` | Update stock | productId, stock |

### **Admin User Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/admin/users` | Get all users | id, name, email, role, joinDate, orderCount |
| `GET` | `/api/admin/users/:id` | Get user details | Full user profile + order history |
| `PUT` | `/api/admin/users/:id/role` | Update user role | userId, role |
| `DELETE` | `/api/admin/users/:id` | Delete user | userId |

### **Admin Order Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/admin/orders` | Get all orders | orderId, customer, amount, status, date |
| `PUT` | `/api/admin/orders/:id` | Update order | orderId, status, tracking |
| `GET` | `/api/admin/orders/stats` | Order statistics | daily, weekly, monthly stats |

### **Admin Category Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/admin/categories` | Get all categories | id, name, description, productCount |
| `POST` | `/api/admin/categories` | Create category | name, description, image |
| `PUT` | `/api/admin/categories/:id` | Update category | categoryId, name, description |
| `DELETE` | `/api/admin/categories/:id` | Delete category | categoryId |

### **Admin Coupon Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/admin/coupons` | Get all coupons | code, type, value, usage, expiry |
| `POST` | `/api/admin/coupons` | Create coupon | code, type, discountValue, minOrder, expiry |
| `PUT` | `/api/admin/coupons/:id` | Update coupon | couponId, all coupon fields |
| `DELETE` | `/api/admin/coupons/:id` | Delete coupon | couponId |

### **Admin Review Management API**
| Method | Endpoint | Purpose | Data Fields |
|--------|----------|---------|-------------|
| `GET` | `/api/admin/reviews` | Get all reviews | reviewId, product, user, rating, status |
| `PUT` | `/api/admin/reviews/:id/approve` | Approve review | reviewId |
| `DELETE` | `/api/admin/reviews/:id` | Delete review | reviewId |

---

## 📊 Data Models & Schemas

### **User Model**
```javascript
{
  id: String,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  role: Enum ['user', 'admin'],
  addresses: [AddressSchema],
  paymentMethods: [PaymentMethodSchema],
  preferences: {
    newsletter: Boolean,
    orderUpdates: Boolean,
    promotions: Boolean,
    language: String
  },
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### **Product Model**
```javascript
{
  id: String,
  name: String,
  description: String,
  price: Number,
  salePrice: Number,
  images: [ImageSchema],
  category: String,
  tags: [String],
  variants: {
    colors: [ColorSchema],
    sizes: [SizeSchema]
  },
  stock: Number,
  rating: Number,
  reviewCount: Number,
  featured: Boolean,
  status: Enum ['active', 'inactive'],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### **Order Model**
```javascript
{
  id: String,
  userId: String,
  items: [OrderItemSchema],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: Enum ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  shippingAddress: AddressSchema,
  paymentMethod: PaymentMethodSchema,
  trackingNumber: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### **Category Model**
```javascript
{
  id: String,
  name: String,
  slug: String (unique),
  description: String,
  image: String,
  productCount: Number,
  status: Enum ['active', 'inactive'],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🔐 Authentication & Security

### **Authentication Flow**
1. **Google OAuth** - Primary authentication method (NextAuth.js)
2. **Manual Registration** - Email/password signup
3. **Role-based Access** - User vs Admin permissions
4. **Protected Routes** - Middleware-level protection

### **Admin Access Control**
- Admin emails whitelist: `['admin@nabaali.com', 'rianhasansiam@gmail.com']`
- Role-based permissions for admin features
- Middleware protection for `/admin/*` routes

---

## 🚀 Next Steps for Backend Development

### **Phase 1: Core APIs**
1. ✅ **Authentication Setup** - NextAuth configuration
2. 🔄 **User Management** - Profile, addresses, preferences
3. 🔄 **Product Catalog** - Products, categories, search
4. 🔄 **Cart & Orders** - Shopping cart, order processing

### **Phase 2: Advanced Features**
1. 🔄 **Admin Panel APIs** - All admin management endpoints
2. 🔄 **Review System** - Product reviews and ratings
3. 🔄 **Coupon System** - Discount codes and promotions
4. 🔄 **Analytics** - Dashboard metrics and reporting

### **Phase 3: Optimization**
1. 🔄 **Payment Integration** - Stripe/PayPal integration
2. 🔄 **Email Notifications** - Order confirmations, updates
3. 🔄 **Search & Filters** - Advanced product filtering
4. 🔄 **Performance** - Caching, optimization

---

## 📝 Notes for Backend Team

### **Technology Stack Recommendations**
- **Database**: MongoDB or PostgreSQL
- **API Framework**: Express.js or Fastify
- **Authentication**: JWT tokens with NextAuth.js
- **File Storage**: AWS S3 or Cloudinary for images
- **Payment**: Stripe or PayPal
- **Email**: SendGrid or Nodemailer

### **Important Considerations**
1. **CORS Configuration** - Allow Next.js frontend domain
2. **Rate Limiting** - Implement API rate limiting
3. **Input Validation** - Validate all incoming data
4. **Error Handling** - Consistent error response format
5. **Pagination** - Implement for large datasets
6. **Image Upload** - Handle product image uploads
7. **Search** - Implement full-text search for products

### **Current Frontend Data Structure**
- Products use mock data with Unsplash images
- All components expect specific data formats
- Admin panel has predefined analytics structure
- User profiles have sample address/payment data

---

**Status**: 🟡 Frontend Complete - Backend Development Required
**Updated**: September 18, 2025
**Version**: 1.0.0