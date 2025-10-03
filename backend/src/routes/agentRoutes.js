import express from 'express';
import {
    applyAsAgent,
    getAgentApplications,
    processAgentApplication,
    deleteAgentApplication,
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent
} from '../controllers/agentController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const appLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});

// Agent Applications
router.post('/applications', appLimiter, applyAsAgent);
router.get('/applications', authenticateToken, authorizeAdmin, getAgentApplications);
router.put('/applications/:id', authenticateToken, authorizeAdmin, processAgentApplication);
router.delete('/applications/:id', authenticateToken, authorizeAdmin, deleteAgentApplication);

// Direct Agent Management
router.get('/', authenticateToken, authorizeAdmin, getAgents);
router.post('/', authenticateToken, authorizeAdmin, createAgent);
router.put('/:id', authenticateToken, authorizeAdmin, updateAgent);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteAgent);


export default router;
