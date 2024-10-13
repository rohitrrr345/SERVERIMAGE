import express from 'express';
import { signup, login, logout, getMyProfile } from '../controllers/UserController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me',isAuthenticated,getMyProfile)
router.post('/logout',isAuthenticated, logout);

export default router;
