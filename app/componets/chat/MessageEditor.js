'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function MessageEditor({ 
  message, 
  onSave, 
  onCancel, 
  isVisible = false 
}) {
  const [editedText, setEditedText] = useState(message?.message || '');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // Focus textarea when editor becomes visible
  useEffect(() => {
    if (isVisible && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editedText.length, editedText.length);
    }
  }, [isVisible, editedText.length]);

  // Reset text when message changes
  useEffect(() => {
    setEditedText(message?.message || '');
  }, [message?.message]);

  const handleSave = async () => {
    const trimmedText = editedText.trim();
    
    if (!trimmedText) {
      return; // Don't save empty messages
    }

    if (trimmedText === message.message) {
      onCancel(); // No changes made
      return;
    }

    setIsLoading(true);
    try {
      await onSave(message._id, trimmedText);
    } catch (error) {
      console.error('Failed to save message:', error);
      // Keep editor open on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Edit your message..."
          className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={Math.min(Math.max(editedText.split('\n').length, 1), 5)}
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Press Enter to save, Esc to cancel
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading || !editedText.trim() || editedText.trim() === message.message}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}