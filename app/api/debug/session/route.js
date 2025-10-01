import { auth } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

// Diagnostic endpoint to check current session
export async function GET() {
  try {
    const session = await auth();
    
    return NextResponse.json({
      success: true,
      authenticated: !!session?.user,
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        isAdmin: session.user.role === 'admin'
      } : null,
      session: session ? 'Active' : 'None'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
