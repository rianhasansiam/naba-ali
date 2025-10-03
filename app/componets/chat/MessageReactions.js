'use client';

import { useState, useRef, useEffect } from 'react';

const REACTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' }
];

export default function MessageReactions({ 
  messageId, 
  reactions = {}, 
  onAddReaction, 
  onRemoveReaction,
  currentUserId,
  isMyMessage = false 
}) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const handleReactionClick = (emoji) => {
    const userReactions = reactions[emoji] || [];
    const hasReacted = userReactions.includes(currentUserId);

    if (hasReacted) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
    setShowPicker(false);
  };

  const getTotalReactions = () => {
    return Object.values(reactions).reduce((total, users) => total + users.length, 0);
  };

  const getTopReactions = () => {
    return Object.entries(reactions)
      .filter(([_, users]) => users.length > 0)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 3);
  };

  return (
    <div className={`relative flex items-center gap-1 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      {/* Existing Reactions */}
      {getTopReactions().map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => handleReactionClick(emoji)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-110 ${
            users.includes(currentUserId)
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={`${users.length} reaction${users.length !== 1 ? 's' : ''}`}
        >
          <span className="text-sm">{emoji}</span>
          <span className="font-medium">{users.length}</span>
        </button>
      ))}

      {/* Add Reaction Button */}
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
          title="Add reaction"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Reaction Picker */}
        {showPicker && (
          <div className={`absolute z-10 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 flex gap-1 ${
            isMyMessage ? 'right-0' : 'left-0'
          }`}>
            {REACTIONS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 hover:scale-125 transform"
                title={label}
              >
                <span className="text-lg">{emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Total reactions count (if many) */}
      {getTotalReactions() > 3 && (
        <span className="text-xs text-gray-500 ml-1">
          +{getTotalReactions() - getTopReactions().reduce((sum, [, users]) => sum + users.length, 0)} more
        </span>
      )}
    </div>
  );
}