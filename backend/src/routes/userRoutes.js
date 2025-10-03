import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, getUsers);

export default router;
