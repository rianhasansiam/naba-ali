
import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';


export async function GET(request) {
  try {
    // Get the users collection using our helper function
    const users = await getCollection('allUsers');
    
    // Find all users
    const allUsers = await users.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      Data: allUsers
    });

  } catch (error) {
    console.error("Error fetching users:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch users" 
    }, { status: 500 });
  }
} // End of the GET function




export async function POST(request) {
  try {
    // Get the users collection using our helper function
    const users = await getCollection('allUsers');
    
    // Get the request body
    const body = await request.json();
    //console.log('Received user data:', body);
    
    // Insert the new user
    const userData = await users.insertOne(body);

    return NextResponse.json({
      success: true,
      Data: userData,
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Error creating user:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create user" 
    }, { status: 500 });
  }
} // End of the POST function


// PUT - Update admin user by _id
export async function PUT(request) {
  try {
    const adminUsers = await getCollection('adminUsers');
    const body = await request.json();
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin user _id is required for update' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminUsers.updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
    return NextResponse.json({ success: true, Data: result, message: 'Admin user updated successfully' });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ success: false, error: 'Failed to update admin user' }, { status: 500 });
  }
} // End of PUT function

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