/**
 * Server-side realtime publisher for cache invalidation events.
 *
 * The canonical Socket.io server is the separate skyzonee_websocket service.
 * API routes call publishRealtimeEvent() after successful mutations. If the
 * service is unavailable or not configured, mutations still succeed and Next.js
 * revalidation remains the fallback.
 */

const REALTIME_EVENTS = new Set([
  'products:changed',
  'categories:changed',
  'orders:changed',
  'reviews:changed',
]);

function getRealtimeServerUrl() {
  return process.env.SOCKET_SERVER_URL
    || process.env.WEBSOCKET_SERVER_URL
    || process.env.NEXT_PUBLIC_SOCKET_URL
    || '';
}

function getRealtimeEventSecret() {
  return process.env.SOCKET_EVENT_SECRET
    || process.env.WEBSOCKET_EVENT_SECRET
    || process.env.REALTIME_EVENT_SECRET
    || '';
}

function toSerializableValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(toSerializableValue);
  }

  if (typeof value === 'object') {
    if (typeof value.toHexString === 'function') {
      return value.toHexString();
    }

    if (value.constructor?.name === 'ObjectId' && typeof value.toString === 'function') {
      return value.toString();
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, toSerializableValue(nestedValue)])
    );
  }

  return value;
}

function toSerializablePayload(payload = {}) {
  return toSerializableValue(payload) || {};
}

async function postRealtimeEndpoint(path, body, label) {
  const serverUrl = getRealtimeServerUrl();
  const eventSecret = getRealtimeEventSecret();

  if (!serverUrl || !eventSecret) {
    console.warn(`Realtime publish skipped: ${label}. Configure SOCKET_SERVER_URL and SOCKET_EVENT_SECRET.`);
    return false;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${serverUrl.replace(/\/$/, '')}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-skyzonee-event-secret': eventSecret,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`Realtime publish failed: ${label} (${response.status})`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn(`Realtime publish unavailable: ${label}`, error?.message || error);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function publishRealtimeEvent(event, payload = {}) {
  if (!REALTIME_EVENTS.has(event)) {
    console.warn(`Unsupported realtime event skipped: ${event}`);
    return false;
  }

  return postRealtimeEndpoint(
    '/events/cache-invalidation',
    { event, payload: toSerializablePayload(payload) },
    event
  );
}

export async function publishChatMessage(message) {
  if (!message?.conversationId || !message?._id) {
    console.warn('Realtime chat message skipped: missing persisted message fields.');
    return false;
  }

  return postRealtimeEndpoint(
    '/events/chat-message',
    { message: toSerializablePayload(message) },
    `chat-message:${message.conversationId}`
  );
}
