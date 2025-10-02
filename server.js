// Custom server for Socket.io support
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: dev 
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : 'https://skyzonee.com',
      methods: ['GET', 'POST']
    }
  });

  // Store online admins and user socket mapping
  const onlineAdmins = new Set();
  const userSocketMap = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins their own room
    socket.on('join', (userId, role) => {
      socket.join(userId);
      userSocketMap.set(userId, socket.id);
      
      if (role === 'admin') {
        onlineAdmins.add(socket.id);
        // Notify all users that admin is online
        io.emit('admin-status', { online: true });
      }

      console.log(`User ${userId} (${role}) joined`);
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

      // If message is from user, notify all admins
      if (!onlineAdmins.has(socket.id)) {
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

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io server initialized`);
    });
});
