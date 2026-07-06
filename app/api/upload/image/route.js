/**
 * app/api/upload/image/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side ImageBB proxy.
 * Prefer IMAGEBB_API_KEY so the key stays server-side only.
 * Frontend calls POST /api/upload/image with FormData { image: File }.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/apiGuards';

export const runtime = 'nodejs'; // FormData requires Node runtime

const getImageBBApiKey = () => (
  process.env.IMAGEBB_API_KEY ||
  process.env.NEXT_PUBLIC_IMAGEBB_API_KEY ||
  process.env.IMGBB_API_KEY
);

export async function POST(request) {
  // Only authenticated users can upload images
  const { user, error } = await requireAuth();
  if (error) return error;

  const apiKey = getImageBBApiKey();
  if (!apiKey) {
    console.error('ImageBB API key is not set');
    return NextResponse.json(
      { success: false, error: 'Image upload service is not configured' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (imageFile.type && !allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (imageFile.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Forward to ImageBB
    const uploadForm = new FormData();
    uploadForm.append('image', imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: uploadForm,
    });

    const data = await response.json();

    if (!data.success) {
      console.error('ImageBB upload failed:', data);
      return NextResponse.json(
        { success: false, error: 'Image upload failed' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.data.url,
      deleteUrl: data.data.delete_url,
    });
  } catch (err) {
    console.error('Image upload error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
