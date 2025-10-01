/**
 * Chat Message Schema for MongoDB
 * Simple and easy to understand structure
 */

// Message structure in MongoDB:
// {
//   _id: ObjectId,
//   conversationId: String (userId),
//   senderId: String (userId or 'admin'),
//   senderName: String,
//   message: String,
//   timestamp: Date,
//   isRead: Boolean
// }

export const MessageSchema = {
  conversationId: String,  // The user's ID (one conversation per user)
  senderId: String,         // Who sent the message
  senderName: String,       // Sender's name for display
  message: String,          // The actual message text
  timestamp: Date,          // When message was sent
  isRead: Boolean           // Has the message been read?
};

// Conversation structure (optional, for tracking):
// {
//   _id: ObjectId,
//   userId: String,
//   userName: String,
//   userEmail: String,
//   lastMessage: String,
//   lastMessageTime: Date,
//   unreadCount: Number
// }

export const ConversationSchema = {
  userId: String,           // Customer's user ID or guest ID
  userName: String,         // Customer's name or "Guest User"
  userEmail: String,        // Customer's email or "guest@temporary.com"
  isGuest: Boolean,         // Is this a guest user? (true/false)
  lastMessage: String,      // Preview of last message
  lastMessageTime: Date,    // When last message was sent
  unreadCount: Number,      // Number of unread messages for admin
  createdAt: Date,          // When conversation was created
  expiresAt: Date           // For guests: auto-delete after 12 hours
};
