import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // Import Nodemailer
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import multer from 'multer';
import fetch from 'node-fetch';
import { check, validationResult } from 'express-validator';
import fs from 'fs';


const JWT_SECRET = process.env.JWT_SECRET;
const port = 5000; // Déplacé ici pour être initialisé avant utilisation

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${port}`;

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

const app = express();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("FATAL ERROR: DATABASE_URL is not defined in .env file.");
  process.exit(1);
}
const client = new MongoClient(url);

const dbName = 'cheik-qualite';
let db;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased limit for development
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Return JSON instead of a plain string
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});

// Multer configuration for certificates
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/certificates/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Multer configuration for magazines
const magazineStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/magazines/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMagazine = multer({ storage: magazineStorage });

// Multer configuration for product images
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // New directory for product images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadProduct = multer({ storage: productStorage });

// Multer configuration for dietitian photos
const dietitianPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/dietitians/'); // New directory for dietitian photos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadDietitianPhoto = multer({ storage: dietitianPhotoStorage });

// Multer configuration for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadProfilePic = multer({ storage: profilePictureStorage });

// Multer configuration for producer images
const producerImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/producers/'); // New directory for producer images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadProducerImage = multer({ storage: producerImageStorage });

const startServer = async () => {
  try {
    // Ensure uploads directory exists
    const uploadsDir = './uploads';
    const profilePicturesDir = './uploads/profile-pictures';

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log('Created uploads directory.');
    }
    if (!fs.existsSync(profilePicturesDir)) {
      fs.mkdirSync(profilePicturesDir);
      console.log('Created uploads/profile-pictures directory.');
    }

    await client.connect();
    console.log('Connecté à MongoDB');
    db = client.db(dbName);

    app.listen(port, () => {
      console.log(`Le serveur backend est démarré sur http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1);
  }
};

startServer();

app.get('/', (req, res) => {
  res.send('Bonjour depuis le backend !');
});

// Auth Routes
app.post('/api/auth/register', authLimiter, [check('username').isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères.'), check('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')], async (req, res) => { const errors = validationResult(req); if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); } try { const { username, password } = req.body; const hashedPassword = await bcrypt.hash(password, 10); const usersCollection = db.collection('users'); const existingUser = await usersCollection.findOne({ username }); if (existingUser) { return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris.' }); } await usersCollection.insertOne({ username, password: hashedPassword, role: 'user' }); res.status(201).json({ message: 'Utilisateur enregistré avec succès.' }); } catch (error) { console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error); res.status(500).json({ message: 'Erreur serveur' }); } });

app.get('/api/auth/me/permissions', authenticateToken, async (req, res) => {
    try {
        const userRole = req.user.role;
        // Admins get all permissions by default
        if (userRole === 'admin') {
            const allAdminRoutes = [
                '/admin', '/soumission-certificat', '/notifications', 
                '/profil', '/soumission', '/verifier-produit', 
                '/recherche-avancee', '/agent/dashboard'
            ];
            return res.json({ allowedRoutes: allAdminRoutes });
        }

        const permissions = await db.collection('permissions').findOne({ role: userRole });

        // Default permissions for a standard user if not specifically set
        const defaultUserRoutes = ['/notifications', '/profil', '/soumission', '/verifier-produit', '/recherche-avancee'];

        if (!permissions) {
            if (userRole === 'user') {
                 return res.json({ allowedRoutes: defaultUserRoutes });
            }
            // For other roles like 'agent', if no permissions are set, they get nothing by default
            return res.json({ allowedRoutes: [] });
        }
        
        res.json(permissions);

    } catch (error) {
        console.error(`Erreur lors de la récupération des permissions pour l\'utilisateur:`, error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe sont requis." });
    }

    // Try to find the user in either the 'users' or 'agents' collection
    let user = await db.collection('users').findOne({ username });
    if (!user) {
        // For agents, the username is their email
        user = await db.collection('agents').findOne({ email: username });
    }

    if (!user) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }
    
    // Use 'email' for agent's username field in token
    const tokenUsername = user.role === 'agent' ? user.email : user.username;

    const token = jwt.sign({ userId: user._id, username: tokenUsername, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// CRUD Routes for Products (Protected)
app.post('/api/products', authenticateToken, authorizeAdmin, uploadProduct.single('productImage'), async (req, res) => {
  try {
    const { name, description, category } = req.body; // Assuming these fields from the form
    const productImagePath = req.file ? req.file.path : null;

    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Nom, description et catégorie du produit sont requis.' });
    }

    const newProduct = {
      name,
      description,
      category,
      imageUrl: productImagePath ? `/${productImagePath.replace(/\\/g, '/')}` : null, // Store relative path
      createdAt: new Date(),
      // Add other fields as needed, e.g., producerId, barcode, etc.
    };

    const result = await db.collection('products').insertOne(newProduct);
    res.status(201).json({ message: 'Produit ajouté avec succès', product: newProduct });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// New CRUD Route for Local Products (Protected)
app.post('/api/local-products-submission', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    console.log('Requête reçue pour soumission de produit local (Base64).');
    console.log('req.body:', req.body); // Log form body data

    const { productName, description, category, productImage, region, barcode, certification } = req.body; // Get productImage directly from body

    if (!productName || !description || !category || !productImage) { // Check for productImage directly
      console.log('Validation échouée: champs manquants ou image Base64 manquante.');
      return res.status(400).json({ message: 'Nom, description, catégorie et image du produit (Base64) sont requis.' });
    }

    const newLocalProduct = {
      name: productName,
      description,
      category,
      region,
      barcode,
      certification,
      imageUrl: productImage, // Store Base64 string directly
      badge: 'Certifié ONCQ', // Default badge for local products
      createdAt: new Date(),
    };

    const result = await db.collection('local_products').insertOne(newLocalProduct);
    console.log('Produit local ajouté avec succès à la base de données.', newLocalProduct);
    res.status(201).json({ message: 'Produit local ajouté avec succès', product: newLocalProduct });
  } catch (error) {
    console.error('Erreur lors de la création du produit local:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;
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
});

app.delete('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// CRUD Routes for Health Advice (Protected)
app.post('/api/health-advice', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const newAdvice = req.body;
    const result = await db.collection('health_advice').insertOne(newAdvice);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Erreur lors de la création du conseil santé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/health-advice/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const adviceId = req.params.id;
    const updatedAdvice = req.body;
    const result = await db.collection('health_advice').updateOne(
      { _id: new ObjectId(adviceId) },
      { $set: updatedAdvice }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Conseil santé non trouvé' });
    }
    res.json({ message: 'Conseil santé mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du conseil santé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/health-advice/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const adviceId = req.params.id;
    const result = await db.collection('health_advice').deleteOne({ _id: new ObjectId(adviceId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Conseil santé non trouvé' });
    }
    res.json({ message: 'Conseil santé supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du conseil santé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Certificate Submission Route
app.post('/api/certificates', authenticateToken, authorizeAdmin, upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'productImages', maxCount: 5 }
]), async (req, res) => {
  try {
    const { productName, productType, barcode, batchNumber, origin, description, oncqNumber, validityPeriod } = req.body;
    
    const certificatePath = req.files.certificate ? req.files.certificate[0].path : null;
    const productImagePaths = req.files.productImages ? req.files.productImages.map(file => file.path) : [];

    if (!certificatePath) {
      return res.status(400).json({ message: 'Certificate file is required.' });
    }

    const newCertificate = {
      productName,
      productType,
      barcode,
      batchNumber,
      origin,
      description,
      oncqNumber,
      validityPeriod,
      certificatePath,
      productImagePaths,
      submissionDate: new Date()
    };

    const result = await db.collection('certificates').insertOne(newCertificate);
    res.status(201).json({ message: 'Certificate submitted successfully', certificateId: result.insertedId });
  } catch (error) {
    console.error('Error submitting certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add a new magazine
app.post('/api/magazines', authenticateToken, authorizeAdmin, uploadMagazine.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const coverImagePath = req.files.coverImage ? req.files.coverImage[0].path : null;
    const pdfFilePath = req.files.pdfFile ? req.files.pdfFile[0].path : null;

    if (!title || !description || !coverImagePath || !pdfFilePath) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMagazine = {
      title,
      description,
      coverImageUrl: coverImagePath,
      pdfUrl: pdfFilePath,
      createdAt: new Date()
    };

    const result = await db.collection('magazines').insertOne(newMagazine);
    res.status(201).json({ message: 'Magazine added successfully', magazineId: result.insertedId });
  } catch (error) {
    console.error('Error adding magazine:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to create a new alert
app.post('/api/alerts', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const newAlert = {
      title,
      message,
      createdAt: new Date()
    };

    const result = await db.collection('alerts').insertOne(newAlert);
    res.status(201).json({ message: 'Alert created successfully', alertId: result.insertedId });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route to add a new dietitian
app.post('/api/dietitians', authenticateToken, authorizeAdmin, uploadDietitianPhoto.single('photo'), async (req, res) => {
  try {
    const { name, niveau, specialite, bio, forfait } = req.body;
    const photoPath = req.file ? req.file.path : null;

    if (!name || !niveau || !specialite || !bio || !forfait) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const newDietitian = {
      name,
      niveau,
      specialite,
      bio,
      forfait,
      photoUrl: photoPath ? `/${photoPath.replace(/\\/g, '/')}` : null,
      createdAt: new Date(),
    };

    const result = await db.collection('dietitians').insertOne(newDietitian);
    res.status(201).json({ message: 'Diététicien ajouté avec succès', dietitian: newDietitian });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du diététicien:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route to delete an alert
app.delete('/api/alerts/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const alertId = req.params.id;
    const result = await db.collection('alerts').deleteOne({ _id: new ObjectId(alertId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Alerte non trouvée.' });
    }
    res.json({ message: 'Alerte supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'alerte:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


// DELETE route for local products
app.delete('/api/local-products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await db.collection('local_products').deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Produit local non trouvé.' });
    }
    res.json({ message: 'Produit local supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit local:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// PUT route for local products
app.put('/api/local-products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const result = await db.collection('local_products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: updatedProduct }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Produit local non trouvé' });
    }
    res.json({ message: 'Produit local mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit local:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// API Routes

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await db.collection('alerts').find({}).sort({ createdAt: -1 }).toArray();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await db.collection('products').find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/products/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params; // 'barcode' is the identifier from the scan

    // Search ONLY in 'certificates' collection by barcode or ONCQ number
    const certificate = await db.collection('certificates').findOne({
      $or: [
        { barcode: barcode },
        { oncqNumber: barcode } // The scanned code could be an ONCQ number
      ]
    });

    if (certificate) {
      // Map certificate fields to look like a product for the frontend
      const productFromCert = {
        name: certificate.productName,
        brand: certificate.origin, // Assuming origin is the brand
        compliant: true, // If a certificate is found, it's considered compliant
        info: certificate.description,
        source: 'certificates', // Add a source to be explicit
        certificateData: certificate 
      };
      return res.json(productFromCert);
    }

    // If not found, return 404
    return res.status(404).json({ message: 'Cet identifiant ne correspond à aucun certificat valide.' });

  } catch (error) {
    console.error('Erreur lors de la vérification du certificat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/products/search/:name', async (req, res) => {
  try {
    const name = req.params.name;
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
});

// New route to get pending products
app.get('/api/products/pending', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const pendingProducts = await db.collection('products').find({ status: 'pending' }).toArray();
    res.json(pendingProducts);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits en attente:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/health-advice', async (req, res) => {
  try {
    const healthAdvice = await db.collection('health_advice').find({}).toArray();
    res.json(healthAdvice);
  } catch (error) {
    console.error('Erreur lors de la récupération des conseils santé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/producers', async (req, res) => {
  try {
    const producers = await db.collection('producers').find({}).toArray();
    res.json(producers);
  } catch (error) {
    console.error('Erreur lors de la récupération des producteurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// New route to get count of certified producers
app.get('/api/producers/certified/count', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Assuming 'certified' is a status or a field in the producer document
    // You might need to adjust the query based on how certification is stored
    const certifiedProducersCount = await db.collection('producers').countDocuments({ status: 'certified' }); // Example: count producers with status 'certified'
    res.json({ count: certifiedProducersCount });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de producteurs certifiés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST route to add a new producer
app.post('/api/producers', authenticateToken, authorizeAdmin, uploadProducerImage.single('image'), async (req, res) => {
  try {
    const { name, region, tags, phone, email } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!name || !region || !tags || !phone || !email) {
      return res.status(400).json({ message: 'Nom, région, tags, téléphone et email du producteur sont requis.' });
    }

    const newProducer = {
      name,
      region,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      phone,
      email,
      image: imagePath ? `/${imagePath.replace(/\\/g, '/')}` : null,
      createdAt: new Date(),
    };

    const result = await db.collection('producers').insertOne(newProducer);
    res.status(201).json({ message: 'Producteur ajouté avec succès', producer: newProducer });
  } catch (error) {
    console.error('Erreur lors de la création du producteur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT route to update an existing producer
app.put('/api/producers/:id', authenticateToken, authorizeAdmin, uploadProducerImage.single('image'), async (req, res) => {
  try {
    const producerId = req.params.id;
    const { name, region, tags, phone, email } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const updateData = {
      name,
      region,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      phone,
      email,
    };

    if (imagePath) {
      updateData.image = `/${imagePath.replace(/\\/g, '/')}`;
    }

    const result = await db.collection('producers').updateOne(
      { _id: new ObjectId(producerId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Producteur non trouvé.' });
    }

    res.json({ message: 'Producteur mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du producteur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await db.collection('notifications').find({}).sort({ createdAt: -1 }).toArray();
    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await db.collection('users').find({}).project({ password: 0 }).toArray(); // Exclude password
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/products/search-all', async (req, res) => {
  try {
    const query = req.query.q;
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
});

app.get('/api/openfoodfacts/search', async (req, res) => {
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
          // Simplified health indicators based on common nutrient values (per 100g)
          // These are examples and should be refined based on actual medical guidelines
          diabetic: nutriments['sugars_100g'] !== undefined ? (nutriments['sugars_100g'] > 10 ? 'high' : 'low') : 'unknown',
          hypertension: nutriments['salt_100g'] !== undefined ? (nutriments['salt_100g'] > 1.5 ? 'high' : 'low') : 'unknown',
          drepanocytosis: nutriments['iron_100g'] !== undefined ? (nutriments['iron_100g'] > 0.005 ? 'high' : 'low') : 'unknown', // Example: high iron for drepanocytosis
          nutriments: { // Include all available nutriments for detailed display on frontend
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
            // Add more nutriments as needed
          }
        };
      });
      res.json(formattedProducts);
    } else {
      res.json([]); // No products found
    }
  } catch (error) {
    console.error('Erreur lors de la recherche Open Food Facts:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche Open Food Facts' });
  }
});

app.get('/api/health-advice/search', async (req, res) => {
  try {
    const query = req.query.q;
    const healthAdvice = await db.collection('health_advice').find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.json(healthAdvice);
  } catch (error) {
    console.error('Erreur lors de la recherche de conseils santé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/producers/search', async (req, res) => {
  try {
    const query = req.query.q;
    const producers = await db.collection('producers').find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { region: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.json(producers);
  } catch (error) {
    console.error('Erreur lors de la recherche de producteurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/chatbot-knowledge', async (req, res) => {
  try {
    const chatbotKnowledge = await db.collection('chatbot').find({}).toArray();
    res.json(chatbotKnowledge);
  } catch (error) {
    console.error('Erreur lors de la récupération des connaissances du chatbot:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/local-products', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const localProductsCursor = db.collection('local_products').find({}).skip(skip).limit(limit);
    const localProducts = [];

    for await (const product of localProductsCursor) {
      if (product.producerId) {
        const producer = await db.collection('producers').findOne({ _id: new ObjectId(product.producerId) });
        if (producer) {
          localProducts.push({ ...product, producer });
        } else {
          localProducts.push(product); // Add product even if producer not found
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
});


app.post('/api/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();
    const chatbotKnowledge = await db.collection('chatbot').find({}).toArray();

    let response = "Désolé, je n'ai pas compris votre question. Pouvez-vous reformuler ?";

    for (const entry of chatbotKnowledge) {
      if (entry.keywords.some(keyword => userMessage.includes(keyword))) {
        response = entry.response;
        break;
      }
    }
    res.json({ response: response });
  } catch (error) {
    console.error('Erreur lors du traitement du message du chatbot:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route to verify product certification
app.get('/api/certificates/verify/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const certificate = await db.collection('certificates').findOne({
      $or: [
        { barcode: identifier },
        { oncqNumber: identifier }
      ]
    });

    if (certificate) {
      res.json({ isCertified: true, certificate });
    } else {
      res.status(404).json({ isCertified: false, message: 'Produit non certifié ou identifiant inconnu.' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du certificat:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services or SMTP
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables for security
        pass: process.env.EMAIL_PASS // Use environment variables for security
    }
});

// Endpoint to send scan link via email
app.post('/api/send-scan-link', async (req, res) => {
    const { email, scanLink } = req.body;

    if (!email || !scanLink) {
        return res.status(400).json({ message: 'Email et lien de scan sont requis.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Votre lien de scan direct pour Cheik Qualité',
        html: `<p>Bonjour,</p>
               <p>Cliquez sur le lien ci-dessous pour scanner un produit instantanément :</p>
               <p><a href="${scanLink}">${scanLink}</a></p>
               <p>Cordialement,</p>
               <p>L\'équipe Cheik Qualité</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Lien de scan envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur détaillée lors de l\'envoi de l\'e-mail:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'envoi de l\'e-mail.',
            error: error.message
        });
  }
});

app.post('/api/contact-producer', async (req, res) => {
  const { producerEmail, message } = req.body;

  if (!producerEmail || !message) {
    return res.status(400).json({ message: 'Email du producteur et message sont requis.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'your_email@gmail.com', // Your email
    to: producerEmail,
    subject: 'Nouveau message de Cheik Qualité',
    html: `<p>Bonjour,</p>
           <p>Vous avez reçu un nouveau message d\'un utilisateur de Cheik Qualité :</p>
           <p>${message}</p>
           <p>Cordialement,</p>
           <p>L\'équipe Cheik Qualité</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail au producteur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: 'Email et message sont requis.' });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'Nouveau message de contact de Cheik Qualité',
    html: `<p>Vous avez reçu un nouveau message de : ${email}</p>
           <p>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
  } 
});

// ┌──────────────────────────────────┐
// │ --- ROUTES POUR LE PROFIL UTILISATEUR --- │
// └──────────────────────────────────┘

// Helper function to get user collection and query field
const getUserCollectionAndQuery = (role, userId) => {
    const isAgent = role === 'agent';
    const collection = isAgent ? db.collection('agents') : db.collection('users');
    const query = { _id: new ObjectId(userId) };
    return { collection, query };
};

// GET user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const userProfile = await collection.findOne(query, { projection: { password: 0 } }); // Exclude password

        if (!userProfile) {
            return res.status(404).json({ message: 'Profil utilisateur non trouvé.' });
        }
        res.json(userProfile);
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// PUT update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const { name, email, phone, healthConditions, profilePictureUrl } = req.body;

        const updateData = {
            $set: {
                name,
                email,
                phone,
                healthConditions,
                profilePictureUrl
            }
        };

        const result = await collection.updateOne(query, updateData);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Profil utilisateur non trouvé.' });
        }
        
        const updatedUser = await collection.findOne(query, { projection: { password: 0 } });
        res.json(updatedUser);

    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// POST upload profile picture
app.post('/api/user/upload-profile-picture', authenticateToken, uploadProfilePic.single('profilePicture'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }
    // The path should be relative to the server's root and use forward slashes
    const profilePictureUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.json({ profilePictureUrl });
});

// POST change password
app.post('/api/user/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.' });
        }

        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const user = await collection.findOne(query);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Le mot de passe actuel est incorrect.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await collection.updateOne(query, { $set: { password: hashedNewPassword } });

        res.json({ message: 'Mot de passe mis à jour avec succès.' });

    } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ┌───────────────────────────────────────────┐
// │ --- ROUTES POUR LES PARAMÈTRES DE NOTIFICATION --- │
// └───────────────────────────────────────────┘

// GET user notification settings
app.get('/api/settings', authenticateToken, async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const user = await collection.findOne(query);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Return user settings or default if not set
        const defaultSettings = { email: false, vocal: false, push: false };
        res.json(user.settings || defaultSettings);

    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// POST update user notification settings
app.post('/api/settings', authenticateToken, async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const { email, vocal, push } = req.body;

        // Basic validation
        if (typeof email !== 'boolean' || typeof vocal !== 'boolean' || typeof push !== 'boolean') {
            return res.status(400).json({ message: 'Format des paramètres invalide.' });
        }

        const result = await collection.updateOne(
            query,
            { $set: { settings: { email, vocal, push } } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        
        res.json({ message: 'Paramètres mis à jour avec succès.' });

    } catch (error) {
        console.error("Erreur lors de la mise à jour des paramètres:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// ┌───────────────────────────────────────────┐
// │ --- ROUTES POUR LA GESTION DES PERMISSIONS --- │
// └───────────────────────────────────────────┘


// GET permissions for a role
app.get('/api/permissions/:role', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { role } = req.params;
        const permissions = await db.collection('permissions').findOne({ role });

        if (!permissions) {
            // If no permissions are set for the role, return an empty array
            return res.json({ role, allowedRoutes: [] });
        }
        res.json(permissions);
    } catch (error) {
        console.error(`Erreur lors de la récupération des permissions pour le rôle ${req.params.role}:`, error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// PUT (update) permissions for a role
app.put('/api/permissions/:role', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { role } = req.params;
        const { allowedRoutes } = req.body;

        if (!Array.isArray(allowedRoutes)) {
            return res.status(400).json({ message: "allowedRoutes doit être un tableau." });
        }

        await db.collection('permissions').updateOne(
            { role },
            { $set: { role, allowedRoutes } },
            { upsert: true } // Creates the document if it doesn't exist
        );

        res.json({ message: `Permissions pour le rôle ${role} mises à jour avec succès.` });

    } catch (error) {
        console.error(`Erreur lors de la mise à jour des permissions pour le rôle ${req.params.role}:`, error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ┌───────────────────────────────────────────┐
// │ --- ROUTES POUR LA GESTION DES PERMISSIONS --- │
// └───────────────────────────────────────────┘

// Utiliser le même limiteur que pour l'authentification pour éviter le spam
app.post('/api/agent-applications', authLimiter, async (req, res) => {
  try {
    const { fullName, email, phone, region, motivation } = req.body;

    if (!fullName || !email || !phone || !region || !motivation) {
      return res.status(400).json({ message: "Tous les champs du formulaire sont requis." });
    }

    // Optionnel : Vérifier si une candidature avec cet email existe déjà
    const existingApplication = await db.collection('agent_applications').findOne({ email });
    if (existingApplication) {
      return res.status(409).json({ message: "Vous avez déjà soumis une candidature. Nous l'examinons." });
    }

    const newApplication = {
      fullName,
      email,
      phone,
      region,
      motivation,
      status: 'pending', // Statut par défaut
      submittedAt: new Date(),
    };

    await db.collection('agent_applications').insertOne(newApplication);
    res.status(201).json({ message: "Candidature soumise avec succès !" });

  } catch (error) {
    console.error("Erreur lors de la soumission de la candidature d'agent:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Vous aurez aussi besoin d'une route pour que les admins puissent voir ces candidatures
app.get('/api/agent-applications', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const applications = await db.collection('agent_applications').find({}).sort({ submittedAt: -1 }).toArray();
        res.json(applications);
    } catch (error) {
        console.error("Erreur lors de la récupération des candidatures d'agents:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Et une route pour approuver/rejeter les candidatures
app.put('/api/agent-applications/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Statut invalide." });
        }

        const result = await db.collection('agent_applications').updateOne(
            { _id: new ObjectId(applicationId) },
            { $set: { status: status } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Candidature non trouvée." });
        }

        // Si la candidature est approuvée, créez un compte agent
        if (status === 'approved') {
            const application = await db.collection('agent_applications').findOne({ _id: new ObjectId(applicationId) });
            
            const { fullName, email, region } = application;
            const randomPassword = Math.random().toString(36).slice(-8); // Générer un mot de passe aléatoire
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Vérifier si l'utilisateur existe déjà dans la collection 'users' ou 'agents'
            const existingUser = await db.collection('agents').findOne({ email });
            if (!existingUser) {
                await db.collection('agents').insertOne({
                    name: fullName,
                    email,
                    password: hashedPassword,
                    region,
                    status: 'Actif',
                    role: 'agent',
                    createdAt: new Date(),
                });
                
                // Ici, vous pourriez envoyer un email à l'agent avec son mot de passe
                // Prepare email for the new agent
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Votre compte Agent Cheik Qualité a été créé !',
                    html: `
                        <p>Bonjour ${fullName},</p>
                        <p>Bonne nouvelle ! Votre candidature pour devenir agent a été approuvée.</p>
                        <p>Vous pouvez maintenant vous connecter à votre tableau de bord en utilisant les identifiants suivants :</p>
                        <ul>
                            <li><strong>Nom d'utilisateur :</strong> ${email}</li>
                            <li><strong>Mot de passe :</strong> ${randomPassword}</li>
                        </ul>
                        <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
                        <p>Cordialement,</p>
                        <p>L'équipe Cheik Qualité</p>
                    `
                };

                // Send the email
                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email de bienvenue envoyé à ${email}`);
                } catch (emailError) {
                    console.error(`Erreur lors de l'envoi de l'email à ${email}:`, emailError);
                    // We don't block the main response for this, but we log the error
                }
            }
        }

        res.json({ message: `Candidature ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès.` });

    } catch (error) {
        console.error("Erreur lors du traitement de la candidature:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ┌───────────────────────────────────────────┐
// │ --- ROUTES POUR LA GESTION DIRECTE DES AGENTS --- │
// └───────────────────────────────────────────┘

// GET all agents
app.get('/api/agents', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const agents = await db.collection('agents').find({}).project({ password: 0 }).toArray(); // Exclude password
        res.json(agents);
    } catch (error) {
        console.error("Erreur lors de la récupération des agents:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// POST create a new agent
app.post('/api/agents', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { name, email, password, region, status } = req.body;

        if (!name || !email || !password || !region) {
            return res.status(400).json({ message: "Nom, email, mot de passe et région sont requis." });
        }

        const existingAgent = await db.collection('agents').findOne({ email });
        if (existingAgent) {
            return res.status(409).json({ message: "Un agent avec cet email existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAgent = {
            name,
            email,
            password: hashedPassword,
            region,
            status: status || 'Actif', // Default to 'Actif' if not provided
            role: 'agent', // Agents always have 'agent' role
            createdAt: new Date(),
        };

        await db.collection('agents').insertOne(newAgent);
        res.status(201).json({ message: "Agent créé avec succès !", agent: { name: newAgent.name, email: newAgent.email, region: newAgent.region, status: newAgent.status } });

    } catch (error) {
        console.error("Erreur lors de la création de l'agent:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// PUT update an agent
app.put('/api/agents/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const agentId = req.params.id;
        const { name, email, password, region, status } = req.body;
        const updateData = { name, email, region, status };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const result = await db.collection('agents').updateOne(
            { _id: new ObjectId(agentId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Agent non trouvé." });
        }

        res.json({ message: "Agent mis à jour avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'agent:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// DELETE an agent
app.delete('/api/agents/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const agentId = req.params.id;

        const result = await db.collection('agents').deleteOne({ _id: new ObjectId(agentId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Agent non trouvé." });
        }

        res.json({ message: "Agent supprimé avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la suppression de l'agent:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
