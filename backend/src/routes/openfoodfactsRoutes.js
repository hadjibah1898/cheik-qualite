import express from 'express';
import { searchOpenFoodFacts } from '../controllers/openfoodfactsController.js';

const router = express.Router();

router.get('/search', searchOpenFoodFacts);

export default router;
