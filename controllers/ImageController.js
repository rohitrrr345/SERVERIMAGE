import cloudinary from 'cloudinary';
import Image from '../models/Image.js';
import getDataUri from '../uploads/dataUri.js';

export const uploadImage = async (req, res) => {
    try {
        const userId = req.session.user._id;     
         const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }
      const fileUri = getDataUri(file);

      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }
    console.log('first')
      const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  const newImage=new Image({
    title,
    description,
    user: userId,
    public_id: mycloud.public_id,

    url: mycloud.secure_url, 
  })
  console.log(userId)
  await newImage.save();
  console.log("eraa")

      res.status(200).json({
        message: 'Image uploaded successfully',
        title,
        description,
        userId,
        url: mycloud.secure_url,
        public_Id: mycloud.public_id,
        
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
    export const getImages = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      console.log(req.session.user._id)

      const userId = req.session.user._id;
      console.log(userId);
  
      const images = await Image.find({ user: userId });
  
      res.status(201).json({
       success:true,
       images
        
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementViewCount = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    image.views += 1;
    await image.save();

    res.status(200).json(image);
  } catch (error) {
    console.log('first')
    res.status(500).json({ error: error.message });
  }
};

 export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find(); 
    res.status(200).json({ images, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', success: false });
  }
};
