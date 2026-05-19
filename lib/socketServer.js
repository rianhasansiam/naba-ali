/**
 * lib/socketServer.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed:
 * - Clients can no longer self-declare their role as 'admin'
 * - userId and role are validated server-side via NextAuth session token
 * - Only verified admins join admin channels
 * - In-memory stores documented as dev/single-instance only
 *
 * NOTE: For multi-instance/production scaling, replace in-memory Maps
 * with @socket.io/redis-adapter.
 */

const { Server } = require('socket.io');
const { getServerSession } = require('next-auth');

// Shared io reference stored in Node.js global so API routes can reach it
// via lib/socketIO.js without importing this file (which would pull socket.io into webpack).
const g = globalThis;

// Module-level reference to the Socket.io Server instance
let _io = null;

// ─── In-memory stores (single-instance only — use Redis adapter for scaling) ──
const onlineAdmins  = new Set();          // socket IDs of verified admin sockets
const userSocketMap = new Map();          // userId → socketId
const userPresence  = new Map();          // userId → { online, lastSeen, role, socketId }

// ─── Stale-data cleanup ───────────────────────────────────────────────────────
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const MAX_IDLE_TIME    = 24 * 60 * 60 * 1000; // 24 hours

setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [userId, presence] of userPresence.entries()) {
    if (!presence.online && now - new Date(presence.lastSeen).getTime() > MAX_IDLE_TIME) {
      userPresence.delete(userId);
      userSocketMap.delete(userId);
      cleaned++;
    }
  }
  if (cleaned > 0) console.log(`🧹 Cleaned ${cleaned} stale presence records`);
}, CLEANUP_INTERVAL);

// ─── Auth helper — extracts verified session from NextAuth cookie ──────────────
async function getSessionFromSocket(socket) {
  try {
    // socket.request contains the HTTP upgrade request with cookies
    const req = socket.request;
    const session = await getServerSession(req, {}, {
      secret: process.env.NEXTAUTH_SECRET,
    });
    return session?.user || null;
  } catch {
    return null;
  }
}

// ─── Main initializer ─────────────────────────────────────────────────────────
function initializeSocketServer(httpServer) {
  _io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? ['https://skyzonee.com', 'https://www.skyzonee.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6,
    transports: ['websocket', 'polling'],
  });

  // ─── Connection middleware — authenticate before any events ────────────────
  _io.use(async (socket, next) => {
    try {
      // Allow unauthenticated connections for guest chat only
      // Role will be set to 'guest' and validated per-event
      socket._verifiedUser = await getSessionFromSocket(socket);
      next();
    } catch (err) {
      next(new Error('Authentication check failed'));
    }
  });

  _io.on('connection', (socket) => {
    console.log('✅ WebSocket connected:', socket.id);

    // ── JOIN ─────────────────────────────────────────────────────────────────
    socket.on('join', (requestedUserId) => {
      const verifiedUser = socket._verifiedUser;

      // Determine actual userId and role from verified session
      let userId, role;

      if (verifiedUser) {
        userId = verifiedUser.id;
        role   = verifiedUser.role || 'user'; // role from DB via NextAuth session
      } else {
        // Guest — userId must start with 'guest_', role is always 'user'
        if (!requestedUserId || !String(requestedUserId).startsWith('guest_')) {
          socket.emit('error', { message: 'Invalid guest session' });
          return;
        }
        userId = requestedUserId;
        role   = 'user';
      }

      socket.join(userId);
      userSocketMap.set(userId, socket.id);
      userPresence.set(userId, { online: true, lastSeen: new Date(), role, socketId: socket.id });

      if (role === 'admin') {
        onlineAdmins.add(socket.id);
        console.log(`👨‍💼 Admin joined: ${userId} (${onlineAdmins.size} admins online)`);
        _io.emit('admin-status', { available: onlineAdmins.size > 0, count: onlineAdmins.size, timestamp: new Date() });
      } else {
        console.log(`👤 User joined: ${userId} (role: ${role})`);
        onlineAdmins.forEach((adminSocketId) => {
          _io.to(adminSocketId).emit('user-presence', { userId, online: true, role, timestamp: new Date() });
        });
      }

      socket.emit('joined', { userId, role, socketId: socket.id, timestamp: new Date() });
    });

    // ── SEND-MESSAGE ─────────────────────────────────────────────────────────
    socket.on('send-message', (data) => {
      try {
        const { conversationId, message, senderName } = data || {};
        const verifiedUser = socket._verifiedUser;

        if (!conversationId || !message) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        // Message length guard
        if (String(message).length > 2000) {
          socket.emit('error', { message: 'Message exceeds 2000 character limit' });
          return;
        }

        // Derive sender identity from verified session
        let senderId, resolvedSenderName, senderRole;
        if (verifiedUser) {
          senderId             = verifiedUser.id;
          resolvedSenderName   = senderName || verifiedUser.name || verifiedUser.email;
          senderRole           = verifiedUser.role || 'user';
        } else {
          // Guest
          if (!conversationId.startsWith('guest_')) {
            socket.emit('error', { message: 'Unauthorized' });
            return;
          }
          senderId           = conversationId;
          resolvedSenderName = senderName || 'Guest';
          senderRole         = 'user';
        }

        const messageData = {
          conversationId,
          message: String(message).trim(),
          senderId,
          senderName: resolvedSenderName,
          senderRole,
          timestamp: new Date(),
        };

        _io.to(conversationId).emit('new-message', messageData);

        if (senderRole !== 'admin') {
          onlineAdmins.forEach((adminSocketId) => {
            _io.to(adminSocketId).emit('new-user-message', messageData);
          });
        }
      } catch (err) {
        console.error('send-message handler error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ── TYPING ───────────────────────────────────────────────────────────────
    socket.on('typing', ({ conversationId, userName } = {}) => {
      if (!conversationId) return;
      onlineAdmins.forEach((adminSocketId) => {
        _io.to(adminSocketId).emit('user-typing', { conversationId, userName, timestamp: new Date() });
      });
    });

    socket.on('stop-typing', ({ conversationId } = {}) => {
      if (!conversationId) return;
      onlineAdmins.forEach((adminSocketId) => {
        _io.to(adminSocketId).emit('user-stop-typing', { conversationId, timestamp: new Date() });
      });
    });

    socket.on('admin-typing', ({ conversationId, adminName } = {}) => {
      if (!conversationId) return;
      // Verify this socket is actually an admin before broadcasting
      if (!onlineAdmins.has(socket.id)) return;
      _io.to(conversationId).emit('admin-typing', { conversationId, adminName, timestamp: new Date() });
    });

    socket.on('admin-stop-typing', ({ conversationId } = {}) => {
      if (!conversationId) return;
      if (!onlineAdmins.has(socket.id)) return;
      _io.to(conversationId).emit('admin-stop-typing', { conversationId, timestamp: new Date() });
    });

    // ── MESSAGE STATUS ────────────────────────────────────────────────────────
    socket.on('message-delivered', ({ messageId, conversationId } = {}) => {
      if (!messageId || !conversationId) return;
      onlineAdmins.forEach((adminSocketId) => {
        _io.to(adminSocketId).emit('message-status', { messageId, status: 'delivered', conversationId, timestamp: new Date() });
      });
    });

    socket.on('message-read', ({ messageId, conversationId } = {}) => {
      if (!messageId || !conversationId) return;
      _io.to(conversationId).emit('message-status', { messageId, status: 'read', conversationId, timestamp: new Date() });
    });

    // ── DISCONNECT ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected:', socket.id);

      let disconnectedUserId = null;
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSocketMap.delete(userId);
          userPresence.set(userId, { online: false, lastSeen: new Date() });
          break;
        }
      }

      if (onlineAdmins.has(socket.id)) {
        onlineAdmins.delete(socket.id);
        _io.emit('admin-status', {
          available: onlineAdmins.size > 0,
          count: onlineAdmins.size,
          timestamp: new Date(),
        });
      } else if (disconnectedUserId) {
        onlineAdmins.forEach((adminSocketId) => {
          _io.to(adminSocketId).emit('user-presence', {
            userId: disconnectedUserId,
            online: false,
            lastSeen: new Date(),
          });
        });
      }
    });
  });

  // Store in global so lib/socketIO.js getIO() can access it from API routes
  g.__skyzonee_io = _io;
  return _io;
}

module.exports = initializeSocketServer;
