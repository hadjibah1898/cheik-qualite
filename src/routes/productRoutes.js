import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductByBarcode,
    searchProductByName,
    getPendingProducts,
    searchAllProducts,
    searchOpenFoodFacts
} from '../controllers/productController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';
import { uploadProduct } from '../middlewares/upload.js';

const router = express.Router();

// Unprotected routes
router.get('/', getProducts);
router.get('/search/all', searchAllProducts);
router.get('/openfoodfacts/search', searchOpenFoodFacts);
router.get('/search/:name', searchProductByName);
router.get('/:barcode', getProductByBarcode);


// Admin protected routes
router.post('/', authenticateToken, authorizeAdmin, uploadProduct.single('productImage'), createProduct);
router.put('/:id', authenticateToken, authorizeAdmin, updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);
router.get('/pending', authenticateToken, authorizeAdmin, getPendingProducts);

export default router;
