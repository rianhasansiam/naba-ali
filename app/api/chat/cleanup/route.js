import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';

// Cleanup expired guest conversations and their messages
// This endpoint should be called by a cron job every hour
export async function GET(request) {
  try {
    // Simple API key check for security
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const conversations = await getCollection('chatConversations');
    const messages = await getCollection('chatMessages');
    
    const now = new Date();
    
    // Find all expired guest conversations
    const expiredConversations = await conversations.find({
      isGuest: true,
      expiresAt: { $lte: now }
    }).toArray();

    if (expiredConversations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired conversations found',
        deleted: 0
      });
    }

    // Get conversation IDs to delete
    const conversationIds = expiredConversations.map(conv => conv.userId);

    // Delete messages for these conversations
    const messagesResult = await messages.deleteMany({
      conversationId: { $in: conversationIds }
    });

    // Delete conversations
    const conversationsResult = await conversations.deleteMany({
      userId: { $in: conversationIds }
    });

    return NextResponse.json({
      success: true,
      message: 'Expired guest conversations cleaned up',
      deleted: {
        conversations: conversationsResult.deletedCount,
        messages: messagesResult.deletedCount
      }
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to cleanup expired conversations" 
    }, { status: 500 });
  }
}

// You can also call this manually for testing
export async function POST(request) {
  return GET(request);
}
