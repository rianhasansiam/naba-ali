'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import { Send, MessageCircle, User } from 'lucide-react';

export default function AdminChatPanel() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (session?.user) {
      // Connect to WebSocket
      socketRef.current = io(window.location.origin, {
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Admin connected to chat server');
        socketRef.current.emit('join', session.user.id, 'admin');
      });

      // Listen for new messages
      socketRef.current.on('new-message', (message) => {
        if (selectedConversation && message.conversationId === selectedConversation.userId) {
          setMessages(prev => [...prev, message]);
        }
      });

      // Listen for new user messages
      socketRef.current.on('new-user-message', () => {
        // Refresh conversations list
        fetchConversations();
      });

      // Fetch conversations on mount
      fetchConversations();

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations');
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversation.userId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
        
        // Mark messages as read
        await fetch('/api/chat/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: conversation.userId })
        });

        // Update unread count locally
        setConversations(prev =>
          prev.map(conv =>
            conv.userId === conversation.userId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.userId,
          message: newMessage
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Emit via socket for real-time delivery
        socketRef.current?.emit('send-message', {
          conversationId: selectedConversation.userId,
          message: newMessage,
          senderId: session.user.id,
          senderName: 'Support Team'
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

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle size={24} />
              Customer Chats
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.userId}
                  onClick={() => selectConversation(conv)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedConversation?.userId === conv.userId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {conv.userName?.[0]?.toUpperCase() || <User size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 truncate">{conv.userName}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.userEmail}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage || 'No messages yet'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold">
                    {selectedConversation.userName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedConversation.userName}</h3>
                    <p className="text-sm text-gray-600">{selectedConversation.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.senderRole === 'admin'
                            ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-br-none'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1 opacity-90">{msg.senderName}</p>
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderRole === 'admin' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
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
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
