import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getCollection } from '../../../../lib/mongodb';
import { isAuthenticated, isAdmin, checkOrigin } from '../../../../lib/security';
import { validateBody, chatMessageSchema } from '../../../../lib/validators';
import { publishChatMessage } from '../../../../lib/socketIO';

const GUEST_TOKEN_HEADER = 'x-skyzonee-guest-token';
let chatMessageIndexPromise = null;

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function hashGuestToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function getGuestToken(request, body = {}) {
  return normalizeString(body.guestToken || request.headers.get(GUEST_TOKEN_HEADER));
}

function getClientMessageId(body = {}) {
  return normalizeString(body.clientMessageId || body.requestId);
}

function isGuestConversationId(conversationId) {
  return normalizeString(conversationId).startsWith('guest_');
}

function errorResponse(error, status = 400, code = 'CHAT_ERROR') {
  return NextResponse.json({ success: false, code, error }, { status });
}

async function ensureIdempotencyIndex(messages) {
  if (!chatMessageIndexPromise) {
    chatMessageIndexPromise = messages.createIndex(
      { conversationId: 1, senderId: 1, clientMessageId: 1 },
      {
        unique: true,
        partialFilterExpression: { clientMessageId: { $type: 'string' } },
        name: 'chat_message_idempotency',
      }
    ).catch((error) => {
      chatMessageIndexPromise = null;
      throw error;
    });
  }

  return chatMessageIndexPromise;
}

async function authorizeConversation(request, conversationId, body = {}, options = {}) {
  const normalizedConversationId = normalizeString(conversationId);

  if (!normalizedConversationId) {
    return { response: errorResponse('Conversation ID is required', 400, 'CONVERSATION_REQUIRED') };
  }

  const admin = await isAdmin();
  const user = await isAuthenticated();
  const conversations = await getCollection('chatConversations');
  const conversation = await conversations.findOne({ userId: normalizedConversationId });

  if (admin) {
    if (options.requireExistingConversation && !conversation) {
      return { response: errorResponse('Conversation not found', 404, 'CONVERSATION_NOT_FOUND') };
    }

    return {
      admin,
      user,
      conversation,
      actor: {
        id: user?.id || 'admin',
        name: user?.name || 'Support Team',
        role: 'admin',
      },
    };
  }

  if (user) {
    if (normalizedConversationId !== user.id) {
      return { response: errorResponse('Unauthorized conversation access', 403, 'UNAUTHORIZED_CONVERSATION') };
    }

    if (options.requireExistingConversation && !conversation) {
      return { response: errorResponse('Conversation not found', 404, 'CONVERSATION_NOT_FOUND') };
    }

    return {
      admin,
      user,
      conversation,
      actor: {
        id: user.id,
        name: user.name || user.email || 'Customer',
        role: 'user',
      },
    };
  }

  if (!isGuestConversationId(normalizedConversationId)) {
    return { response: errorResponse('Authentication required', 401, 'AUTH_REQUIRED') };
  }

  if (!conversation || !conversation.isGuest) {
    return { response: errorResponse('Conversation not found', 404, 'CONVERSATION_NOT_FOUND') };
  }

  const guestToken = getGuestToken(request, body);
  if (!guestToken || !conversation.guestTokenHash || hashGuestToken(guestToken) !== conversation.guestTokenHash) {
    return { response: errorResponse('Valid guest conversation token required', 401, 'GUEST_TOKEN_REQUIRED') };
  }

  return {
    admin,
    user,
    conversation,
    actor: {
      id: conversation.userId,
      name: conversation.userName || 'Guest User',
      role: 'user',
    },
  };
}

export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  try {
    const access = await authorizeConversation(request, conversationId);
    if (access.response) return access.response;

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
    const skip = (page - 1) * limit;

    const messages = await getCollection('chatMessages');
    const [data, total] = await Promise.all([
      messages.find({ conversationId }).sort({ timestamp: 1 }).skip(skip).limit(limit).toArray(),
      messages.countDocuments({ conversationId }),
    ]);

    return NextResponse.json({ success: true, messages: data, pagination: { page, limit, total } });
  } catch (err) {
    console.error('GET /api/chat/messages error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { data, error: validationError } = await validateBody(request, chatMessageSchema);
  if (validationError) return validationError;

  const { conversationId, message, attachments = [] } = data;
  const clientMessageId = getClientMessageId(data);

  if (!clientMessageId) {
    return errorResponse('clientMessageId or requestId is required', 400, 'IDEMPOTENCY_KEY_REQUIRED');
  }

  try {
    const access = await authorizeConversation(request, conversationId, data, {
      requireExistingConversation: true,
    });
    if (access.response) return access.response;

    const { actor, admin } = access;
    const messages = await getCollection('chatMessages');
    await ensureIdempotencyIndex(messages);

    const existingMessage = await messages.findOne({
      conversationId,
      senderId: actor.id,
      clientMessageId,
    });

    if (existingMessage) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        message: existingMessage,
      });
    }

    const now = new Date();
    const trimmedMessage = message.trim();
    const newMessage = {
      conversationId,
      clientMessageId,
      senderId: actor.id,
      senderName: actor.name,
      senderRole: actor.role,
      message: trimmedMessage,
      attachments,
      timestamp: now,
      isRead: false,
    };

    let result;
    try {
      result = await messages.insertOne(newMessage);
    } catch (insertError) {
      if (insertError?.code === 11000) {
        const duplicateMessage = await messages.findOne({
          conversationId,
          senderId: actor.id,
          clientMessageId,
        });

        if (duplicateMessage) {
          return NextResponse.json({
            success: true,
            idempotent: true,
            message: duplicateMessage,
          });
        }
      }

      throw insertError;
    }

    const conversations = await getCollection('chatConversations');
    await conversations.updateOne(
      { userId: conversationId },
      {
        $set: {
          lastMessage: trimmedMessage.substring(0, 100),
          lastMessageTime: now,
        },
        $inc: { unreadCount: admin ? 0 : 1 },
      },
      { upsert: false }
    );

    const savedMessage = { ...newMessage, _id: result.insertedId };
    await publishChatMessage(savedMessage);

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (err) {
    console.error('POST /api/chat/messages error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

export async function PUT(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  try {
    const body = await request.json();
    const { conversationId } = body;

    const access = await authorizeConversation(request, conversationId, body);
    if (access.response) return access.response;

    const messages = await getCollection('chatMessages');
    const senderRoleToRead = access.actor.role === 'admin' ? 'user' : 'admin';

    await messages.updateMany(
      { conversationId, isRead: false, senderRole: senderRoleToRead },
      { $set: { isRead: true } }
    );

    if (access.actor.role === 'admin') {
      const conversations = await getCollection('chatConversations');
      await conversations.updateOne({ userId: conversationId }, { $set: { unreadCount: 0 } });
    }

    return NextResponse.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    console.error('PUT /api/chat/messages error:', err);
    return NextResponse.json({ success: false, error: 'Failed to mark messages as read' }, { status: 500 });
  }
}
