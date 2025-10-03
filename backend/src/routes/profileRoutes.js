import express from 'express';
import { getProfile, updateProfile, uploadProfilePicture, changePassword } from '../controllers/profileController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { uploadProfilePic } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);
router.post('/upload-profile-picture', authenticateToken, uploadProfilePic.single('profilePicture'), uploadProfilePicture);
router.post('/change-password', authenticateToken, changePassword);

export default router;
