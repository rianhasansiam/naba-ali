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
    
    // Parallel fetch for better performance
    const [allCategories, allProducts] = await Promise.all([
      categories.find({}).toArray(),
      products.find({}, { projection: { category: 1 } }).toArray()
    ]);
    
    // Create a category count map for O(n) complexity instead of O(n²)
    const categoryCountMap = new Map();
    
    allProducts.forEach(product => {
      const productCategory = product?.category?.toLowerCase()?.trim();
      if (productCategory) {
        categoryCountMap.set(productCategory, (categoryCountMap.get(productCategory) || 0) + 1);
      }
    });
    
    // Calculate product count for each category efficiently
    const categoriesWithCount = allCategories.map(category => {
      const categoryName = category.name?.toLowerCase()?.trim();
      const productCount = categoryCountMap.get(categoryName) || 0;
      
      return {
        ...category,
        productCount: productCount,
        hasProducts: productCount > 0
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