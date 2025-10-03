'use client';

import { X } from 'lucide-react';

export default function ReplyPreview({ 
  replyingTo, 
  onCancel, 
  isVisible = false 
}) {
  if (!isVisible || !replyingTo) return null;

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="mb-2 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 8l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-blue-800">
              Replying to {replyingTo.senderName}
            </span>
          </div>
          
          <div className="text-sm text-blue-700 bg-white/50 rounded px-2 py-1">
            {replyingTo.type === 'image' ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Image</span>
              </div>
            ) : replyingTo.type === 'file' ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span>{replyingTo.filename || 'File'}</span>
              </div>
            ) : (
              truncateText(replyingTo.message)
            )}
          </div>
        </div>
        
        <button
          onClick={onCancel}
          className="flex-shrink-0 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
          title="Cancel reply"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}