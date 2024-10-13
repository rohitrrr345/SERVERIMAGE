import cloudinary from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Image with Title and Description Controller
export const uploadImage = async (req, res) => {
  try {
    // Check if the image file is available
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Capture title and description from the request body
    const { title, description } = req.body;

    // Validate title and description
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // The file path to the image stored temporarily by Multer
    const filePath = req.file.path;

    // Upload the image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'your-folder-name', // Optional: You can specify a folder in Cloudinary
    });

    // After uploading to Cloudinary, delete the file from the server
    fs.unlinkSync(filePath);

    // Send response with image URL and other info back to the client
    res.status(200).json({
      message: 'Image uploaded successfully',
      title,
      description,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
