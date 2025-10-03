'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, File, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip',
  'application/x-rar-compressed'
];

export default function ChatFileUpload({ onFileSelect, onError, disabled = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    // Check file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isAllowedFile = ALLOWED_FILE_TYPES.includes(file.type);
    
    if (!isImage && !isAllowedFile) {
      return 'File type not supported. Please use images, PDF, DOC, TXT, or ZIP files.';
    }

    return null;
  };

  const processFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      onError(errors.join('\\n'));
      return;
    }

    // Create previews for images
    const newPreviews = [];
    validFiles.forEach((file) => {
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            id: Date.now() + Math.random(),
            file,
            type: 'image',
            url: e.target.result,
            name: file.name,
            size: file.size
          });
          setPreviews(prev => [...prev, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      } else {
        newPreviews.push({
          id: Date.now() + Math.random(),
          file,
          type: 'file',
          name: file.name,
          size: file.size
        });
      }
    });

    // Add non-image files immediately
    const nonImageFiles = newPreviews.filter(p => p.type === 'file');
    if (nonImageFiles.length > 0) {
      setPreviews(prev => [...prev, ...nonImageFiles]);
    }

    // Send files to parent
    validFiles.forEach(file => onFileSelect(file));
  }, [onFileSelect, onError]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    e.target.value = '';
  };

  const removePreview = (id) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📁';
    }
  };

  return (
    <div className="space-y-3">
      {/* File Input Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_FILE_TYPES].join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />
        
        <div className="text-center">
          <Upload className={`mx-auto h-8 w-8 ${disabled ? 'text-gray-400' : 'text-gray-500'} mb-2`} />
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Images, PDF, DOC, TXT, ZIP up to 10MB
          </p>
        </div>
      </div>

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700">Files to upload:</p>
          {previews.map((preview) => (
            <div
              key={preview.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border"
            >
              {preview.type === 'image' ? (
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={preview.url}
                    alt={preview.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">{getFileIcon(preview.name)}</span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {preview.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(preview.size)}
                </p>
              </div>
              
              <button
                onClick={() => removePreview(preview.id)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}