'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';

export default function CustomerChatButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [guestId, setGuestId] = useState(null);
  const [guestName, setGuestName] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Generate or get guest ID from localStorage
  useEffect(() => {
    if (!session?.user) {
      let storedGuestId = localStorage.getItem('guestChatId');
      if (!storedGuestId) {
        storedGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guestChatId', storedGuestId);
      }
      setGuestId(storedGuestId);
      
      const storedGuestName = localStorage.getItem('guestChatName') || 'Guest User';
      setGuestName(storedGuestName);
    }
  }, [session]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOrCreateConversation = async () => {
    try {
      const userId = session?.user?.id || guestId;
      const userName = session?.user?.name || guestName;
      const userEmail = session?.user?.email || 'guest@temporary.com';
      const isGuest = !session?.user;

      // Create or get conversation
      const convRes = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          isGuest
        })
      });
      const convData = await convRes.json();
      
      if (convData.success) {
        setConversationId(convData.conversation.userId);
        
        // Fetch existing messages
        const msgRes = await fetch(`/api/chat/messages?conversationId=${convData.conversation.userId}`);
        const msgData = await msgRes.json();
        
        if (msgData.success) {
          setMessages(msgData.messages);
        }

        // Mark messages as read
        await fetch('/api/chat/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: convData.conversation.userId })
        });
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  // Initialize socket connection when chat opens
  useEffect(() => {
    if (isOpen) {
      // Initialize conversation
      fetchOrCreateConversation();

      // Get user ID (authenticated or guest)
      const userId = session?.user?.id || guestId;
      if (!userId) return;

      // Connect to WebSocket
      socketRef.current = io(window.location.origin, {
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to chat server');
        socketRef.current.emit('join', userId, 'user');
      });

      // Listen for new messages
      socketRef.current.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for typing indicator
      socketRef.current.on('user-typing', () => {
        setIsTyping(true);
      });

      socketRef.current.on('user-stop-typing', () => {
        setIsTyping(false);
      });

      // Listen for admin status
      socketRef.current.on('admin-status', (data) => {
        setIsAdminOnline(data.online);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, session, guestId, guestName]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      const userId = session?.user?.id || guestId;
      const userName = session?.user?.name || guestName;

      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: newMessage,
          userId,
          userName
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Emit via socket for real-time delivery
        socketRef.current?.emit('send-message', {
          conversationId,
          message: newMessage,
          senderId: userId,
          senderName: userName
        });

        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show button for everyone (authenticated or not)
  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center gap-2 group"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Customer Support
          </span>
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Customer Support</h3>
              <p className="text-xs text-blue-100">
                {isAdminOnline ? '🟢 Admin is online' : '🔴 Admin is offline'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Start a conversation with our support team</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const currentUserId = session?.user?.id || guestId;
                const isMyMessage = msg.senderId === currentUserId;
                
                return (
                  <div
                    key={index}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMyMessage
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        isMyMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
