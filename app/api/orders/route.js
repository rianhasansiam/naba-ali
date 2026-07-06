/**
 * app/api/orders/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * GET  — Admin only, paginated.
 * POST — Authenticated users; total calculated server-side.
 * PUT  — Admin only.
 * DELETE — Admin only.
 *
 * After every mutation: revalidateOrderData() + emit orders:changed.
 */

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../../lib/mongodb';
import { requireAuth, requireAdmin } from '../../../lib/apiGuards';
import { auth } from '../../../lib/auth';
import { validateBody, orderSchema } from '../../../lib/validators';
import { checkOrigin } from '../../../lib/security';
import { revalidateOrderData } from '../../../lib/cache/revalidate';
import { publishRealtimeEvent } from '../../../lib/socketIO';

async function emitOrdersChanged(action, id) {
  await publishRealtimeEvent('orders:changed', { action, id });
}

const DEFAULT_SHIPPING_TAX_SETTINGS = {
  shippingSettings: {
    shippingCharge: 15.99,
    enabled: true,
  },
  taxSettings: {
    taxRate: 8.25,
    enabled: true,
    taxName: 'Sales Tax',
  },
};

const PAYMENT_METHOD_NAMES = {
  cash_on_delivery: 'Cash on Delivery',
  stripe: 'Stripe',
  paypal: 'PayPal',
};

function roundMoney(value) {
  return Number((Number(value) || 0).toFixed(2));
}

function getTrustedProductPrice(product) {
  const price = product.salePrice ?? product.price;
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice : null;
}

function getProductImage(product) {
  return product.primaryImage || product.image || product.images?.[0] || null;
}

function badRequest(error) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value) {
  return normalizeString(value).toLowerCase();
}

function addOwnershipConditions(conditions, fields, values) {
  for (const field of fields) {
    for (const value of values) {
      conditions.push({ [field]: value });
    }
  }
}

function buildOrderOwnershipConditions(user) {
  const conditions = [];
  const userId = normalizeString(user?.id);
  const userEmail = normalizeEmail(user?.email);

  if (userId) {
    const idValues = [userId];
    if (ObjectId.isValid(userId)) {
      idValues.push(new ObjectId(userId));
    }

    addOwnershipConditions(
      conditions,
      ['userId', 'customerId', 'customerInfo.userId', 'customer.userId', 'customer.id', 'user.id'],
      idValues
    );
  }

  if (userEmail) {
    const emailValues = [...new Set([normalizeString(user?.email), userEmail].filter(Boolean))];
    addOwnershipConditions(
      conditions,
      ['userEmail', 'customerInfo.email', 'customer.email', 'email', 'user.email'],
      emailValues
    );
  }

  return conditions;
}

function getProductStock(product) {
  const rawStock = product.stock ?? product.stockCount;
  if (rawStock === undefined || rawStock === null || rawStock === '') return null;

  const stock = Number(rawStock);
  return Number.isFinite(stock) ? stock : null;
}

function getProductStatus(product) {
  return typeof product.status === 'string' ? product.status.trim().toLowerCase() : null;
}

function isProductInactive(product) {
  const inactiveStatuses = new Set(['inactive', 'disabled', 'draft', 'archived', 'unpublished']);
  return (
    product.isActive === false ||
    product.active === false ||
    inactiveStatuses.has(getProductStatus(product))
  );
}

function isProductUnavailable(product) {
  const unavailableStatuses = new Set(['unavailable', 'out-of-stock']);
  const stock = getProductStock(product);

  return (
    product.isInStock === false ||
    product.isAvailable === false ||
    product.available === false ||
    unavailableStatuses.has(getProductStatus(product)) ||
    (stock !== null && stock <= 0)
  );
}

function getConfiguredVariantValues(product, pluralField, singularField) {
  const values = [];
  const pluralValue = product[pluralField];

  if (Array.isArray(pluralValue)) {
    values.push(...pluralValue);
  }

  if (product[singularField]) {
    values.push(product[singularField]);
  }

  return Array.from(
    new Set(
      values
        .filter((value) => typeof value === 'string' && value.trim())
        .map((value) => value.trim().toLowerCase())
    )
  );
}

function validateProductVariant(product, item, field, pluralField, singularField) {
  const configuredValues = getConfiguredVariantValues(product, pluralField, singularField);
  if (configuredValues.length === 0) return null;

  const selectedValue = typeof item[field] === 'string' ? item[field].trim() : '';
  const productName = product.name || item.productId;

  if (!selectedValue) {
    return `${productName} requires a ${field}`;
  }

  if (!configuredValues.includes(selectedValue.toLowerCase())) {
    return `${productName} is not available in ${field} "${selectedValue}"`;
  }

  return null;
}

function normalizeShippingTaxSettings(settings) {
  const shippingSettings = settings?.shippingSettings || DEFAULT_SHIPPING_TAX_SETTINGS.shippingSettings;
  const taxSettings = settings?.taxSettings || DEFAULT_SHIPPING_TAX_SETTINGS.taxSettings;

  const shippingCharge = Number(shippingSettings.shippingCharge);
  const taxRate = Number(taxSettings.taxRate);

  return {
    shippingSettings: {
      shippingCharge: Number.isFinite(shippingCharge) && shippingCharge >= 0
        ? shippingCharge
        : DEFAULT_SHIPPING_TAX_SETTINGS.shippingSettings.shippingCharge,
      enabled: shippingSettings.enabled !== false,
    },
    taxSettings: {
      taxRate: Number.isFinite(taxRate) && taxRate >= 0
        ? taxRate
        : DEFAULT_SHIPPING_TAX_SETTINGS.taxSettings.taxRate,
      enabled: taxSettings.enabled !== false,
      taxName: typeof taxSettings.taxName === 'string' && taxSettings.taxName.trim()
        ? taxSettings.taxName.trim()
        : DEFAULT_SHIPPING_TAX_SETTINGS.taxSettings.taxName,
    },
  };
}

async function getShippingTaxSettings() {
  const settingsCol = await getCollection('shippingTaxSettings');
  const settings = await settingsCol.findOne({ _id: 'shipping_tax_settings' });
  return normalizeShippingTaxSettings(settings);
}

function calculateOrderSummary(subtotal, settings) {
  const shipping = settings.shippingSettings.enabled
    ? roundMoney(settings.shippingSettings.shippingCharge)
    : 0;
  const tax = settings.taxSettings.enabled
    ? roundMoney((subtotal * settings.taxSettings.taxRate) / 100)
    : 0;
  const total = roundMoney(subtotal + shipping + tax);

  return {
    subtotal,
    shipping,
    tax,
    discount: 0,
    total,
    taxName: settings.taxSettings.taxName,
  };
}

// ── GET — Admin only, paginated ────────────────────────────────────────────────
export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, parseInt(searchParams.get('page')   || '1',  10));
    const limit  = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
    const status = searchParams.get('status');
    const mine   = searchParams.get('mine') === '1' || searchParams.get('mine') === 'true';
    const skip   = (page - 1) * limit;

    const col    = await getCollection('allOrders');

    if (mine) {
      const { user, error } = await requireAuth();
      if (error) return error;

      const ownershipConditions = buildOrderOwnershipConditions(user);
      const filter = ownershipConditions.length > 0 ? { $or: ownershipConditions } : { _id: null };
      if (status && status !== 'all') {
        filter.status = status;
      }

      const data = await col.find(filter).sort({ createdAt: -1, orderDate: -1 }).toArray();
      return NextResponse.json({ success: true, data });
    }

    const { error } = await requireAdmin();
    if (error) return error;

    const filter = status ? { status } : {};

    const [data, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ── POST — Authenticated users, server-calculated total ───────────────────────
export async function POST(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { data, error: validationError } = await validateBody(request, orderSchema, { validationStatus: 400 });
  if (validationError) return validationError;

  try {
    const session = await auth();
    const user = session?.user || null;
    const customerEmail = user?.email || data.shippingAddress.email;

    if (!customerEmail) {
      return badRequest('Customer email is required');
    }

    const productsCol = await getCollection('allProducts');
    const productIds = data.items.map((item) => item.productId);
    const productObjectIdsById = new Map();
    const canonicalProductIdByRequestId = new Map();

    for (const productId of productIds) {
      if (!ObjectId.isValid(productId)) {
        return badRequest(`Invalid product ID: ${productId}`);
      }

      const productObjectId = new ObjectId(productId);
      const canonicalProductId = productObjectId.toString();
      canonicalProductIdByRequestId.set(productId, canonicalProductId);

      if (!productObjectIdsById.has(canonicalProductId)) {
        productObjectIdsById.set(canonicalProductId, productObjectId);
      }
    }

    const [products, settings] = await Promise.all([
      productsCol.find({ _id: { $in: Array.from(productObjectIdsById.values()) } }).toArray(),
      getShippingTaxSettings(),
    ]);

    const productById = new Map(products.map((product) => [product._id.toString(), product]));
    const requestedQuantityByProductId = new Map();

    for (const item of data.items) {
      const canonicalProductId = canonicalProductIdByRequestId.get(item.productId);
      requestedQuantityByProductId.set(
        canonicalProductId,
        (requestedQuantityByProductId.get(canonicalProductId) || 0) + item.quantity
      );
    }

    // Server-side price calculation — never trust client total
    let subtotal = 0;
    const resolvedItems = [];

    for (const item of data.items) {
      const canonicalProductId = canonicalProductIdByRequestId.get(item.productId);
      const product = productById.get(canonicalProductId);
      if (!product) {
        return badRequest(`Product not found: ${item.productId}`);
      }

      if (isProductInactive(product)) {
        return badRequest(`Product is inactive: ${product.name || item.productId}`);
      }

      if (isProductUnavailable(product)) {
        return badRequest(`Product is unavailable: ${product.name || item.productId}`);
      }

      const requestedQuantity = requestedQuantityByProductId.get(canonicalProductId) || item.quantity;
      const stock = getProductStock(product);
      if (stock !== null && requestedQuantity > stock) {
        return badRequest(`Insufficient stock for ${product.name || item.productId}. Requested ${requestedQuantity}, available ${stock}.`);
      }

      const sizeError = validateProductVariant(product, item, 'size', 'sizes', 'size');
      if (sizeError) {
        return badRequest(sizeError);
      }

      const colorError = validateProductVariant(product, item, 'color', 'colors', 'color');
      if (colorError) {
        return badRequest(colorError);
      }

      const unitPrice = getTrustedProductPrice(product);
      if (!unitPrice) {
        return NextResponse.json({ success: false, error: `Product has invalid price: ${item.productId}` }, { status: 500 });
      }

      const lineSubtotal = roundMoney(unitPrice * item.quantity);
      subtotal += lineSubtotal;

      resolvedItems.push({
        productId: canonicalProductId,
        name:      product.name,
        productName: product.name,
        price:     unitPrice,
        quantity:  item.quantity,
        size:      item.size  || null,
        color:     item.color || null,
        image:     getProductImage(product),
        subtotal:  lineSubtotal,
      });
    }

    subtotal = roundMoney(subtotal);
    const orderSummary = calculateOrderSummary(subtotal, settings);
    const now = new Date();
    const orderId = `ORD-${Date.now()}`;

    const doc = {
      orderId,
      orderDate: now.toISOString(),
      // Authenticated orders use session identity; guest orders use checkout email.
      userId:          user?.id || null,
      userEmail:       customerEmail,
      userName:        user?.name || data.shippingAddress.fullName,
      customerInfo: {
        name: data.shippingAddress.fullName,
        email: customerEmail,
        phone: data.shippingAddress.phone,
        address: {
          street: data.shippingAddress.address,
          address: data.shippingAddress.address,
          city: data.shippingAddress.city,
          zipCode: data.shippingAddress.postalCode,
          country: data.shippingAddress.country,
        },
      },
      // Verified server-resolved data
      items:           resolvedItems,
      shippingAddress: data.shippingAddress,
      paymentMethod:   data.paymentMethod,
      paymentMethodName: PAYMENT_METHOD_NAMES[data.paymentMethod] || data.paymentMethod,
      couponCode:      data.couponCode || null,
      // Server-set financials — NEVER from client
      subtotal:        orderSummary.subtotal,
      shipping:        orderSummary.shipping,
      tax:             orderSummary.tax,
      discount:        orderSummary.discount,
      total:           orderSummary.total,
      totalAmount:     orderSummary.total,
      totalPrice:      orderSummary.total,
      orderSummary,
      // Server-set flags — NEVER from client
      status:          'pending',
      paymentStatus:   'pending',
      isPaid:          false,
      isDelivered:     false,
      paidAt:          null,
      deliveredAt:     null,
      createdAt:       now,
      updatedAt:       now,
    };

    const ordersCol = await getCollection('allOrders');
    const result    = await ordersCol.insertOne(doc);

    revalidateOrderData();
    await emitOrdersChanged('create', result.insertedId);

    return NextResponse.json({ success: true, message: 'Order placed successfully', data: { ...doc, _id: result.insertedId } });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

// ── PUT — Admin only ───────────────────────────────────────────────────────────
export async function PUT(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { _id, status, trackingNumber, note } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Order _id is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 400 });
    }

    // Only allow explicit safe fields — never expose a general $set
    const updateFields = { updatedAt: new Date() };
    if (status)         updateFields.status         = status;
    if (trackingNumber) updateFields.trackingNumber  = trackingNumber;
    if (note)           updateFields.adminNote       = note;
    if (status === 'delivered') {
      updateFields.isDelivered  = true;
      updateFields.deliveredAt  = new Date();
    }

    const col    = await getCollection('allOrders');
    const result = await col.updateOne({ _id: new ObjectId(_id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    revalidateOrderData();
    await emitOrdersChanged('update', _id);

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (err) {
    console.error('PUT /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}

// ── DELETE — Admin only ────────────────────────────────────────────────────────
export async function DELETE(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Order _id is required' }, { status: 400 });
    }

    const col    = await getCollection('allOrders');
    const result = await col.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    revalidateOrderData();
    await emitOrdersChanged('delete', _id);

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 });
  }
}
