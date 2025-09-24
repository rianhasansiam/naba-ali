import { connectToDatabase } from './mongodb'

/**
 * Utility functions for user management in the authentication system
 */

/**
 * Create or update user in database
 * @param {Object} userData - User data from authentication provider
 * @param {string} provider - Authentication provider (google, credentials, etc.)
 * @param {Object} profileData - Additional profile data from OAuth providers
 * @returns {Promise<Object>} User object with database ID
 */
export async function createOrUpdateUser(userData, provider = 'credentials', profileData = null) {
  try {
    const { database } = await connectToDatabase()
    
    // Check if user exists
    const existingUser = await database.collection("users").findOne({ 
      email: userData.email.toLowerCase() 
    })
    
    if (existingUser) {
      // Update existing user
      const updateData = {
        name: userData.name || existingUser.name,
        image: userData.image || existingUser.image,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
        // Ensure user has a role
        ...((!existingUser.role) && { role: 'user' }),
        // Update profile data if provided
        ...(profileData && { profileData })
      }
      
      await database.collection("users").updateOne(
        { _id: existingUser._id },
        { $set: updateData }
      )
      
      return {
        id: existingUser._id.toString(),
        email: existingUser.email,
        name: updateData.name,
        image: updateData.image,
        role: existingUser.role || 'user',
        provider: existingUser.provider || provider
      }
    } else {
      // Create new user
      const newUser = {
        email: userData.email.toLowerCase(),
        name: userData.name || userData.email.split('@')[0],
        image: userData.image || null,
        role: 'user',
        provider,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        emailVerified: provider === 'google' ? new Date() : null,
        ...(profileData && { profileData })
      }
      
      const result = await database.collection("users").insertOne(newUser)
      
      return {
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
        role: newUser.role,
        provider: newUser.provider
      }
    }
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error)
    throw error
  }
}

/**
 * Get user by email from database
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function getUserByEmail(email) {
  try {
    const { database } = await connectToDatabase()
    const user = await database.collection("users").findOne({ 
      email: email.toLowerCase() 
    })
    
    if (user) {
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role || 'user',
        provider: user.provider,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt
      }
    }
    
    return null
  } catch (error) {
    console.error('Error in getUserByEmail:', error)
    return null
  }
}

/**
 * Update user's last login time
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export async function updateLastLogin(userId) {
  try {
    const { database } = await connectToDatabase()
    const { ObjectId } = await import('mongodb')
    
    await database.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          lastLoginAt: new Date(),
          updatedAt: new Date()
        }
      }
    )
    
    return true
  } catch (error) {
    console.error('Error in updateLastLogin:', error)
    return false
  }
}

/**
 * Check if user exists in database
 * @param {string} email - User email
 * @returns {Promise<boolean>} Whether user exists
 */
export async function userExists(email) {
  try {
    const { database } = await connectToDatabase()
    const user = await database.collection("users").findOne({ 
      email: email.toLowerCase() 
    })
    
    return !!user
  } catch (error) {
    console.error('Error in userExists:', error)
    return false
  }
}