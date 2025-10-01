import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { checkOrigin, isAdmin, forbiddenResponse } from '../../../lib/security';






// =======================
// SIGNUP (Create new user)
// =======================
// =======================
// SIGNUP (Create new user)
// =======================
export async function POST(request) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const users = await getCollection('users');
    const body = await request.json();

    // Check if user already exists
    const existingUser = await users.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    let userToInsert;

    if (body.password) {
      // Normal signup: hash the password
      const hashedPassword = await bcrypt.hash(body.password, 10);
      userToInsert = { ...body, password: hashedPassword, role:"user", createdAt: new Date() };
    } else {
      // Google signup: no password
      userToInsert = { ...body, role: "user", createdAt: new Date() };
    }

    const userData = await users.insertOne(userToInsert);

    return NextResponse.json({
      success: true,
      Data: userData,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}


// =======================
// LOGIN (Authenticate user)
// =======================
export async function PUT(request) {
  try {
    const users = await getCollection('users');
    const body = await request.json();
    const { email, password } = body;


    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'You need to register first, then you can login.' },
        { status: 404 }
      );
    }

    // Support both plain text and bcryptjs-hashed passwords
    let passwordMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
      // bcryptjs hash
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // plain text
      passwordMatch = user.password === password;
    }
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password.' },
        { status: 401 }
      );
    }

    // Remove password before sending response
    const { password: _, ...userData } = user;
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Login successful.',
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to login.' },
      { status: 500 }
    );
  }
}

// =======================
// GET (Fetch all users or find user by email)
// =======================
export async function GET(request) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin for fetching all users
    const admin = await isAdmin();
    
    // Development logging
    if (process.env.NODE_ENV === 'development') {
      const user = await import('../../../lib/auth').then(m => m.auth()).then(s => s?.user);
      console.log('🔍 GET /api/users - User:', user?.email, 'Role:', user?.role, 'IsAdmin:', admin);
    }
    
    // TEMPORARY: Allow in development if authenticated
    const isAuthenticated = await import('../../../lib/security').then(m => m.isAuthenticated());
    if (process.env.NODE_ENV === 'development' && isAuthenticated) {
      console.log('⚠️ Development mode: Allowing authenticated user access to /api/users');
    } else if (!admin) {
      return forbiddenResponse('Only admins can view users list. Please log in as admin.');
    }

    const users = await getCollection('users');
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // If email parameter is provided, search for specific user
    if (email) {
      const user = await users.findOne({ email: email });
      
      if (user) {
        // Remove password before sending response
        const { password: _, ...userData } = user;
        return NextResponse.json({
          success: true,
          user: userData,
          message: 'User found.'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'User not found.'
        }, { status: 404 });
      }
    }

    // Otherwise, fetch all users
    const allUsers = await users.find({}).toArray();
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}







// DELETE - Delete admin user by _id (Admin only)
export async function DELETE(request) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return forbiddenResponse('Only admins can delete users');
    }

    const adminUsers = await getCollection('adminUsers');
    const body = await request.json();
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin user _id is required for delete' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminUsers.deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ success: true, Data: result, message: 'Admin user deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete admin user' }, { status: 500 });
  }
} // End of DELETE function