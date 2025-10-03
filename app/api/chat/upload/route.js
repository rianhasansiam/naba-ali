import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { readFileSync, createReadStream } from 'fs';
import { checkOrigin, isAuthenticated, isAdmin } from '../../../../lib/security';

// Configure formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFields: 10,
      keepExtensions: true,
      multiples: true
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

// Upload file to ImageBB
const uploadToImageBB = async (filePath, filename) => {
  try {
    const imageBuffer = readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('name', filename);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        url: result.data.url,
        deleteUrl: result.data.delete_url,
        size: result.data.size,
        width: result.data.width,
        height: result.data.height
      };
    } else {
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('ImageBB upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// POST - Upload chat file
export async function POST(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check authentication (allow both users and admins)
    const user = await isAuthenticated();
    const admin = await isAdmin();
    
    if (!user && !admin) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { fields, files } = await parseForm(request);
    const { conversationId } = fields;

    if (!conversationId) {
      return NextResponse.json({
        success: false,
        error: 'Conversation ID is required'
      }, { status: 400 });
    }

    const uploadedFiles = [];
    const fileArray = Array.isArray(files.file) ? files.file : [files.file].filter(Boolean);

    for (const file of fileArray) {
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const allowedFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/zip',
        'application/x-rar-compressed'
      ];

      // Validate file type
      if (!allowedImageTypes.includes(file.mimetype) && !allowedFileTypes.includes(file.mimetype)) {
        return NextResponse.json({
          success: false,
          error: `File type ${file.mimetype} not supported`
        }, { status: 400 });
      }

      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          error: 'File size must be less than 10MB'
        }, { status: 400 });
      }

      let uploadResult;

      if (allowedImageTypes.includes(file.mimetype)) {
        // Upload image to ImageBB
        uploadResult = await uploadToImageBB(file.filepath, file.originalFilename);
        
        if (!uploadResult.success) {
          return NextResponse.json({
            success: false,
            error: `Failed to upload ${file.originalFilename}: ${uploadResult.error}`
          }, { status: 500 });
        }

        uploadedFiles.push({
          type: 'image',
          filename: file.originalFilename,
          url: uploadResult.url,
          size: file.size,
          width: uploadResult.width,
          height: uploadResult.height,
          mimetype: file.mimetype
        });
      } else {
        // For non-image files, you might want to use a different storage service
        // For now, we'll return a placeholder
        uploadedFiles.push({
          type: 'file',
          filename: file.originalFilename,
          url: '#', // Placeholder - implement file storage service
          size: file.size,
          mimetype: file.mimetype
        });
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}

// GET - Download file (for non-image files stored locally)
export async function GET(request) {
  try {
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({
        success: false,
        error: 'File ID is required'
      }, { status: 400 });
    }

    // Implement file download logic here
    // This would typically involve retrieving file metadata from database
    // and streaming the file content

    return NextResponse.json({
      success: false,
      error: 'File download not implemented'
    }, { status: 501 });

  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to download file'
    }, { status: 500 });
  }
}