import { NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { getUserByEmail, userExists } from '../../../../lib/userUtils'

export async function GET(request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user exists in database
    const exists = await userExists(session.user.email)
    
    if (exists) {
      const dbUser = await getUserByEmail(session.user.email)
      
      return NextResponse.json({
        message: 'User found in database',
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          provider: dbUser.provider,
          emailVerified: !!dbUser.emailVerified,
          createdAt: dbUser.createdAt,
          lastLoginAt: dbUser.lastLoginAt
        },
        session: {
          email: session.user.email,
          name: session.user.name,
          id: session.user.id,
          role: session.user.role
        }
      })
    } else {
      return NextResponse.json({
        message: 'User not found in database',
        session: {
          email: session.user.email,
          name: session.user.name,
          id: session.user.id,
          role: session.user.role
        }
      }, { status: 404 })
    }

  } catch (error) {
    console.error('Error checking user status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}