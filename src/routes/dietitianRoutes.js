import express from 'express';
import { addDietitian } from '../controllers/dietitianController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';
import { uploadDietitianPhoto } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeAdmin, uploadDietitianPhoto.single('photo'), addDietitian);

export default router;
