import { auth } from './auth';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if the request is from an allowed origin
 * @param {Request} request - The incoming request
 * @returns {Response|null} - Error response if blocked, null if allowed
 */
export function checkOrigin(request) {
  const origin = request.headers.get('origin') || '';
  
  // In development, allow localhost origins
  const allowedOrigins = isDevelopment 
    ? [
        'https://skyzonee.com',
        'https://www.skyzonee.com',
        'http://localhost:3000',
        'http://localhost:3001',
      ]
    : [
        'https://skyzonee.com',
        'https://www.skyzonee.com',
      ];

  // If there's an origin header (cross-origin request), check if it's allowed
  if (origin && !allowedOrigins.includes(origin)) {
    return forbiddenResponse(`Origin ${origin} is not allowed to access this API`);
  }

  // No origin header (same-origin or direct API call) - allow it
  return null;
}

/**
 * Check if user is authenticated
 * @returns {Promise<Object|null>} - User session or null
 */
export async function isAuthenticated() {
  try {
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user is admin
 * @returns {Promise<boolean>} - True if user is admin
 */
export async function isAdmin() {
  try {
    const session = await auth();
    return session?.user?.role === 'admin';
  } catch (error) {
    return false;
  }
}

/**
 * Create an unauthorized response
 * @param {string} message - Error message
 * @returns {Response} - NextResponse with 401 status
 */
export function unauthorizedResponse(message = 'Unauthorized access') {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Create a forbidden response
 * @param {string} message - Error message
 * @returns {Response} - NextResponse with 403 status
 */
export function forbiddenResponse(message = 'Access forbidden') {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Validate request method
 * @param {Request} request - The incoming request
 * @param {string[]} allowedMethods - Array of allowed methods
 * @returns {boolean} - True if method is allowed
 */
export function validateMethod(request, allowedMethods) {
  return allowedMethods.includes(request.method);
}
