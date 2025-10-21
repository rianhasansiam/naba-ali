import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { checkOrigin, isAuthenticated, isAdmin, unauthorizedResponse } from '../../../../lib/security';

// GET - Get all conversations (Admin only)
export async function GET(request) {
  try {
    console.log('GET /api/chat/conversations - Start');
    
    const originCheck = checkOrigin(request);
    if (originCheck) {
      console.log('Origin check failed');
      return originCheck;
    }

    // Check authentication first
    const user = await isAuthenticated();
    console.log('User authenticated:', user ? 'Yes' : 'No', user?.email);
    
    // Only admin can view all conversations
    const admin = await isAdmin();
    console.log('Is admin:', admin);
    
    if (!admin) {
      console.log('Admin access denied');
      return unauthorizedResponse('Admin access required');
    }

    const conversations = await getCollection('chatConversations');
    
    if (!conversations) {
      console.error('Failed to get chatConversations collection');
      return NextResponse.json({ 
        success: false,
        error: "Database connection error" 
      }, { status: 500 });
    }

    const conversationList = await conversations
      .find({})
      .sort({ lastMessageTime: -1 })
      .toArray();

    console.log('Conversations fetched:', conversationList.length);

    return NextResponse.json({
      success: true,
      conversations: conversationList
    });

  } catch (error) {
    console.error('GET /api/chat/conversations error:', error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch conversations",
      details: error.message 
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
    
    if (!conversations) {
      console.error('Failed to get chatConversations collection');
      return NextResponse.json({ 
        success: false,
        error: "Database connection error" 
      }, { status: 500 });
    }
    
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
    console.error('POST /api/chat/conversations error:', error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to create conversation",
      details: error.message 
    }, { status: 500 });
  }
}
