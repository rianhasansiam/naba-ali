// WebSocket server for real-time chat
// This runs on the server and handles Socket.io connections

import { Server } from 'socket.io';

// Store to track which admin is online
const onlineAdmins = new Set();
const userSocketMap = new Map(); // userId -> socketId

export function initializeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://skyzonee.com' 
        : ['http://localhost:3001', 'http://127.0.0.1:3001'],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins their own room for private messages
    socket.on('join', (userId, role) => {
      socket.join(userId);
      userSocketMap.set(userId, socket.id);
      
      if (role === 'admin') {
        onlineAdmins.add(socket.id);
        // Notify all users that admin is online
        io.emit('admin-status', { online: true });
      }

      console.log(`User ${userId} joined their room`);
    });

    // Send message
    socket.on('send-message', (data) => {
      const { conversationId, message, senderId, senderName } = data;
      
      // Send to the conversation room
      io.to(conversationId).emit('new-message', {
        conversationId,
        senderId,
        senderName,
        message,
        timestamp: new Date()
      });

      // If message is from user, notify admin
      if (!onlineAdmins.has(socket.id)) {
        // Send to all admins
        onlineAdmins.forEach(adminSocketId => {
          io.to(adminSocketId).emit('new-user-message', {
            conversationId,
            senderId,
            senderName,
            message
          });
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { conversationId, userName } = data;
      socket.to(conversationId).emit('user-typing', { conversationId, userName });
    });

    socket.on('stop-typing', (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit('user-stop-typing', { conversationId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove from admin list if admin
      if (onlineAdmins.has(socket.id)) {
        onlineAdmins.delete(socket.id);
        // Check if any admin is still online
        if (onlineAdmins.size === 0) {
          io.emit('admin-status', { online: false });
        }
      }

      // Remove from user map
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });

  return io;
}

export default initializeSocketServer;
