import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { checkOrigin, isAuthenticated, isAdmin, unauthorizedResponse } from '../../../../lib/security';

// GET - Get all messages for a conversation (User, Guest, or Admin)
export async function GET(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const admin = await isAdmin();

    if (!conversationId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Conversation ID is required' 
      }, { status: 400 });
    }

    // Admin can see all, others can only see their own
    if (!admin) {
      const user = await isAuthenticated();
      // Allow access if authenticated user matches OR if it's a guest with matching ID
      if (user && conversationId !== user.id && !conversationId.startsWith('guest_')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Unauthorized access' 
        }, { status: 403 });
      }
    }

    const messages = await getCollection('chatMessages');
    const messageList = await messages
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      messages: messageList
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch messages" 
    }, { status: 500 });
  }
}// POST - Send a new message (User, Guest, or Admin)
export async function POST(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const body = await request.json();
    const { conversationId, message, userId, userName } = body;

    if (!conversationId || !message || !userId || !userName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Conversation ID, message, user ID, and user name are required' 
      }, { status: 400 });
    }

    const admin = await isAdmin();
    const user = await isAuthenticated();
    
    // Allow if admin, authenticated user, or guest with matching conversationId
    const isAllowed = admin || 
                     (user && user.id === userId) || 
                     conversationId.startsWith('guest_');

    if (!isAllowed) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized access' 
      }, { status: 403 });
    }

    const messages = await getCollection('chatMessages');
    
    const newMessage = {
      conversationId,
      senderId: userId,
      senderName: userName,
      senderRole: admin ? 'admin' : 'user',
      message: message.trim(),
      timestamp: new Date(),
      isRead: false
    };

    const result = await messages.insertOne(newMessage);

    // Update conversation last message
    const conversations = await getCollection('chatConversations');
    await conversations.updateOne(
      { userId: conversationId },
      { 
        $set: { 
          lastMessage: message.trim().substring(0, 50),
          lastMessageTime: new Date()
        },
        $inc: { unreadCount: admin ? 0 : 1 }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: { ...newMessage, _id: result.insertedId }
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to send message" 
    }, { status: 500 });
  }
}

// PUT - Mark messages as read (User, Guest, or Admin)
export async function PUT(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Conversation ID is required' 
      }, { status: 400 });
    }

    // Allow guests and authenticated users to mark their own messages as read
    const messages = await getCollection('chatMessages');
    await messages.updateMany(
      { conversationId, isRead: false },
      { $set: { isRead: true } }
    );

    // Reset unread count (only for admin viewing)
    const admin = await isAdmin();
    if (admin) {
      const conversations = await getCollection('chatConversations');
      await conversations.updateOne(
        { userId: conversationId },
        { $set: { unreadCount: 0 } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to mark messages as read" 
    }, { status: 500 });
  }
}
