import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { checkOrigin, isAuthenticated, isAdmin, unauthorizedResponse } from '../../../../lib/security';

// GET - Get all conversations (Admin only)
export async function GET(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Only admin can view all conversations
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
      conversations: conversationList
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch conversations" 
    }, { status: 500 });
  }
}

// POST - Create or get conversation (User or Guest)
export async function POST(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const body = await request.json();
    const { userId, userName, userEmail, isGuest } = body;

    if (!userId || !userName) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID and name are required' 
      }, { status: 400 });
    }

    const conversations = await getCollection('chatConversations');
    
    // Check if conversation exists
    let conversation = await conversations.findOne({ userId });

    if (!conversation) {
      // Create new conversation
      const newConversation = {
        userId,
        userName,
        userEmail: userEmail || 'guest@temporary.com',
        isGuest: isGuest || false,
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        createdAt: new Date(),
        expiresAt: isGuest ? new Date(Date.now() + 12 * 60 * 60 * 1000) : null // 12 hours for guests
      };

      const result = await conversations.insertOne(newConversation);
      conversation = { ...newConversation, _id: result.insertedId };
    }

    return NextResponse.json({
      success: true,
      conversation
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to create conversation" 
    }, { status: 500 });
  }
}
