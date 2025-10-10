import express from 'express';
import { createAlert, deleteAlert, getAlerts } from '../controllers/alertController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAlerts);
router.post('/', authenticateToken, authorizeAdmin, createAlert);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteAlert);

export default router;
