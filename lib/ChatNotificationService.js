'use client';

/**
 * Enhanced Chat Notification Service
 * Handles browser notifications, sound alerts, and visual indicators
 */
class ChatNotificationService {
  constructor() {
    this.sounds = {
      message: null,
      notification: null
    };
    this.initializeSounds();
    this.requestPermission();
  }

  // Initialize sound effects
  initializeSounds() {
    try {
      // Create audio contexts for different sounds
      this.sounds.message = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAxMou');
      this.sounds.notification = new Audio('data:audio/wav;base64,UklGRmwDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUgDAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4');
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.warn('Notification permission denied:', error);
      }
    }
  }

  // Play sound notification
  playSound(type = 'message') {
    try {
      if (this.sounds[type]) {
        this.sounds[type].currentTime = 0;
        this.sounds[type].play().catch(e => console.warn('Sound play failed:', e));
      }
    } catch (error) {
      console.warn('Sound play error:', error);
    }
  }

  // Show browser notification
  showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const defaultOptions = {
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'chat-message',
        requireInteraction: false,
        silent: false
      };

      const notification = new Notification(title, {
        ...defaultOptions,
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  }

  // Show message notification with sound
  notifyNewMessage(senderName, message, isAdmin = false) {
    const title = isAdmin ? 'Admin Reply' : `Message from ${senderName}`;
    const body = message.length > 50 ? message.substring(0, 50) + '...' : message;
    
    this.showNotification(title, {
      body,
      icon: isAdmin ? '/admin-avatar.png' : '/user-avatar.png'
    });

    this.playSound('message');

    // Show visual indicator if page is not visible
    if (document.hidden) {
      this.showVisualIndicator();
    }
  }

  // Show visual indicator in title
  showVisualIndicator() {
    if (typeof document !== 'undefined') {
      const originalTitle = document.title;
      let flashCount = 0;
      
      const flash = setInterval(() => {
        document.title = flashCount % 2 === 0 ? '🔔 New Message!' : originalTitle;
        flashCount++;
        
        if (flashCount >= 10) {
          clearInterval(flash);
          document.title = originalTitle;
        }
      }, 1000);

      // Stop flashing when user returns to tab
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          clearInterval(flash);
          document.title = originalTitle;
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
  }

  // Notify about typing
  notifyTyping(userName) {
    // Show subtle notification
    this.playSound('notification');
  }

  // Check if notifications are supported and enabled
  isSupported() {
    return 'Notification' in window;
  }

  // Check if permission is granted
  hasPermission() {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  // Get notification permission status
  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'not-supported';
    }
    return Notification.permission;
  }
}

// Create singleton instance
const chatNotificationService = new ChatNotificationService();

export default chatNotificationService;

// Helper hooks for React components
export const useChatNotifications = () => {
  return {
    notifyNewMessage: (senderName, message, isAdmin) => 
      chatNotificationService.notifyNewMessage(senderName, message, isAdmin),
    notifyTyping: (userName) => 
      chatNotificationService.notifyTyping(userName),
    playSound: (type) => 
      chatNotificationService.playSound(type),
    hasPermission: () => 
      chatNotificationService.hasPermission(),
    requestPermission: () => 
      chatNotificationService.requestPermission(),
    isSupported: () => 
      chatNotificationService.isSupported()
  };
};