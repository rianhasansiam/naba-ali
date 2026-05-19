/**
 * app/api/chat/messages/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed:
 * - Zod validation (max 2000 chars)
 * - Removed debug console.log statements
 * - Guest authorization tightened
 */

import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { requireAdmin } from '../../../../lib/apiGuards';
import { isAuthenticated, isAdmin } from '../../../../lib/security';
import { checkOrigin } from '../../../../lib/security';
import { validateBody, chatMessageSchema } from '../../../../lib/validators';

// GET — Messages for a conversation
export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) {
    return NextResponse.json({ success: false, error: 'Conversation ID is required' }, { status: 400 });
  }

  const admin = await isAdmin();

  if (!admin) {
    const user = await isAuthenticated();
    // Non-admin users can only read their own conversation, or guest conversations
    if (user && conversationId !== user.id && !conversationId.startsWith('guest_')) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
    }
    if (!user && !conversationId.startsWith('guest_')) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
    }
  }

  try {
    const { searchParams: sp } = new URL(request.url);
    const page  = Math.max(1, parseInt(sp.get('page')  || '1',   10));
    const limit = Math.min(100, parseInt(sp.get('limit') || '50', 10));
    const skip  = (page - 1) * limit;

    const messages = await getCollection('chatMessages');
    const [data, total] = await Promise.all([
      messages.find({ conversationId }).sort({ timestamp: 1 }).skip(skip).limit(limit).toArray(),
      messages.countDocuments({ conversationId }),
    ]);

    return NextResponse.json({ success: true, messages: data, pagination: { page, limit, total } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST — Send a message
export async function POST(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { data, error: validationError } = await validateBody(request, chatMessageSchema);
  if (validationError) return validationError;

  const { conversationId, message, userId: bodyUserId, userName: bodyUserName } = data;

  const admin = await isAdmin();
  const user  = await isAuthenticated();

  let senderId, senderName, senderRole;

  if (admin) {
    senderId   = user?.id || 'admin';
    senderName = user?.name || 'Support Team';
    senderRole = 'admin';
  } else if (user) {
    senderId   = user.id;
    senderName = user.name || user.email;
    senderRole = 'user';
  } else {
    // Guest — must provide userId/userName and conversationId must start with 'guest_'
    if (!bodyUserId || !bodyUserName || !conversationId.startsWith('guest_')) {
      return NextResponse.json(
        { success: false, error: 'Guest sessions require userId, userName, and a guest_ conversationId' },
        { status: 400 }
      );
    }
    senderId   = bodyUserId;
    senderName = bodyUserName;
    senderRole = 'user';
  }

  // Authorization final check
  const isAllowed = admin || (user && user.id === senderId) || conversationId.startsWith('guest_');
  if (!isAllowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
  }

  try {
    const messages = await getCollection('chatMessages');

    const newMessage = {
      conversationId,
      senderId,
      senderName,
      senderRole,
      message: message.trim(),
      timestamp: new Date(),
      isRead: false,
    };

    const result = await messages.insertOne(newMessage);

    // Update conversation last message
    const conversations = await getCollection('chatConversations');
    await conversations.updateOne(
      { userId: conversationId },
      {
        $set: {
          lastMessage: message.trim().substring(0, 100),
          lastMessageTime: new Date(),
        },
        $inc: { unreadCount: admin ? 0 : 1 },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: { ...newMessage, _id: result.insertedId } });
  } catch (err) {
    console.error('POST /api/chat/messages error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

// PUT — Mark messages as read (no auth change needed, but guest check tightened)
export async function PUT(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'Conversation ID is required' }, { status: 400 });
    }

    const messages = await getCollection('chatMessages');
    await messages.updateMany({ conversationId, isRead: false }, { $set: { isRead: true } });

    const admin = await isAdmin();
    if (admin) {
      const conversations = await getCollection('chatConversations');
      await conversations.updateOne({ userId: conversationId }, { $set: { unreadCount: 0 } });
    }

    return NextResponse.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to mark messages as read' }, { status: 500 });
  }
}
