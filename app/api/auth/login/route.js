import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import bcryptjs from 'bcryptjs'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { database } = await connectToDatabase()

    // Find user
    const user = await database.collection('users').findOne({
      email: email.toLowerCase()
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has a password (might be a Google OAuth user)
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account was created with Google. Please use Google Sign-In.' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    await database.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    )

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      image: user.image || null
    }

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userResponse
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}