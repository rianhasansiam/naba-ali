'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronUp, ChevronDown, Calendar, User } from 'lucide-react';

export default function ChatSearch({ 
  messages = [], 
  onResultSelect, 
  onClose, 
  isVisible = false 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [filters, setFilters] = useState({
    sender: 'all', // 'all', 'user', 'admin'
    dateRange: 'all', // 'all', 'today', 'week', 'month'
    messageType: 'all' // 'all', 'text', 'image', 'file'
  });
  
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Focus input when search becomes visible
  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isVisible]);

  // Search messages when query or filters change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const now = new Date();
    const results = [];

    messages.forEach((message, index) => {
      // Text search
      const messageText = message.message?.toLowerCase() || '';
      const senderName = message.senderName?.toLowerCase() || '';
      const textMatch = messageText.includes(query) || senderName.includes(query);

      if (!textMatch) return;

      // Sender filter
      if (filters.sender !== 'all') {
        const isAdmin = message.senderRole === 'admin';
        if (filters.sender === 'admin' && !isAdmin) return;
        if (filters.sender === 'user' && isAdmin) return;
      }

      // Date filter
      if (filters.dateRange !== 'all') {
        const messageDate = new Date(message.timestamp);
        const daysDiff = (now - messageDate) / (1000 * 60 * 60 * 24);

        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 1) return;
            break;
          case 'week':
            if (daysDiff > 7) return;
            break;
          case 'month':
            if (daysDiff > 30) return;
            break;
        }
      }

      // Message type filter
      if (filters.messageType !== 'all') {
        const hasImage = message.attachments?.some(att => att.type === 'image');
        const hasFile = message.attachments?.some(att => att.type === 'file');
        
        switch (filters.messageType) {
          case 'text':
            if (hasImage || hasFile) return;
            break;
          case 'image':
            if (!hasImage) return;
            break;
          case 'file':
            if (!hasFile) return;
            break;
        }
      }

      // Highlight matching text
      const highlightedMessage = messageText.replace(
        new RegExp(`(${query})`, 'gi'),
        '<mark>$1</mark>'
      );

      results.push({
        ...message,
        originalIndex: index,
        highlightedMessage
      });
    });

    setSearchResults(results);
    setCurrentResultIndex(0);
  }, [searchQuery, filters, messages]);

  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setCurrentResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setCurrentResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (searchResults[currentResultIndex]) {
          onResultSelect(searchResults[currentResultIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const navigateResult = (direction) => {
    if (!searchResults.length) return;

    const newIndex = direction === 'next'
      ? currentResultIndex < searchResults.length - 1 ? currentResultIndex + 1 : 0
      : currentResultIndex > 0 ? currentResultIndex - 1 : searchResults.length - 1;

    setCurrentResultIndex(newIndex);
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={searchContainerRef}
      className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-10"
    >
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {currentResultIndex + 1} of {searchResults.length}
              </span>
              <div className="flex">
                <button
                  onClick={() => navigateResult('prev')}
                  className="p-1 rounded-l border border-gray-300 hover:bg-gray-50"
                  title="Previous result"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateResult('next')}
                  className="p-1 rounded-r border-l-0 border border-gray-300 hover:bg-gray-50"
                  title="Next result"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-3">
          <select
            value={filters.sender}
            onChange={(e) => setFilters(prev => ({ ...prev, sender: e.target.value }))}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All senders</option>
            <option value="user">Users only</option>
            <option value="admin">Admin only</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>

          <select
            value={filters.messageType}
            onChange={(e) => setFilters(prev => ({ ...prev, messageType: e.target.value }))}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All types</option>
            <option value="text">Text only</option>
            <option value="image">Images</option>
            <option value="file">Files</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="max-h-64 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {searchResults.map((result, index) => (
                <button
                  key={result._id || index}
                  onClick={() => onResultSelect(result)}
                  className={`w-full p-3 text-left hover:bg-blue-50 transition-colors ${
                    index === currentResultIndex ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-semibold">
                        {result.senderName?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {result.senderName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(result.timestamp)}
                        </span>
                      </div>
                      
                      <div 
                        className="text-sm text-gray-700 truncate"
                        dangerouslySetInnerHTML={{ 
                          __html: result.highlightedMessage 
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}