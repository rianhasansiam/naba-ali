'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Calendar, 
  User, 
  AtSign, 
  MessageSquare, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Search
} from 'lucide-react';

export default function AllMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.Data);
      } else {
        console.error('Failed to fetch messages:', data.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setDeleteLoading(messageId);
      const response = await fetch(`/api/contacts/${messageId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(messages.filter(msg => msg._id !== messageId));
      } else {
        alert('Failed to delete message: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Toggle message status
  const toggleMessageStatus = async (messageId, currentStatus) => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    
    try {
      const response = await fetch(`/api/contacts/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(messages.map(msg => 
          msg._id === messageId 
            ? { ...msg, status: newStatus, updatedAt: new Date() }
            : msg
        ));
      } else {
        alert('Failed to update message status: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status');
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      message.status === filterStatus ||
      (filterStatus === 'unread' && !message.status); // Handle old messages without status
    
    return matchesSearch && matchesFilter;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get message stats
  const stats = {
    total: messages.length,
    unread: messages.filter(msg => msg.status !== 'read').length,
    read: messages.filter(msg => msg.status === 'read').length,
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-lg">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Messages</h1>
        <p className="text-gray-600">Manage customer inquiries and support messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          className="bg-white rounded-lg shadow-sm border p-4"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border p-4"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-xl font-semibold">{stats.unread}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border p-4"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MailOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-xl font-semibold">{stats.read}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border p-4"
          whileHover={{ y: -2 }}
        >
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="font-medium">Refresh</span>
          </button>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Customer messages will appear here when they contact you.'
              }
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                message.status === 'read' ? 'bg-gray-50' : 'border-l-4 border-l-blue-500'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{message.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <AtSign className="h-3 w-3" />
                            <span>{message.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(message.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {message.status === 'read' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="h-3 w-3" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          <Clock className="h-3 w-3" />
                          Unread
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <p className="font-medium text-gray-900 text-lg">{message.subject}</p>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => toggleMessageStatus(message._id, message.status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      message.status === 'read'
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {message.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  
                  <button
                    onClick={() => deleteMessage(message._id)}
                    disabled={deleteLoading === message._id}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {deleteLoading === message._id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}