import express from 'express';
import { sendScanLink, contactProducer, contact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/send-scan-link', sendScanLink);
router.post('/contact-producer', contactProducer);
router.post('/contact', contact);

export default router;
