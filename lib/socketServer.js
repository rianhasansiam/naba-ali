// WebSocket server for real-time chat
// This runs on the server and handles Socket.io connections

// WebSocket server for real-time chat
// Export a function to initialize Socket.io on an existing HTTP server.

const { Server } = require('socket.io');

// In-memory stores (replace with Redis or DB-backed stores for scaling)
const onlineAdmins = new Set();
const userSocketMap = new Map(); // userId -> socketId
const userPresence = new Map(); // userId -> { online, lastSeen, role, socketId }

// Cleanup stale data to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const MAX_IDLE_TIME = 24 * 60 * 60 * 1000; // 24 hours

setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [userId, presence] of userPresence.entries()) {
    if (!presence.online && (now - presence.lastSeen.getTime() > MAX_IDLE_TIME)) {
      userPresence.delete(userId);
      userSocketMap.delete(userId);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} stale user presence records`);
  }
}, CLEANUP_INTERVAL);

function initializeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? [
            'https://skyzonee.com',
            'https://www.skyzonee.com'
          ]
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    // Performance and reliability options
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6,
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('\u2705 WebSocket connected:', socket.id);

    // JOIN event
    socket.on('join', (userId, role = 'user') => {
      if (!userId) {
        socket.emit('error', { message: 'userId is required' });
        return;
      }

      socket.join(userId);
      userSocketMap.set(userId, socket.id);
      userPresence.set(userId, { online: true, lastSeen: new Date(), role, socketId: socket.id });

      if (role === 'admin') {
        onlineAdmins.add(socket.id);
        console.log(`\ud83d\udc68\u200d\ud83d\udcbc Admin joined: ${userId} (${onlineAdmins.size} admins online)`);
        io.emit('admin-status', { available: onlineAdmins.size > 0, count: onlineAdmins.size, timestamp: new Date() });
      } else {
        console.log(`\ud83d\udc64 User joined: ${userId} (role: ${role})`);
        onlineAdmins.forEach(adminSocketId => {
          io.to(adminSocketId).emit('user-presence', { userId, online: true, role, timestamp: new Date() });
        });
      }

      socket.emit('joined', { userId, role, socketId: socket.id, timestamp: new Date() });
    });

    // SEND-MESSAGE
    socket.on('send-message', (data) => {
      try {
        const { conversationId, message, senderId, senderName, senderRole } = data || {};
        if (!conversationId || !message || !senderId) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        const messageData = { conversationId, message, senderId, senderName, senderRole, timestamp: new Date() };
        io.to(conversationId).emit('new-message', messageData);

        if (senderRole !== 'admin') {
          let notified = 0;
          onlineAdmins.forEach(adminSocketId => {
            io.to(adminSocketId).emit('new-user-message', messageData);
            notified++;
          });
          if (notified > 0) console.log(`\ud83d\udd14 Notified ${notified} admin(s) of new user message`);
        }
      } catch (err) {
        console.error('Error in send-message handler', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing
    socket.on('typing', ({ conversationId, userName } = {}) => {
      if (!conversationId) return;
      onlineAdmins.forEach(adminSocketId => {
        io.to(adminSocketId).emit('user-typing', { conversationId, userName, timestamp: new Date() });
      });
    });

    socket.on('stop-typing', ({ conversationId } = {}) => {
      if (!conversationId) return;
      onlineAdmins.forEach(adminSocketId => {
        io.to(adminSocketId).emit('user-stop-typing', { conversationId, timestamp: new Date() });
      });
    });

    // Admin typing
    socket.on('admin-typing', ({ conversationId, adminName } = {}) => {
      if (!conversationId) return;
      io.to(conversationId).emit('admin-typing', { conversationId, adminName, timestamp: new Date() });
    });

    socket.on('admin-stop-typing', ({ conversationId } = {}) => {
      if (!conversationId) return;
      io.to(conversationId).emit('admin-stop-typing', { conversationId, timestamp: new Date() });
    });

    // Message status
    socket.on('message-delivered', ({ messageId, conversationId } = {}) => {
      if (!messageId || !conversationId) return;
      onlineAdmins.forEach(adminSocketId => {
        io.to(adminSocketId).emit('message-status', { messageId, status: 'delivered', conversationId, timestamp: new Date() });
      });
    });

    socket.on('message-read', ({ messageId, conversationId } = {}) => {
      if (!messageId || !conversationId) return;
      io.to(conversationId).emit('message-status', { messageId, status: 'read', conversationId, timestamp: new Date() });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('\u274c WebSocket disconnected:', socket.id);

      let disconnectedUserId = null;
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSocketMap.delete(userId);
          userPresence.set(userId, { online: false, lastSeen: new Date() });
          break;
        }
      }

      if (onlineAdmins.has(socket.id)) {
        onlineAdmins.delete(socket.id);
        if (onlineAdmins.size === 0) {
          io.emit('admin-status', { available: false, count: 0, timestamp: new Date() });
        }
      } else if (disconnectedUserId) {
        onlineAdmins.forEach(adminSocketId => {
          io.to(adminSocketId).emit('user-presence', { userId: disconnectedUserId, online: false, lastSeen: new Date() });
        });
      }
    });
  });

  return io;
}

module.exports = initializeSocketServer;
