import express from 'express';
import { addMagazine } from '../controllers/magazineController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';
import { uploadMagazine } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeAdmin, uploadMagazine.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), addMagazine);

export default router;
