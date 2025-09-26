/**
 * Profile Data Normalizer
 * Handles different user data structures from Google OAuth and credentials
 */

/**
 * Default profile image placeholder
 */
const DEFAULT_AVATAR = 'https://via.placeholder.com/150x150/e5e7eb/9ca3af?text=User';

/**
 * Normalize user data for consistent profile page display
 * @param {Object} userData - Raw user data from database
 * @returns {Object} Normalized user data
 */
export const normalizeUserData = (userData) => {
  if (!userData) {
    return {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatar: DEFAULT_AVATAR,
      name: '',
      role: 'user',
      provider: 'credentials',
      createdAt: null,
      lastLoginAt: null,
      emailVerified: null
    };
  }

  // Extract name parts
  const fullName = userData.name || '';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  // Determine avatar source
  let avatar = DEFAULT_AVATAR;
  if (userData.image) {
    // Google OAuth users or users with uploaded images
    avatar = userData.image;
  } else if (userData.profileData?.picture) {
    // Google OAuth users with picture in profileData
    avatar = userData.profileData.picture;
  }

  return {
    // Use _id as id for database compatibility
    id: userData._id || userData.id,
    
    // Name handling
    firstName,
    lastName,
    name: fullName,
    
    // Contact information
    email: userData.email || '',
    phone: userData.phone || null, // Use null instead of empty string for better handling
    
    // Avatar/Profile picture
    avatar,
    
    // User metadata
    role: userData.role || 'user',
    provider: userData.provider || 'credentials',
    createdAt: userData.createdAt,
    lastLoginAt: userData.lastLoginAt,
    emailVerified: userData.emailVerified,
    
    // Additional profile data
    profileData: userData.profileData || {}
  };
};

/**
 * Normalize complete profile data structure
 * @param {Object} profileData - Raw profile data including user, orders, addresses
 * @returns {Object} Normalized profile data
 */
export const normalizeProfileData = (profileData) => {
  if (!profileData) {
    return {
      user: normalizeUserData(null),
      orders: [],
      addresses: []
    };
  }

  return {
    user: normalizeUserData(profileData.user || profileData),
    orders: Array.isArray(profileData.orders) ? profileData.orders : [],
    addresses: Array.isArray(profileData.addresses) ? profileData.addresses : []
  };
};

/**
 * Prepare user data for API updates
 * @param {Object} formData - Form data from profile edit
 * @param {Object} originalUserData - Original user data
 * @returns {Object} API-ready user data
 */
export const prepareUserDataForUpdate = (formData, originalUserData) => {
  const normalized = normalizeUserData(originalUserData);
  
  // Reconstruct full name from first and last name
  const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
  
  return {
    name: fullName || formData.firstName || normalized.name,
    email: formData.email || normalized.email,
    phone: formData.phone?.trim() || "", // Use empty string instead of null for API compatibility
    // Keep original fields that shouldn't change
    _id: normalized.id,
    role: normalized.role,
    provider: normalized.provider,
    // Update timestamp
    updatedAt: new Date().toISOString()
  };
};