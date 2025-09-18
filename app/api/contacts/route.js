import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';

// GET - Get all contacts
export async function GET(request) {
  try {
    // Get the contacts collection
    const contacts = await getCollection('allContacts');
    
    // Find all contacts
    const allContacts = await contacts.find({}).toArray();
    
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
    
    // Insert the new contact
    const contactData = await contacts.insertOne(body);

    return NextResponse.json({
      success: true,
      Data: contactData,
      message: "Contact created successfully"
    });

  } catch (error) {
    console.error("Error creating contact:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create contact" 
    }, { status: 500 });
  }
} // End of POST function
