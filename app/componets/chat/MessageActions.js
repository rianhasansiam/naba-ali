'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit2, Trash2, Reply, Pin, Copy, CheckCheck } from 'lucide-react';

export default function MessageActions({ 
  message, 
  isMyMessage, 
  isAdmin,
  onEdit, 
  onDelete, 
  onReply, 
  onPin, 
  onCopy,
  disabled = false 
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(message);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
    setShowMenu(false);
  };

  const handleAction = (action, handler) => {
    if (disabled) return;
    handler?.(message);
    setShowMenu(false);
  };

  // Don't show actions for system messages or if disabled
  if (disabled || message.type === 'system') {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all duration-200 hover:bg-gray-100 ${
          showMenu ? 'opacity-100' : ''
        }`}
        title="Message actions"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </button>

      {/* Actions Menu */}
      {showMenu && (
        <div className={`absolute z-10 mt-1 py-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[160px] ${
          isMyMessage ? 'right-0' : 'left-0'
        }`}>
          {/* Reply */}
          <button
            onClick={() => handleAction('reply', onReply)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy text
              </>
            )}
          </button>

          {/* Pin (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => handleAction('pin', onPin)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pin className="w-4 h-4" />
              {message.pinned ? 'Unpin' : 'Pin'} message
            </button>
          )}

          {/* Edit (Own messages only) */}
          {isMyMessage && (
            <button
              onClick={() => handleAction('edit', onEdit)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit message
            </button>
          )}

          {/* Delete (Own messages or Admin) */}
          {(isMyMessage || isAdmin) && (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => handleAction('delete', onDelete)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete message
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}