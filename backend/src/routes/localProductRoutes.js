// --- Fichier de Routes pour les Produits Locaux ---
// Ce fichier définit toutes les URLs (endpoints) qui concernent les produits locaux.

import express from 'express';

// On importe les fonctions du contrôleur qui contiennent la logique métier.
// Au lieu d'écrire toute la logique ici, on la sépare dans le contrôleur pour une meilleure organisation.
import {
    createLocalProduct,
    updateLocalProduct,
    deleteLocalProduct,
    getLocalProducts
} from '../controllers/productController.js';

// On importe les middlewares d'authentification.
// `authenticateToken` vérifie si l'utilisateur est connecté (a un token JWT valide).
// `authorizeAdmin` vérifie si l'utilisateur connecté a le rôle 'admin'.
import { authenticateToken, authorizeAdmin } from '../middlewares/auth.js';

// On crée un "routeur" Express. Un routeur est un mini-application capable de gérer des routes.
const router = express.Router();

// --- Définition des Routes ---

// Route pour récupérer la liste des produits locaux.
// GET /api/local-products/
// C'est une route publique, pas besoin d'être connecté.
router.get('/', getLocalProducts);

// Route pour soumettre un nouveau produit local.
// POST /api/local-products/submission
// Cette route est protégée. Il faut être connecté (`authenticateToken`) et être admin (`authorizeAdmin`).
// Les middlewares sont exécutés dans l'ordre : d'abord on vérifie le token, ensuite on vérifie le rôle.
router.post('/submission', authenticateToken, authorizeAdmin, createLocalProduct);

// Route pour mettre à jour un produit local existant.
// PUT /api/local-products/:id
// ':id' est un paramètre dynamique. On pourra récupérer sa valeur dans le contrôleur (req.params.id).
// Route protégée pour les admins.
router.put('/:id', authenticateToken, authorizeAdmin, updateLocalProduct);

// Route pour supprimer un produit local.
// DELETE /api/local-products/:id
// Route protégée pour les admins.
router.delete('/:id', authenticateToken, authorizeAdmin, deleteLocalProduct);

// On exporte le routeur pour qu'il puisse être utilisé dans app.js.
export default router;