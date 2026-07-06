import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAuth, requireAdmin, checkOrigin } from '../../../../lib/apiGuards';
import { revalidateOrderData } from '../../../../lib/cache/revalidate';
import { publishRealtimeEvent } from '../../../../lib/socketIO';

const VALID_ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const VALID_PAYMENT_STATUSES = ['pending', 'paid', 'completed', 'failed', 'refunded', 'cancelled'];
const VALID_DELIVERY_STATUSES = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'failed', 'returned', 'cancelled'];
const ALLOWED_ADMIN_ORDER_UPDATE_FIELDS = ['status', 'paymentStatus', 'trackingNumber', 'deliveryStatus', 'adminNote'];

async function emitOrdersChanged(action, id) {
  await publishRealtimeEvent('orders:changed', { action, id });
}

function orderNotFound() {
  return NextResponse.json({
    success: false,
    error: 'Order not found'
  }, { status: 404 });
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function badRequest(error) {
  return NextResponse.json({
    success: false,
    error
  }, { status: 400 });
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasOwn(value, field) {
  return Object.prototype.hasOwnProperty.call(value, field);
}

function validateEnumValue(field, value, validValues) {
  if (typeof value !== 'string' || !validValues.includes(value)) {
    return `${field} must be one of: ${validValues.join(', ')}`;
  }

  return null;
}

function validateOptionalString(field, value, maxLength) {
  if (value === null) {
    return { value: null };
  }

  if (typeof value !== 'string') {
    return { error: `${field} must be a string or null` };
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > maxLength) {
    return { error: `${field} must be ${maxLength} characters or less` };
  }

  return { value: trimmedValue || null };
}

function buildAdminOrderUpdate(body) {
  if (!isPlainObject(body)) {
    return { error: badRequest('Invalid request body') };
  }

  const unsupportedFields = Object.keys(body)
    .filter((field) => !ALLOWED_ADMIN_ORDER_UPDATE_FIELDS.includes(field));

  if (unsupportedFields.length > 0) {
    return {
      error: badRequest(`Unsupported order update field(s): ${unsupportedFields.join(', ')}`)
    };
  }

  const updateData = {};

  if (hasOwn(body, 'status')) {
    const statusError = validateEnumValue('status', body.status, VALID_ORDER_STATUSES);
    if (statusError) return { error: badRequest(statusError) };
    updateData.status = body.status;
  }

  if (hasOwn(body, 'paymentStatus')) {
    const paymentStatusError = validateEnumValue('paymentStatus', body.paymentStatus, VALID_PAYMENT_STATUSES);
    if (paymentStatusError) return { error: badRequest(paymentStatusError) };
    updateData.paymentStatus = body.paymentStatus;
  }

  if (hasOwn(body, 'deliveryStatus')) {
    const deliveryStatusError = validateEnumValue('deliveryStatus', body.deliveryStatus, VALID_DELIVERY_STATUSES);
    if (deliveryStatusError) return { error: badRequest(deliveryStatusError) };
    updateData.deliveryStatus = body.deliveryStatus;
  }

  if (hasOwn(body, 'trackingNumber')) {
    const trackingNumber = validateOptionalString('trackingNumber', body.trackingNumber, 100);
    if (trackingNumber.error) return { error: badRequest(trackingNumber.error) };
    updateData.trackingNumber = trackingNumber.value;
  }

  if (hasOwn(body, 'adminNote')) {
    const adminNote = validateOptionalString('adminNote', body.adminNote, 500);
    if (adminNote.error) return { error: badRequest(adminNote.error) };
    updateData.adminNote = adminNote.value;
  }

  if (Object.keys(updateData).length === 0) {
    return {
      error: badRequest(`At least one supported field is required: ${ALLOWED_ADMIN_ORDER_UPDATE_FIELDS.join(', ')}`)
    };
  }

  const now = new Date();

  if (updateData.status === 'delivered' || updateData.deliveryStatus === 'delivered') {
    updateData.isDelivered = true;
    updateData.deliveredAt = now;
  }

  updateData.updatedAt = now;

  return { updateData };
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

// PUT — Update order status (Admin only)
export async function PUT(request, { params }) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return badRequest('Invalid order ID');
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return badRequest('Invalid JSON in request body');
    }

    const { updateData, error: validationError } = buildAdminOrderUpdate(body);
    if (validationError) return validationError;

    const orderObjectId = new ObjectId(id);
    const orders = await getCollection('allOrders');

    // Update the order
    const result = await orders.updateOne(
      { _id: orderObjectId }, 
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    // Get the updated order
    const updatedOrder = await orders.findOne({ _id: orderObjectId });

    revalidateOrderData();
    await emitOrdersChanged('update', id);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update order' 
    }, { status: 500 });
  }
}

// GET — Get specific order (Owner or Admin)
export async function GET(request, { params }) {
  const { user, error } = await requireAuth();
  if (error) return error;
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid order ID'
      }, { status: 400 });
    }

    const query = { _id: new ObjectId(id) };

    if (user.role !== 'admin') {
      const ownershipConditions = buildOrderOwnershipConditions(user);

      if (!ownershipConditions.length) {
        return NextResponse.json({
          success: false,
          error: 'Forbidden'
        }, { status: 403 });
      }

      query.$or = ownershipConditions;
    }

    const orders = await getCollection('allOrders');
    const order = await orders.findOne(query);

    if (!order) {
      return orderNotFound();
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch order' 
    }, { status: 500 });
  }
}

// DELETE — Delete order (Admin only)
export async function DELETE(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { id } = params;
    const orders = await getCollection('allOrders');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    // Find the order first to check if it exists
    const existingOrder = await orders.findOne({ _id: new ObjectId(id) });
    
    if (!existingOrder) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    // Delete the order
    const result = await orders.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete order' 
      }, { status: 500 });
    }

    revalidateOrderData();
    await emitOrdersChanged('delete', id);

    return NextResponse.json({
      success: true,
      data: { deletedId: id },
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete order' 
    }, { status: 500 });
  }
}
