import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Get all contacts
export async function GET(request) {
  try {
    // Get the contacts collection
    const contacts = await getCollection('allContacts');
    
    // Find all contacts sorted by creation date (newest first)
    const allContacts = await contacts.find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      Data: allContacts
    });

  } catch (error) {
    console.error("Error fetching contacts:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch contacts" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new contact
export async function POST(request) {
  try {
    // Get the contacts collection
    const contacts = await getCollection('allContacts');
    
    // Get the request body
    const body = await request.json();
    
    // Add metadata
    const contactData = {
      ...body,
      createdAt: new Date(),
      status: 'unread' // Add status for admin management
    };
    
    // Insert the new contact
    const result = await contacts.insertOne(contactData);

    return NextResponse.json({
      success: true,
      Data: { ...contactData, _id: result.insertedId },
      message: "Contact message saved successfully"
    });

  } catch (error) {
    console.error("Error creating contact:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to save contact message" 
    }, { status: 500 });
  }
} // End of POST function
