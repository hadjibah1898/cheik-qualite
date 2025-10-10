import express from 'express';
import { getPermissions, updatePermissions } from '../controllers/permissionController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:role', authenticateToken, authorizeAdmin, getPermissions);
router.put('/:role', authenticateToken, authorizeAdmin, updatePermissions);

export default router;
