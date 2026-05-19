/**
 * lib/socketIO.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin bridge so Next.js API routes can access the Socket.io `io` instance
 * WITHOUT importing lib/socketServer.js (which requires 'socket.io' — a
 * package that is NOT bundled by webpack; it lives only in the custom server).
 *
 * How it works:
 *   1. server.js calls initializeSocketServer(httpServer) → socketServer.js
 *      writes _io into global.__skyzonee_io directly.
 *   2. API route handlers call getIO()?.emit(...) to broadcast events.
 *   3. Webpack never sees 'socket.io' — only this file is imported.
 *
 * IMPORTANT: Works only in the custom Node.js server (server.js).
 * In serverless/edge environments getIO() returns null (events are skipped).
 */

// Use a Node.js global so the reference survives Next.js hot-reload in dev.
const g = typeof globalThis !== 'undefined' ? globalThis : global;

/**
 * Returns the active Socket.io Server instance, or null if not yet initialized.
 * @returns {import('socket.io').Server | null}
 */
export function getIO() {
  return g.__skyzonee_io ?? null;
}
