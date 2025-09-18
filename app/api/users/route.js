
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
    console.log('Received user data:', body);
    
    // Insert the new user
    const userData = await users.insertOne(body);

    return NextResponse.json({
      success: true,
      data: userData,
      insertedId: userData.insertedId
    });

  } catch (error) {
    console.error("Error creating user:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create user" 
    }, { status: 500 });
  }
} // End of the POST function
