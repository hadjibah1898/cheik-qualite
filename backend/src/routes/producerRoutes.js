import express from 'express';
import {
    getProducers,
    getCertifiedProducersCount,
    createProducer,
    updateProducer,
    searchProducers
} from '../controllers/producerController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';
import { uploadProducerImage } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getProducers);
router.get('/search', searchProducers);
router.get('/certified/count', authenticateToken, authorizeAdmin, getCertifiedProducersCount);

router.post('/', authenticateToken, authorizeAdmin, uploadProducerImage.single('image'), createProducer);
router.put('/:id', authenticateToken, authorizeAdmin, uploadProducerImage.single('image'), updateProducer);

export default router;
