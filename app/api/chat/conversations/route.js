import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { getCollection } from '../../../../lib/mongodb';
import { checkOrigin, isAuthenticated, isAdmin, unauthorizedResponse } from '../../../../lib/security';

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function hashGuestToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function createGuestToken() {
  return randomBytes(32).toString('base64url');
}

function publicConversation(conversation) {
  if (!conversation) {
    return conversation;
  }

  const safeConversation = { ...conversation };
  delete safeConversation.guestTokenHash;
  return safeConversation;
}

export async function GET(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const admin = await isAdmin();
    if (!admin) {
      return unauthorizedResponse('Admin access required');
    }

    const conversations = await getCollection('chatConversations');
    const conversationList = await conversations
      .find({})
      .sort({ lastMessageTime: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      conversations: conversationList.map(publicConversation),
    });
  } catch (error) {
    console.error('GET /api/chat/conversations error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch conversations',
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const body = await request.json();
    const authenticatedUser = await isAuthenticated();
    const conversations = await getCollection('chatConversations');

    if (authenticatedUser) {
      const userId = authenticatedUser.id;
      const userName = authenticatedUser.name || authenticatedUser.email || 'Customer';
      const userEmail = authenticatedUser.email || null;

      let conversation = await conversations.findOne({ userId });

      if (!conversation) {
        const newConversation = {
          userId,
          userName,
          userEmail,
          isGuest: false,
          lastMessage: '',
          lastMessageTime: new Date(),
          unreadCount: 0,
          createdAt: new Date(),
          expiresAt: null,
        };

        const result = await conversations.insertOne(newConversation);
        conversation = { ...newConversation, _id: result.insertedId };
      }

      return NextResponse.json({
        success: true,
        conversation: publicConversation(conversation),
      });
    }

    const userId = normalizeString(body.userId);
    const userName = normalizeString(body.userName) || 'Guest User';
    const userEmail = normalizeString(body.userEmail) || 'guest@temporary.com';
    const suppliedGuestToken = normalizeString(body.guestToken);

    if (!userId.startsWith('guest_')) {
      return NextResponse.json({
        success: false,
        code: 'GUEST_ID_REQUIRED',
        error: 'Guest conversation IDs must start with guest_',
      }, { status: 400 });
    }

    let conversation = await conversations.findOne({ userId });
    let guestToken = suppliedGuestToken;

    if (!conversation) {
      guestToken = createGuestToken();
      const newConversation = {
        userId,
        userName,
        userEmail,
        isGuest: true,
        guestTokenHash: hashGuestToken(guestToken),
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      };

      const result = await conversations.insertOne(newConversation);
      conversation = { ...newConversation, _id: result.insertedId };
    } else if (!conversation.isGuest) {
      return NextResponse.json({
        success: false,
        code: 'UNAUTHORIZED_CONVERSATION',
        error: 'Guest access denied for this conversation',
      }, { status: 403 });
    } else if (!conversation.guestTokenHash) {
      guestToken = createGuestToken();
      await conversations.updateOne(
        { userId },
        {
          $set: {
            guestTokenHash: hashGuestToken(guestToken),
            userName,
            userEmail,
          },
        }
      );
      conversation = {
        ...conversation,
        guestTokenHash: hashGuestToken(guestToken),
        userName,
        userEmail,
      };
    } else if (!guestToken || hashGuestToken(guestToken) !== conversation.guestTokenHash) {
      return NextResponse.json({
        success: false,
        code: 'GUEST_TOKEN_REQUIRED',
        error: 'Valid guest conversation token required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      conversation: publicConversation(conversation),
      guestToken,
    });
  } catch (error) {
    console.error('POST /api/chat/conversations error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create conversation',
    }, { status: 500 });
  }
}
