# Data Schema Reference

This project uses MongoDB directly through the native `mongodb` driver. There is no Prisma, Mongoose, or Drizzle schema file. Data shapes are defined across API routes, Zod validators, normalizer helpers, and a few frontend form/state files.

## Main Sources

- Mongo connection helper: `lib/mongodb.js`
- API input validators: `lib/validators.js`
- Chat schema notes: `lib/data/chatSchema.js`
- API response normalizers: `lib/data/dataSchemas.js`
- Recommended indexes: `lib/mongodb-indexes.js`
- Document write paths: `app/api/**/route.js`

## MongoDB Collections

### `users`

Used by custom auth routes and NextAuth.

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,          // credentials users only
  image: String | null,
  phone: String | null,
  role: "user" | "admin" | String,
  provider: "credentials" | "google" | String,
  profileData: Object,       // OAuth profile metadata
  emailVerified: Date | null,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### `allProducts`

```js
{
  _id: ObjectId,
  name: String,
  category: String,
  style: String,
  price: Number,
  originalPrice: Number | null,
  stock: Number,
  shortDescription: String,
  description: String,
  images: String[],
  image: String,             // backward-compatible primary image
  colors: String[],
  color: String,             // backward-compatible primary color
  sizes: String[],
  createdAt: Date,
  updatedAt: Date
}
```

### `allCategories`

```js
{
  _id: ObjectId,
  name: String,
  description: String,
  image: String,
  status: "active" | "inactive" | String,
  productCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### `allOrders`

```js
{
  _id: ObjectId,
  orderId: String,
  orderDate: String,
  userId: String | null,
  userEmail: String,
  userName: String,
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      address: String,
      city: String,
      zipCode: String,
      country: String
    }
  },
  shippingAddress: {
    fullName: String,
    email: String | null,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  items: [
    {
      productId: String,
      name: String,
      productName: String,
      price: Number,
      quantity: Number,
      size: String | null,
      color: String | null,
      image: String | null,
      subtotal: Number
    }
  ],
  paymentMethod: "cash_on_delivery" | "stripe" | "paypal",
  paymentMethodName: String,
  couponCode: String | null,
  subtotal: Number,
  shipping: Number,
  tax: Number,
  discount: Number,
  total: Number,
  totalAmount: Number,
  totalPrice: Number,
  orderSummary: {
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: Number,
    total: Number,
    taxName: String
  },
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
  paymentStatus: "pending" | "paid" | "completed" | "failed" | "refunded" | "cancelled",
  deliveryStatus: String,
  trackingNumber: String | null,
  adminNote: String | null,
  isPaid: Boolean,
  isDelivered: Boolean,
  paidAt: Date | null,
  deliveredAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

### `allReviews`

```js
{
  _id: ObjectId,
  productId: String,
  productName: String | null,
  rating: Number,
  title: String | null,
  comment: String,
  photo: String | null,
  userId: String,
  userName: String,
  userEmail: String,
  customerName: String,
  customerEmail: String,
  isApproved: Boolean,
  status: "pending" | "approved" | String,
  verified: Boolean,
  helpful: Number,
  date: String,
  createdAt: Date,
  updatedAt: Date
}
```

### `allCarts`

```js
{
  _id: ObjectId,
  userId: String,
  userEmail: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String | null,
      size: String | null,
      color: String | null
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### `allCoupons`

```js
{
  _id: ObjectId,
  code: String,
  discount: Number,
  type: "percentage" | "fixed",
  description: String,
  minAmount: Number,
  usageLimit: Number,
  used: Number,
  startDate: String,
  endDate: String,
  status: "active" | "disabled" | String,
  createdAt: Date,
  updatedAt: Date
}
```

### `allContacts`

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  phone: String | null,
  status: "read" | "unread",
  createdAt: Date,
  updatedAt: Date
}
```

### `shippingTaxSettings`

Single-document settings collection.

```js
{
  _id: "shipping_tax_settings",
  shippingSettings: {
    shippingCharge: Number,
    enabled: Boolean
  },
  taxSettings: {
    taxRate: Number,
    enabled: Boolean,
    taxName: String
  },
  lastUpdated: Date
}
```

### `chatMessages`

```js
{
  _id: ObjectId,
  conversationId: String,
  clientMessageId: String,
  senderId: String,
  senderName: String,
  senderRole: "admin" | "user",
  message: String,
  attachments: [
    {
      type: "image" | "file",
      filename: String,
      url: String,
      size: Number,
      mimetype: String,
      width: Number,
      height: Number
    }
  ],
  timestamp: Date,
  isRead: Boolean
}
```

### `chatConversations`

```js
{
  _id: ObjectId,
  userId: String,
  userName: String,
  userEmail: String,
  isGuest: Boolean,
  guestTokenHash: String,
  lastMessage: String,
  lastMessageTime: Date,
  unreadCount: Number,
  createdAt: Date,
  expiresAt: Date | null
}
```

## Zod Validation Schemas

Defined in `lib/validators.js`.

- `signupSchema`
- `loginSchema`
- `contactSchema`
- `cartItemSchema`
- `cartSchema`
- `orderItemSchema`
- `shippingAddressSchema`
- `orderSchema`
- `reviewSchema`
- `chatAttachmentSchema`
- `chatMessageSchema`
- `conversationSchema`
- `orderStatusSchema`

## API Response Normalizers

Defined in `lib/data/dataSchemas.js`.

- `normalizeProduct`
- `normalizeOrder`
- `normalizeReview`
- `normalizeCoupon`
- `normalizeCategory`
- `normalizeUser`
- `normalizeProducts`
- `normalizeOrders`
- `normalizeReviews`
- `normalizeCoupons`
- `normalizeCategories`
- `normalizeUsers`

## Frontend Local State Shapes

These are not MongoDB collections, but they are structured application data.

### Redux cart state

Defined in `app/redux/slice.js`.

```js
{
  cart: {
    items: [
      {
        id: String,
        name: String,
        price: Number,
        image: String,
        quantity: Number,
        size: String,
        color: String,
        stock: Number
      }
    ],
    totalQuantity: Number,
    totalAmount: Number
  }
}
```

### Redux wishlist state

```js
{
  wishlist: {
    items: [
      {
        id: String,
        name: String,
        price: Number,
        image: String,
        addedAt: String
      }
    ],
    totalItems: Number
  }
}
```

### Filter UI state

Defined in `store/slices/filterSlice.js`.

```js
{
  selectedCategory: String,
  sortBy: "newest" | "price-asc" | "price-desc" | "rating",
  searchQuery: String,
  priceRange: { min: Number, max: Number },
  inStockOnly: Boolean
}
```

### Modal UI state

Defined in `store/slices/modalSlice.js`.

```js
{
  loginModalOpen: Boolean,
  productQuickViewOpen: Boolean,
  selectedProductId: String | null,
  deleteConfirmOpen: Boolean,
  deleteTargetId: String | null,
  deleteTargetType: "product" | "category" | "review" | "order" | null
}
```

### General UI state

Defined in `store/slices/uiSlice.js`.

```js
{
  sidebarOpen: Boolean,
  cartDrawerOpen: Boolean,
  mobileMenuOpen: Boolean,
  theme: "light" | "dark",
  activeModal: String | null,
  toasts: [
    {
      id: String,
      type: "info" | "success" | "error" | "warning",
      message: String,
      duration: Number
    }
  ]
}
```

## Index Notes

`lib/mongodb-indexes.js` defines recommended indexes for:

- `allProducts`
- `allCategories`
- `allUsers`
- `allOrders`
- `allReviews`
- `allCarts`
- `allCoupons`

Important mismatch: active user code writes to `users`, but the index helper references `allUsers`. The index helper also references older-style fields such as `isActive`, `orderStatus`, and `expiryDate`, while the current app mostly uses `status`, `paymentStatus`, `startDate`, and `endDate`.

## Recommended Cleanup

- Align `lib/mongodb-indexes.js` with active collection names and fields.
- Add strict Zod schemas for product, category, and coupon create/update routes.
- Avoid raw `...body` writes in admin routes where possible.
- Add database-level unique indexes for `users.email`, `allCategories.name`, `allCoupons.code`, and chat message idempotency keys.
