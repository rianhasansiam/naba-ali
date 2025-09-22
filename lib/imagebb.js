// Simple ImageBB upload function
export const uploadToImageBB = async (imageFile) => {
  const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;
  
  // Basic checks
  if (!apiKey) throw new Error('ImageBB API key missing');
  if (!imageFile) throw new Error('No file provided');
  
  // Create form and upload
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error('Upload failed');
  }
  
  return data.data.url;
};