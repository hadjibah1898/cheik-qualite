import express from 'express';
import { submitCertificate, verifyCertificate } from '../controllers/certificateController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';
import { uploadCertificate } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeAdmin, uploadCertificate.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'productImages', maxCount: 5 }
]), submitCertificate);

router.get('/verify/:identifier', verifyCertificate);

export default router;
