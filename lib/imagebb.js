/**
 * lib/imagebb.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Image upload utility — uses the server-side proxy at /api/upload/image.
 * The ImageBB API key is NEVER exposed to the client bundle.
 */

/**
 * Upload an image file via the server-side proxy.
 * @param {File} imageFile - The image File object from an <input type="file">
 * @returns {Promise<string>} The uploaded image URL
 */
export const uploadToImageBB = async (imageFile) => {
  if (!imageFile) throw new Error('No file provided');

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type — browser sets multipart boundary automatically
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Image upload failed');
  }

  return data.url;
};