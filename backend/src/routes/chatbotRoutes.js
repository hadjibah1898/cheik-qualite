import express from 'express';
import { getChatbotKnowledge, chat } from '../controllers/chatbotController.js';

const router = express.Router();

router.get('/knowledge', getChatbotKnowledge);
router.post('/', chat);

export default router;
