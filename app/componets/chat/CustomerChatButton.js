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
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [messageStatus, setMessageStatus] = useState({});
  const [lastSeen, setLastSeen] = useState(null);
  const [adminTyping, setAdminTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
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
    setIsLoadingMessages(true);
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
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Initialize socket connection when chat opens
  useEffect(() => {
    if (isOpen) {
      setIsConnecting(true);
      // Initialize conversation
      fetchOrCreateConversation();

      // Get user ID (authenticated or guest)
      const userId = session?.user?.id || guestId;
      if (!userId) {
        setIsConnecting(false);
        return;
      }

      // Connect to WebSocket
      socketRef.current = io(window.location.origin, {
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnecting(false);
        socketRef.current.emit('join', userId, 'user');
      });

      socketRef.current.on('disconnect', () => {
        setIsConnecting(true);
      });

      // Listen for new messages
      socketRef.current.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
        // Mark message as delivered if from admin
        if (message.senderId !== userId) {
          socketRef.current.emit('message-delivered', {
            messageId: message._id,
            conversationId: message.conversationId
          });
        }
      });

      // Enhanced typing indicators
      socketRef.current.on('admin-typing', (data) => {
        setAdminTyping(true);
        setTimeout(() => setAdminTyping(false), 3000);
      });
      
      socketRef.current.on('admin-stop-typing', () => {
        setAdminTyping(false);
      });

      // Message status updates
      socketRef.current.on('message-status', (data) => {
        setMessageStatus(prev => ({
          ...prev,
          [data.messageId]: data.status
        }));
      });

      // Enhanced admin status with last seen
      socketRef.current.on('admin-status', (data) => {
        setIsAdminOnline(data.online);
        if (data.lastSeen) {
          setLastSeen(new Date(data.lastSeen));
        }
      });

      // Admin presence updates
      socketRef.current.on('admin-presence', (data) => {
        setIsAdminOnline(data.online);
        setLastSeen(data.lastSeen ? new Date(data.lastSeen) : null);
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
    if (!newMessage.trim() || !conversationId || isSending) return;

    setIsSending(true);
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
    } finally {
      setIsSending(false);
    }
  };

  // Typing indicator functionality
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Emit typing event
    if (socketRef.current && conversationId) {
      socketRef.current.emit('typing', {
        conversationId,
        userName: session?.user?.name || guestName
      });
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator
      const timeout = setTimeout(() => {
        socketRef.current?.emit('stop-typing', { conversationId });
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      // Stop typing indicator immediately
      if (socketRef.current && conversationId) {
        socketRef.current.emit('stop-typing', { conversationId });
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
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
              <div className="flex items-center gap-2">
                {isConnecting ? (
                  <div className="w-3 h-3 border border-blue-300 rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isAdminOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                )}
                <p className="text-xs text-blue-100">
                  {isConnecting ? 'Connecting...' :
                   isAdminOnline ? 'Admin is online' : 
                   lastSeen ? `Last seen ${lastSeen.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}` : 
                   'Admin is offline'}
                </p>
              </div>
              {adminTyping && (
                <p className="text-xs text-green-300 animate-pulse">Admin is typing...</p>
              )}
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
            {isLoadingMessages ? (
              <div className="text-center text-gray-500 mt-20">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
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
                          ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-br-none'
                          : 'bg-white text-gray-800 shadow-sm rounded-bl-none border'
                      }`}
                    >
                      {!isMyMessage && (
                        <p className="text-xs font-medium text-gray-600 mb-1">{msg.senderName}</p>
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        isMyMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <p className="text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {isMyMessage && (
                          <div className="flex items-center gap-1">
                            {msg.status === 'sending' && (
                              <div className="w-3 h-3 border border-white rounded-full border-t-transparent animate-spin"></div>
                            )}
                            {msg.status === 'sent' && (
                              <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {msg.status === 'delivered' && (
                              <div className="flex -space-x-1">
                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {msg.status === 'read' && (
                              <div className="flex -space-x-1">
                                <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {msg.status === 'failed' && (
                              <svg className="w-3 h-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
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
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending || isConnecting}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
