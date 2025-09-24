// app/api/admin/role/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT /api/admin/role - Update user role (Admin only)
export async function PUT(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is admin
    if (session.user.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { userId, newRole } = await request.json();

    // Validate input
    if (!userId || !newRole) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(newRole.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid role. Must be user or admin' }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if target user exists
    const targetUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from demoting themselves
    if (targetUser._id.toString() === session.user.id && newRole.toLowerCase() === 'user') {
      return NextResponse.json({ 
        error: 'You cannot remove your own admin privileges' 
      }, { status: 400 });
    }

    // Update user role
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role: newRole.toLowerCase(),
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }

    // Get updated user data
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Exclude password
    );

    return NextResponse.json({
      success: true,
      message: `User role updated to ${newRole}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/admin/role - Get all users with their roles (Admin only)
export async function GET(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is admin
    if (session.user.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get all users with their roles
    const users = await db.collection('users').find(
      {},
      { 
        projection: { 
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          image: 1
        } 
      }
    ).toArray();

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        role: user.role || 'user' // Default to 'user' if no role is set
      }))
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}