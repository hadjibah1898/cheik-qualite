import express from 'express';
import { register, login, getPermissions } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { check } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});

router.post('/register', authLimiter, [
    check('username').isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères.'),
    check('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
], register);

router.post('/login', authLimiter, login);

router.get('/me/permissions', authenticateToken, getPermissions);

export default router;
