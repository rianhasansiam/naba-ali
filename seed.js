require("dotenv").config({ path: ".env" });

const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI or DATABASE_URL in .env");
}

if (process.env.NODE_ENV === "production") {
  throw new Error("Seed script blocked in production environment.");
}

const now = new Date();

const SEED_EMAIL_DOMAIN = "seed.skyzonee.com";

const CATEGORY_NAMES = [
  "RC Cars",
  "Diecast Cars",
  "Sports Cars",
  "Formula Cars",
  "Off-Road Trucks",
  "Police & Emergency",
];

const COUPON_CODES = ["WELCOME10", "TOYCAR200", "F1RACE15", "OLDDEAL"];

const REAL_IMAGES = {
  users: [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  ],

  categories: {
    "RC Cars":
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop",
    "Diecast Cars":
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop",
    "Sports Cars":
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop",
    "Formula Cars":
      "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=900&h=600&fit=crop",
    "Off-Road Trucks":
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop",
    "Police & Emergency":
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=900&h=600&fit=crop",
  },

  products: [
    [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=900&fit=crop",
    ],
    [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=900&fit=crop",
    ],
    [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=900&h=900&fit=crop",
    ],
    [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=900&h=900&fit=crop",
    ],
    [
      "https://images.unsplash.com/photo-1555353540-64580b51c258?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=900&h=900&fit=crop",
    ],
    [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=900&h=900&fit=crop",
    ],
    [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=900&h=900&fit=crop",
    ],
    [
      "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=900&h=900&fit=crop",
    ],
  ],

  reviews: [
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=700&h=700&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&h=700&fit=crop",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700&h=700&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=700&h=700&fit=crop",
  ],
};

function getUserImage(index) {
  return REAL_IMAGES.users[index % REAL_IMAGES.users.length];
}

function getCategoryImage(categoryName) {
  return REAL_IMAGES.categories[categoryName] || REAL_IMAGES.categories["RC Cars"];
}

function getProductImages(index) {
  return REAL_IMAGES.products[index % REAL_IMAGES.products.length];
}

function getReviewImage(index) {
  return REAL_IMAGES.reviews[index % REAL_IMAGES.reviews.length];
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getDateString(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}

function getOrderId(index) {
  return `ORD-SEED-${Date.now()}-${String(index + 1).padStart(4, "0")}`;
}

async function cleanSeedData(collections) {
  await Promise.all([
    collections.users.deleteMany({
      email: { $regex: `@${SEED_EMAIL_DOMAIN}$` },
    }),

    collections.products.deleteMany({
      $or: [
        { seeded: true },
        {
          name: {
            $in: [
              "Lamborghini RC Car",
              "Bugatti RC Hyper Car",
              "Mercedes G-Wagon RC",
              "BMW M4 RC Drift Car",
              "Nissan GTR Smoke RC Car",
              "Ferrari Diecast Model",
              "Mercedes Benz Diecast",
              "Toyota Supra Diecast",
              "Audi R8 Diecast",
              "Porsche 911 Diecast",
              "Ferrari F1 Racing Car",
              "Mercedes F1 Racing Car",
              "McLaren Super Car",
              "Mustang GT Sports Car",
              "Nissan GTR Special Edition",
              "Red Formula Speedster",
              "Blue Formula Racer",
              "Black Formula Champion",
              "Silver Formula Pro",
              "Monster Off-Road Truck",
              "Military Jeep RC",
              "Rock Crawler 4x4",
              "Desert Rally Truck",
              "Police Patrol Car",
              "Fire Rescue Truck",
              "Ambulance Toy Van",
            ],
          },
        },
      ],
    }),

    collections.categories.deleteMany({
      $or: [{ seeded: true }, { name: { $in: CATEGORY_NAMES } }],
    }),

    collections.orders.deleteMany({
      $or: [{ seeded: true }, { orderId: { $regex: "^ORD-SEED-" } }],
    }),

    collections.reviews.deleteMany({ seeded: true }),
    collections.carts.deleteMany({ seeded: true }),

    collections.coupons.deleteMany({
      $or: [{ seeded: true }, { code: { $in: COUPON_CODES } }],
    }),

    collections.contacts.deleteMany({ seeded: true }),
    collections.chatMessages.deleteMany({ seeded: true }),
    collections.chatConversations.deleteMany({ seeded: true }),
    collections.settings.deleteOne({ _id: "shipping_tax_settings" }),
  ]);
}

async function createUsefulIndexes(collections) {
  await Promise.all([
    collections.users.createIndex({ email: 1 }, { unique: true }),

    collections.products.createIndex({ name: "text", category: 1 }),
    collections.products.createIndex({ category: 1 }),
    collections.products.createIndex({ price: 1 }),
    collections.products.createIndex({ stock: 1 }),

    collections.categories.createIndex({ name: 1 }, { unique: true }),
    collections.categories.createIndex({ status: 1 }),

    collections.orders.createIndex({ orderId: 1 }, { unique: true }),
    collections.orders.createIndex({ userId: 1 }),
    collections.orders.createIndex({ userEmail: 1 }),
    collections.orders.createIndex({ status: 1 }),
    collections.orders.createIndex({ paymentStatus: 1 }),
    collections.orders.createIndex({ createdAt: -1 }),

    collections.reviews.createIndex({ productId: 1 }),
    collections.reviews.createIndex({ userId: 1 }),
    collections.reviews.createIndex({ status: 1 }),
    collections.reviews.createIndex({ isApproved: 1 }),

    collections.carts.createIndex({ userId: 1 }, { unique: true }),

    collections.coupons.createIndex({ code: 1 }, { unique: true }),
    collections.coupons.createIndex({ status: 1 }),

    collections.contacts.createIndex({ status: 1 }),
    collections.contacts.createIndex({ createdAt: -1 }),

    collections.chatConversations.createIndex({ userId: 1 }),
    collections.chatConversations.createIndex({ lastMessageTime: -1 }),

    collections.chatMessages.createIndex({ conversationId: 1 }),
    collections.chatMessages.createIndex(
      { conversationId: 1, clientMessageId: 1 },
      {
        unique: true,
        partialFilterExpression: {
          clientMessageId: { $type: "string" },
        },
      }
    ),
  ]);
}

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    const db = MONGODB_DB ? client.db(MONGODB_DB) : client.db();

    const collections = {
      users: db.collection("users"),
      products: db.collection("allProducts"),
      categories: db.collection("allCategories"),
      orders: db.collection("allOrders"),
      reviews: db.collection("allReviews"),
      carts: db.collection("allCarts"),
      coupons: db.collection("allCoupons"),
      contacts: db.collection("allContacts"),
      settings: db.collection("shippingTaxSettings"),
      chatMessages: db.collection("chatMessages"),
      chatConversations: db.collection("chatConversations"),
    };

    console.log("Connected to MongoDB");
    console.log("Cleaning previous seed data...");

    await cleanSeedData(collections);

    const hashedPassword = await bcrypt.hash("12345678", 10);

    const users = [
      {
        _id: new ObjectId(),
        name: "Admin User",
        email: `admin@${SEED_EMAIL_DOMAIN}`,
        password: hashedPassword,
        image: getUserImage(0),
        phone: "+8801700000001",
        role: "admin",
        provider: "credentials",
        profileData: {},
        emailVerified: now,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      },
      {
        _id: new ObjectId(),
        name: "Rafi Ahmed",
        email: `rafi@${SEED_EMAIL_DOMAIN}`,
        password: hashedPassword,
        image: getUserImage(1),
        phone: "+8801700000002",
        role: "user",
        provider: "credentials",
        profileData: {},
        emailVerified: now,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      },
      {
        _id: new ObjectId(),
        name: "Nadia Islam",
        email: `nadia@${SEED_EMAIL_DOMAIN}`,
        password: hashedPassword,
        image: getUserImage(2),
        phone: "+8801700000003",
        role: "user",
        provider: "credentials",
        profileData: {},
        emailVerified: now,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      },
      {
        _id: new ObjectId(),
        name: "Siam Hasan",
        email: `siam@${SEED_EMAIL_DOMAIN}`,
        password: hashedPassword,
        image: getUserImage(3),
        phone: "+8801700000004",
        role: "user",
        provider: "credentials",
        profileData: {},
        emailVerified: now,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      },
      {
        _id: new ObjectId(),
        name: "Google Demo User",
        email: `googleuser@${SEED_EMAIL_DOMAIN}`,
        password: "",
        image: getUserImage(4),
        phone: null,
        role: "user",
        provider: "google",
        profileData: {
          providerId: "google-seed-user-001",
          locale: "en",
        },
        emailVerified: now,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      },
    ];

    const categories = [
      {
        _id: new ObjectId(),
        name: "RC Cars",
        description:
          "Remote control cars with lights, sounds, opening parts, and realistic movement.",
        image: getCategoryImage("RC Cars"),
        status: "active",
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Diecast Cars",
        description:
          "Premium collectible diecast model cars for display, gifting, and kids.",
        image: getCategoryImage("Diecast Cars"),
        status: "active",
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Sports Cars",
        description:
          "Stylish sports car toys inspired by supercars, hypercars, and street legends.",
        image: getCategoryImage("Sports Cars"),
        status: "active",
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Formula Cars",
        description:
          "Formula racing cars with low body design, racing decals, and premium details.",
        image: getCategoryImage("Formula Cars"),
        status: "active",
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Off-Road Trucks",
        description:
          "Strong off-road toy trucks for rough play, outdoor tracks, and adventure fun.",
        image: getCategoryImage("Off-Road Trucks"),
        status: "active",
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Police & Emergency",
        description:
          "Police cars, fire trucks, ambulances, and emergency vehicle toys.",
        image: getCategoryImage("Police & Emergency"),
        status: "active",
        productCount: 0,
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
    ];

    const productBlueprints = [
      ["RC Cars", "Lamborghini RC Car", "Remote Control", 2490, 2990],
      ["RC Cars", "Bugatti RC Hyper Car", "Remote Control", 2890, 3490],
      ["RC Cars", "Mercedes G-Wagon RC", "Remote Control", 3190, 3790],
      ["RC Cars", "BMW M4 RC Drift Car", "Drift", 2690, 3290],
      ["RC Cars", "Nissan GTR Smoke RC Car", "Smoke Feature", 3490, 4190],

      ["Diecast Cars", "Ferrari Diecast Model", "Collector", 1290, 1590],
      ["Diecast Cars", "Mercedes Benz Diecast", "Collector", 1390, 1690],
      ["Diecast Cars", "Toyota Supra Diecast", "Collector", 1190, 1490],
      ["Diecast Cars", "Audi R8 Diecast", "Collector", 1490, 1890],
      ["Diecast Cars", "Porsche 911 Diecast", "Collector", 1590, 1990],

      ["Sports Cars", "Ferrari F1 Racing Car", "Racing", 2290, 2890],
      ["Sports Cars", "Mercedes F1 Racing Car", "Racing", 2290, 2890],
      ["Sports Cars", "McLaren Super Car", "Supercar", 1990, 2490],
      ["Sports Cars", "Mustang GT Sports Car", "Muscle", 1790, 2290],
      ["Sports Cars", "Nissan GTR Special Edition", "Supercar", 2590, 3190],

      ["Formula Cars", "Red Formula Speedster", "Formula", 1890, 2390],
      ["Formula Cars", "Blue Formula Racer", "Formula", 1890, 2390],
      ["Formula Cars", "Black Formula Champion", "Formula", 2090, 2590],
      ["Formula Cars", "Silver Formula Pro", "Formula", 2190, 2690],

      ["Off-Road Trucks", "Monster Off-Road Truck", "Off-Road", 2990, 3590],
      ["Off-Road Trucks", "Military Jeep RC", "Off-Road", 2790, 3390],
      ["Off-Road Trucks", "Rock Crawler 4x4", "Crawler", 3290, 3990],
      ["Off-Road Trucks", "Desert Rally Truck", "Rally", 2890, 3490],

      ["Police & Emergency", "Police Patrol Car", "Emergency", 1590, 1990],
      ["Police & Emergency", "Fire Rescue Truck", "Emergency", 1890, 2290],
      ["Police & Emergency", "Ambulance Toy Van", "Emergency", 1490, 1890],
    ];

    const colors = ["Red", "Black", "White", "Blue", "Silver", "Yellow"];
    const sizes = ["1:18", "1:24", "1:32"];

    const products = productBlueprints.map(
      ([category, name, style, price, originalPrice], index) => {
        const selectedColors = [randomItem(colors), randomItem(colors)].filter(
          (value, i, arr) => arr.indexOf(value) === i
        );

        const productImages = getProductImages(index);

        const specialFeatures = [
          "opening doors",
          "front and rear deck details",
          "working lights",
          "horn and engine sound",
        ];

        const description =
          name === "Nissan GTR Smoke RC Car"
            ? "Special Nissan GTR RC car with smoke effect from the silencer, opening doors, working lights, horn, and engine sound."
            : `${name} with ${specialFeatures.join(
                ", "
              )}. A great choice for kids, collectors, and gift buyers.`;

        return {
          _id: new ObjectId(),
          name,
          category,
          style,
          price,
          originalPrice,
          stock: Math.floor(Math.random() * 40) + 5,
          shortDescription: `${name} with premium design, realistic details, and smooth finishing.`,
          description,
          images: productImages,
          image: productImages[0],
          colors: selectedColors,
          color: selectedColors[0],
          sizes,
          createdAt: new Date(Date.now() - index * 86400000),
          updatedAt: now,
          seeded: true,
        };
      }
    );

    const coupons = [
      {
        _id: new ObjectId(),
        code: "WELCOME10",
        discount: 10,
        type: "percentage",
        description: "Get 10% discount on your first order.",
        minAmount: 1000,
        usageLimit: 200,
        used: 25,
        startDate: getDateString(10),
        endDate: "2026-12-31",
        status: "active",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        code: "TOYCAR200",
        discount: 200,
        type: "fixed",
        description: "Flat 200 BDT discount on selected toy cars.",
        minAmount: 2000,
        usageLimit: 100,
        used: 12,
        startDate: getDateString(5),
        endDate: "2026-11-30",
        status: "active",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        code: "F1RACE15",
        discount: 15,
        type: "percentage",
        description: "Special discount for Formula racing cars.",
        minAmount: 2500,
        usageLimit: 80,
        used: 18,
        startDate: getDateString(3),
        endDate: "2026-10-31",
        status: "active",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        code: "OLDDEAL",
        discount: 20,
        type: "percentage",
        description: "Expired old campaign coupon.",
        minAmount: 1500,
        usageLimit: 50,
        used: 50,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "disabled",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
    ];

    const normalUsers = users.filter((user) => user.role === "user");
    const adminUser = users.find((user) => user.role === "admin");

    const carts = normalUsers.map((user, index) => {
      const cartProducts = products.slice(index * 2, index * 2 + 3);

      return {
        _id: new ObjectId(),
        userId: user._id.toString(),
        userEmail: user.email,
        items: cartProducts.map((product) => ({
          productId: product._id.toString(),
          name: product.name,
          price: product.price,
          quantity: Math.floor(Math.random() * 2) + 1,
          image: product.image,
          size: randomItem(product.sizes),
          color: randomItem(product.colors),
        })),
        createdAt: now,
        updatedAt: now,
        seeded: true,
      };
    });

    const orderStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const paymentStatuses = [
      "pending",
      "paid",
      "completed",
      "failed",
      "refunded",
      "cancelled",
    ];

    const paymentMethods = [
      ["cash_on_delivery", "Cash on Delivery"],
      ["stripe", "Stripe"],
      ["paypal", "PayPal"],
    ];

    const orders = Array.from({ length: 15 }).map((_, index) => {
      const user = randomItem(normalUsers);

      const selectedProducts = [
        products[index % products.length],
        products[(index + 5) % products.length],
      ];

      const items = selectedProducts.map((product) => {
        const quantity = Math.floor(Math.random() * 2) + 1;
        const subtotal = product.price * quantity;

        return {
          productId: product._id.toString(),
          name: product.name,
          productName: product.name,
          price: product.price,
          quantity,
          size: randomItem(product.sizes),
          color: randomItem(product.colors),
          image: product.image,
          subtotal,
        };
      });

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const shipping = subtotal >= 3000 ? 0 : 120;
      const tax = Math.round(subtotal * 0.05);
      const discount = index % 3 === 0 ? 200 : 0;
      const total = subtotal + shipping + tax - discount;

      const status = orderStatuses[index % orderStatuses.length];
      const paymentStatus = paymentStatuses[index % paymentStatuses.length];
      const [paymentMethod, paymentMethodName] =
        paymentMethods[index % paymentMethods.length];

      const isPaid = ["paid", "completed"].includes(paymentStatus);
      const isDelivered = status === "delivered";

      return {
        _id: new ObjectId(),
        orderId: getOrderId(index),
        orderDate: getDateString(index),
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.name,

        customerInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: {
            street: "Road 12",
            address: "House 20, Dhanmondi",
            city: "Dhaka",
            zipCode: "1209",
            country: "Bangladesh",
          },
        },

        shippingAddress: {
          fullName: user.name,
          email: user.email,
          address: "House 20, Road 12, Dhanmondi",
          city: "Dhaka",
          postalCode: "1209",
          country: "Bangladesh",
          phone: user.phone,
        },

        items,
        paymentMethod,
        paymentMethodName,
        couponCode: discount > 0 ? "TOYCAR200" : null,

        subtotal,
        shipping,
        tax,
        discount,
        total,
        totalAmount: total,
        totalPrice: total,

        orderSummary: {
          subtotal,
          shipping,
          tax,
          discount,
          total,
          taxName: "VAT",
        },

        status,
        paymentStatus,
        deliveryStatus: status,
        trackingNumber: ["shipped", "delivered"].includes(status)
          ? `TRK-SEED-${100000 + index}`
          : null,
        adminNote: index % 4 === 0 ? "Priority customer order." : null,

        isPaid,
        isDelivered,
        paidAt: isPaid ? new Date(Date.now() - index * 86400000) : null,
        deliveredAt: isDelivered
          ? new Date(Date.now() - index * 86400000)
          : null,

        createdAt: new Date(Date.now() - index * 86400000),
        updatedAt: now,
        seeded: true,
      };
    });

    const reviewComments = [
      "Excellent quality and very realistic design.",
      "My kid loved it. Lights and finishing are really good.",
      "Good product for the price. Packaging was also nice.",
      "The car looks premium and works smoothly.",
      "Very detailed model. Perfect for gifting.",
      "Battery backup is decent and build quality feels strong.",
      "Color and finishing are better than expected.",
      "Fast delivery and product matched the pictures.",
    ];

    const reviews = Array.from({ length: 30 }).map((_, index) => {
      const product = products[index % products.length];
      const user = normalUsers[index % normalUsers.length];
      const approved = index % 5 !== 0;

      return {
        _id: new ObjectId(),
        productId: product._id.toString(),
        productName: product.name,
        rating: Math.floor(Math.random() * 2) + 4,
        title: approved ? "Great product" : "Waiting for approval",
        comment: reviewComments[index % reviewComments.length],
        photo: index % 4 === 0 ? getReviewImage(index) : null,

        userId: user._id.toString(),
        userName: user.name,
        userEmail: user.email,

        customerName: user.name,
        customerEmail: user.email,

        isApproved: approved,
        status: approved ? "approved" : "pending",
        verified: index % 3 !== 0,
        helpful: Math.floor(Math.random() * 20),
        date: getDateString(index),

        createdAt: new Date(Date.now() - index * 86400000),
        updatedAt: now,
        seeded: true,
      };
    });

    const contacts = [
      {
        _id: new ObjectId(),
        name: "Tanvir Rahman",
        email: "tanvir@example.com",
        subject: "Product availability",
        message: "Is the Nissan GTR Smoke RC Car available in black color?",
        phone: "+8801711111111",
        status: "unread",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Mim Akter",
        email: "mim@example.com",
        subject: "Bulk order",
        message: "I want to order 20 toy cars for a birthday event.",
        phone: "+8801722222222",
        status: "read",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Sabbir Hossain",
        email: "sabbir@example.com",
        subject: "Delivery question",
        message: "How many days does delivery take inside Dhaka?",
        phone: null,
        status: "unread",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        name: "Jarin Tasnim",
        email: "jarin@example.com",
        subject: "Gift packaging",
        message: "Do you provide gift wrapping for toy cars?",
        phone: "+8801733333333",
        status: "read",
        createdAt: now,
        updatedAt: now,
        seeded: true,
      },
    ];

    const shippingTaxSettings = {
      _id: "shipping_tax_settings",
      shippingSettings: {
        shippingCharge: 120,
        enabled: true,
      },
      taxSettings: {
        taxRate: 5,
        enabled: true,
        taxName: "VAT",
      },
      lastUpdated: now,
    };

    const conversations = normalUsers.map((user, index) => ({
      _id: new ObjectId(),
      userId: user._id.toString(),
      userName: user.name,
      userEmail: user.email,
      isGuest: false,
      guestTokenHash: "",
      lastMessage:
        index % 2 === 0
          ? "Thank you. I will place the order soon."
          : "Can you confirm the delivery time?",
      lastMessageTime: new Date(Date.now() - index * 3600000),
      unreadCount: index % 2 === 0 ? 0 : 2,
      createdAt: new Date(Date.now() - index * 86400000),
      expiresAt: null,
      seeded: true,
    }));

    conversations.push({
      _id: new ObjectId(),
      userId: "",
      userName: "Guest Customer",
      userEmail: "guest@example.com",
      isGuest: true,
      guestTokenHash: "seed_guest_token_hash_001",
      lastMessage: "I want to know about RC car warranty.",
      lastMessageTime: now,
      unreadCount: 1,
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 86400000),
      seeded: true,
    });

    const chatMessages = conversations.flatMap((conversation, index) => [
      {
        _id: new ObjectId(),
        conversationId: conversation._id.toString(),
        clientMessageId: `client-seed-${index}-1`,
        senderId: conversation.userId || "guest",
        senderName: conversation.userName,
        senderRole: "user",
        message: "Hello, I need help with a toy car order.",
        attachments: [],
        timestamp: new Date(Date.now() - index * 3600000 - 1800000),
        isRead: true,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        conversationId: conversation._id.toString(),
        clientMessageId: `client-seed-${index}-2`,
        senderId: adminUser._id.toString(),
        senderName: adminUser.name,
        senderRole: "admin",
        message: "Sure, please tell me which model you are interested in.",
        attachments: [],
        timestamp: new Date(Date.now() - index * 3600000),
        isRead: index % 2 === 0,
        seeded: true,
      },
      {
        _id: new ObjectId(),
        conversationId: conversation._id.toString(),
        clientMessageId: `client-seed-${index}-3`,
        senderId: conversation.userId || "guest",
        senderName: conversation.userName,
        senderRole: "user",
        message:
          index % 2 === 0
            ? "I am interested in the Nissan GTR Smoke RC Car."
            : "Do you have cash on delivery inside Dhaka?",
        attachments:
          index === 0
            ? [
                {
                  type: "image",
                  filename: "car-reference.jpg",
                  url: getReviewImage(index),
                  size: 245000,
                  mimetype: "image/jpeg",
                  width: 700,
                  height: 700,
                },
              ]
            : [],
        timestamp: new Date(Date.now() - index * 3600000 + 300000),
        isRead: index % 2 === 0,
        seeded: true,
      },
    ]);

    console.log("Inserting seed data...");

    await collections.users.insertMany(users);
    await collections.categories.insertMany(categories);
    await collections.products.insertMany(products);
    await collections.coupons.insertMany(coupons);
    await collections.carts.insertMany(carts);
    await collections.orders.insertMany(orders);
    await collections.reviews.insertMany(reviews);
    await collections.contacts.insertMany(contacts);
    await collections.settings.insertOne(shippingTaxSettings);
    await collections.chatConversations.insertMany(conversations);
    await collections.chatMessages.insertMany(chatMessages);

    console.log("Updating category product counts...");

    for (const category of categories) {
      const productCount = products.filter(
        (product) => product.category === category.name
      ).length;

      await collections.categories.updateOne(
        { _id: category._id },
        {
          $set: {
            productCount,
            updatedAt: new Date(),
          },
        }
      );
    }

    console.log("Creating indexes...");

    await createUsefulIndexes(collections);

    console.log("Seed completed successfully.");

    console.table({
      users: users.length,
      categories: categories.length,
      products: products.length,
      coupons: coupons.length,
      carts: carts.length,
      orders: orders.length,
      reviews: reviews.length,
      contacts: contacts.length,
      conversations: conversations.length,
      chatMessages: chatMessages.length,
    });

    console.log("");
    console.log("Demo login:");
    console.log(`Admin: admin@${SEED_EMAIL_DOMAIN} / 12345678`);
    console.log(`User: rafi@${SEED_EMAIL_DOMAIN} / 12345678`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

seed();
