import express from 'express';
import {
    createHealthAdvice,
    updateHealthAdvice,
    deleteHealthAdvice,
    getHealthAdvice,
    searchHealthAdvice
} from '../controllers/healthAdviceController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getHealthAdvice);
router.get('/search', searchHealthAdvice);

router.post('/', authenticateToken, authorizeAdmin, createHealthAdvice);
router.put('/:id', authenticateToken, authorizeAdmin, updateHealthAdvice);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteHealthAdvice);

export default router;
