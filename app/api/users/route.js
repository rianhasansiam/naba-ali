import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { getCollection } from '../../../lib/mongodb';






// =======================
// SIGNUP (Create new user)
// =======================
// =======================
// SIGNUP (Create new user)
// =======================
export async function POST(request) {
  try {
    const users = await getCollection('allUsers');
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
    const users = await getCollection('allUsers');
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
// GET (Fetch all users)
// =======================
export async function GET() {
  try {
    const users = await getCollection('allUsers');
    const allUsers = await users.find({}).toArray();

    return NextResponse.json({
      success: true,
      Data: allUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}







// DELETE - Delete admin user by _id
export async function DELETE(request) {
  try {
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