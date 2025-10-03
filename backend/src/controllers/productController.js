// --- Fichier Contrôleur pour les Produits ---
// Un contrôleur contient la logique métier pour une ressource donnée.
// Chaque fonction exportée est une "action" qui peut être appelée par une route.

import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';

// --- Action pour créer un nouveau produit ---
// Cette fonction est asynchrone car elle interagit avec la base de données.
const createProduct = async (req, res) => {
    // On utilise un bloc try...catch pour gérer les erreurs qui pourraient survenir.
    try {
        // On extrait les données du corps de la requête (envoyées par le formulaire du frontend).
        const { name, description, category } = req.body;
        // req.file contient les informations sur le fichier uploadé par multer.
        const productImagePath = req.file ? req.file.path : null;
        
        // On récupère l'instance de la base de données.
        const db = getDB();

        // On valide les données reçues. Si des champs manquent, on renvoie une erreur 400 (Bad Request).
        if (!name || !description || !category) {
            return res.status(400).json({ message: 'Nom, description et catégorie du produit sont requis.' });
        }

        // On crée un nouvel objet "produit" avec les données validées.
        const newProduct = {
            name,
            description,
            category,
            imageUrl: productImagePath ? `/${productImagePath.replace(/\\/g, '/')}` : null, // On normalise le chemin de l'image.
            createdAt: new Date(), // On ajoute la date de création.
        };

        // On insère le nouveau produit dans la collection "products" de la base de données.
        await db.collection('products').insertOne(newProduct);
        
        // On renvoie une réponse de succès (201 Created) avec un message et le produit créé.
        res.status(201).json({ message: 'Produit ajouté avec succès', product: newProduct });

    } catch (error) {
        // Si une erreur survient dans le bloc try, elle est "attrapée" ici.
        console.error('Erreur lors de la création du produit:', error); // On affiche l'erreur dans la console du serveur.
        res.status(500).json({ message: 'Erreur serveur' }); // On envoie une réponse d'erreur générique au client.
    }
};

const createLocalProduct = async (req, res) => {
    try {
        const { productName, description, category, productImage, region, barcode, certification } = req.body;
        const db = getDB();

        if (!productName || !description || !category || !productImage) {
            return res.status(400).json({ message: 'Nom, description, catégorie et image du produit (Base64) sont requis.' });
        }

        const newLocalProduct = {
            name: productName,
            description,
            category,
            region,
            barcode,
            certification,
            imageUrl: productImage,
            badge: 'Certifié ONCQ',
            createdAt: new Date(),
        };

        await db.collection('local_products').insertOne(newLocalProduct);
        res.status(201).json({ message: 'Produit local ajouté avec succès', product: newLocalProduct });
    } catch (error) {
        console.error('Erreur lors de la création du produit local:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;
        const db = getDB();
        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(productId) },
            { $set: updatedProduct }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const db = getDB();
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteLocalProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const db = getDB();
        const result = await db.collection('local_products').deleteOne({ _id: new ObjectId(productId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Produit local non trouvé.' });
        }
        res.json({ message: 'Produit local supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit local:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const updateLocalProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, category, description, region, barcode, certification, productImage } = req.body;
        const db = getDB();

        const updateData = {};
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (description) updateData.description = description;
        if (region) updateData.region = region;
        if (barcode) updateData.barcode = barcode;
        if (certification) updateData.certification = certification;
        if (productImage) updateData.imageUrl = productImage;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
        }

        const result = await db.collection('local_products').updateOne(
            { _id: new ObjectId(productId) },
            { $set: updateData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Produit local non trouvé' });
        }
        res.json({ message: 'Produit local mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit local:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// --- Action pour récupérer tous les produits ---
const getProducts = async (req, res) => {
    try {
        // On récupère l'instance de la base de données.
        const db = getDB();
        // On utilise la méthode find() sur la collection "products" pour récupérer tous les documents.
        // {} est un filtre vide, ce qui signifie "tous les documents".
        // .toArray() convertit le curseur de résultat en un tableau JavaScript.
        const products = await db.collection('products').find({}).toArray();
        
        // On renvoie le tableau de produits au format JSON.
        res.json(products);
    } catch (error) {
        // Gestion des erreurs.
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const db = getDB();
        const certificate = await db.collection('certificates').findOne({
            $or: [
                { barcode: barcode },
                { oncqNumber: barcode }
            ]
        });

        if (certificate) {
            const productFromCert = {
                name: certificate.productName,
                brand: certificate.origin,
                compliant: true,
                info: certificate.description,
                source: 'certificates',
                certificateData: certificate
            };
            return res.json(productFromCert);
        }

        return res.status(404).json({ message: 'Cet identifiant ne correspond à aucun certificat valide.' });

    } catch (error) {
        console.error('Erreur lors de la vérification du certificat:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const searchProductByName = async (req, res) => {
    try {
        const name = req.params.name;
        const db = getDB();
        const product = await db.collection('products').findOne({ name: { $regex: name, $options: 'i' } });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Aucun produit trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la recherche de produits:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getPendingProducts = async (req, res) => {
    try {
        const db = getDB();
        const pendingProducts = await db.collection('products').find({ status: 'pending' }).toArray();
        res.json(pendingProducts);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits en attente:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const searchAllProducts = async (req, res) => {
    try {
        const query = req.query.q;
        const db = getDB();
        const products = await db.collection('products').find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { info: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la recherche de tous les produits:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const searchOpenFoodFacts = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({ message: 'Terme de recherche manquant.' });
        }

        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&json=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            const formattedProducts = data.products.map(product => {
                const nutriments = product.nutriments || {};
                return {
                    name: product.product_name || 'Nom inconnu',
                    description: product.generic_name || product.brands || 'Description non disponible',
                    imageUrl: product.image_url || null,
                    diabetic: nutriments['sugars_100g'] !== undefined ? (nutriments['sugars_100g'] > 10 ? 'high' : 'low') : 'unknown',
                    hypertension: nutriments['salt_100g'] !== undefined ? (nutriments['salt_100g'] > 1.5 ? 'high' : 'low') : 'unknown',
                    drepanocytosis: nutriments['iron_100g'] !== undefined ? (nutriments['iron_100g'] > 0.005 ? 'high' : 'low') : 'unknown',
                    nutriments: {
                        energy: nutriments['energy-kj_100g'] || nutriments['energy-kcal_100g'],
                        fat: nutriments['fat_100g'],
                        saturated_fat: nutriments['saturated-fat_100g'],
                        carbohydrates: nutriments['carbohydrates_100g'],
                        sugars: nutriments['sugars_100g'],
                        fiber: nutriments['fiber_100g'],
                        proteins: nutriments['proteins_100g'],
                        salt: nutriments['salt_100g'],
                        sodium: nutriments['sodium_100g'],
                        iron: nutriments['iron_100g'],
                    }
                };
            });
            res.json(formattedProducts);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Erreur lors de la recherche Open Food Facts:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la recherche Open Food Facts' });
    }
};

const getLocalProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const db = getDB();

        const localProductsCursor = db.collection('local_products').find({}).skip(skip).limit(limit);
        const localProducts = [];

        for await (const product of localProductsCursor) {
            if (product.producerId) {
                try {
                    if (ObjectId.isValid(product.producerId)) {
                        const producer = await db.collection('producers').findOne({ _id: new ObjectId(product.producerId) });
                        if (producer) {
                            localProducts.push({ ...product, producer });
                        } else {
                            localProducts.push(product);
                        }
                    } else {
                        console.warn(`Invalid producerId format for product ${product._id}: ${product.producerId}`);
                        localProducts.push(product);
                    }
                } catch (producerError) {
                    console.error(`Error fetching producer for product ${product._id}:`, producerError);
                    localProducts.push(product);
                }
            } else {
                localProducts.push(product);
            }
        }

        const totalProducts = await db.collection('local_products').countDocuments();

        res.json({
            products: localProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits locaux:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductByBarcode,
    searchProductByName,
    getPendingProducts,
    searchAllProducts,
    searchOpenFoodFacts,
    createLocalProduct,
    updateLocalProduct,
    deleteLocalProduct,
    getLocalProducts
};