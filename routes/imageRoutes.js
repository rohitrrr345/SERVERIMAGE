import express from 'express';
import { uploadImage,  incrementViewCount, getAllImages } from '../controllers/ImageController.js';
import singleUpload from '../middleware/multer.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post("/upload",isAuthenticated,singleUpload,uploadImage)
router.get('/images',isAuthenticated ,getAllImages);
router.put('/image/:id/view',isAuthenticated, incrementViewCount);


export default router;
