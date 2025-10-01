import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { checkOrigin, isAdmin, forbiddenResponse } from '../../../lib/security';

// GET - Get all categories (Public - Anyone can view)
export async function GET(request) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Get both categories and products collections
    const categories = await getCollection('allCategories');
    const products = await getCollection('allProducts');
    
    // Find all categories and products
    const allCategories = await categories.find({}).toArray();
    const allProducts = await products.find({}).toArray();
    
    // Calculate product count for each category
    const categoriesWithCount = allCategories.map(category => {
      const productCount = allProducts.filter(product => {
        const categoryName = category.name?.toLowerCase()?.trim();
        const productCategory = product?.category?.toLowerCase()?.trim();
        
        // Flexible matching
        return productCategory === categoryName || 
               productCategory?.includes(categoryName) ||
               categoryName?.includes(productCategory);
      }).length;
      
      return {
        ...category,
        productCount: productCount
      };
    });
    
    return NextResponse.json(categoriesWithCount);

  } catch (error) {
    console.error("Error fetching categories:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch categories" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new category (Admin only)
export async function POST(request) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return forbiddenResponse('Only admins can create categories');
    }

    // Get the categories collection
    const categories = await getCollection('allCategories');
    
    // Get the request body
    const body = await request.json();
    
    // Insert the new category
    const categoryData = await categories.insertOne(body);

    return NextResponse.json({
      success: true,
      Data: categoryData,
      message: "Category created successfully"
    });

  } catch (error) {
    console.error("Error creating category:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create category" 
    }, { status: 500 });
  }
} // End of POST function

// PUT - Update category by _id (Admin only)
export async function PUT(request, { params }) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return forbiddenResponse('Only admins can update categories');
    }

    const categories = await getCollection('allCategories');
    const body = await request.json();
    
    // Get _id from URL params or from body for backward compatibility
    const url = new URL(request.url);
    const idFromUrl = url.pathname.split('/').pop();
    const _id = idFromUrl !== 'categories' ? idFromUrl : body._id;
    
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Category _id is required for update' }, { status: 400 });
    }
    
    const { ObjectId } = (await import('mongodb'));
    const result = await categories.updateOne({ _id: new ObjectId(_id) }, { $set: body });
    
    return NextResponse.json({ success: true, Data: result, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
} // End of PUT function

// DELETE - Delete category by _id (Admin only)
export async function DELETE(request, { params }) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return forbiddenResponse('Only admins can delete categories');
    }

    const categories = await getCollection('allCategories');
    
    // Get _id from URL params
    const url = new URL(request.url);
    const idFromUrl = url.pathname.split('/').pop();
    const _id = idFromUrl !== 'categories' ? idFromUrl : null;
    
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Category _id is required for delete' }, { status: 400 });
    }
    
    const { ObjectId } = (await import('mongodb'));
    const result = await categories.deleteOne({ _id: new ObjectId(_id) });
    
    return NextResponse.json({ success: true, Data: result, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
} // End of DELETE function