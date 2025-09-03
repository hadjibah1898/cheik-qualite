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

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

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
const port = 5000;

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
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
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

const startServer = async () => {
  try {
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
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Nom d\'utilisateur déjà pris.' });
    }

    await usersCollection.insertOne({ username, password: hashedPassword, role: 'user' });
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe incorrect.' });
    }

    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
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
app.post('/api/local-products-submission', authenticateToken, authorizeAdmin, uploadProduct.single('productImage'), async (req, res) => {
  try {
    const { productName, description, category } = req.body; // Assuming these fields from the form
    const productImagePath = req.file ? req.file.path : null;

    if (!productName || !description || !category || !productImagePath) {
      return res.status(400).json({ message: 'Nom, description, catégorie et image du produit sont requis.' });
    }

    const newLocalProduct = {
      name: productName,
      description,
      category,
      imageUrl: `/${productImagePath.replace(/\\/g, '/')}`,
      badge: 'Certifié ONCQ', // Default badge for local products
      createdAt: new Date(),
    };

    const result = await db.collection('local_products').insertOne(newLocalProduct);
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

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await db.collection('notifications').find({}).toArray();
    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
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
    const localProducts = await db.collection('local_products').find({}).toArray();
    res.json(localProducts);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits locaux:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();
    const chatbotKnowledge = await db.collection('chatbot').find({}).toArray();

    let response = "Désolé, je n\'ai pas compris votre question. Pouvez-vous reformuler ?";

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
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
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

