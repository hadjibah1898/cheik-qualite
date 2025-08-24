import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // Import Nodemailer

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Should be in .env in production

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

const app = express();
const port = 5000;

const url = 'mongodb+srv://mouhamaddjoulde1998:lmCujlEw957U3P0e@clients.uxjtons.mongodb.net/cheikqualite';
const client = new MongoClient(url);

const dbName = 'cheik-qualite';
let db;

app.use(cors());
app.use(express.json());

client.connect().then(() => {
    console.log('Connecté à MongoDB');
    db = client.db(dbName);
}).catch(err => {
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1);
});

app.get('/', (req, res) => {
  res.send('Bonjour depuis le backend !');
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis.' });
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
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await db.collection('products').insertOne(newProduct);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
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

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
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
app.post('/api/health-advice', authenticateToken, async (req, res) => {
  try {
    const newAdvice = req.body;
    const result = await db.collection('health_advice').insertOne(newAdvice);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Erreur lors de la création du conseil santé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/health-advice/:id', authenticateToken, async (req, res) => {
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

app.delete('/api/health-advice/:id', authenticateToken, async (req, res) => {
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


// API Routes
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
    const barcode = req.params.barcode;
    const product = await db.collection('products').findOne({ barcode: barcode });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produit non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du produit par code-barres:', error);
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

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services or SMTP
    auth: {
        user: process.env.EMAIL_USER || 'your_email@gmail.com', // Use environment variables for security
        pass: process.env.EMAIL_PASS || 'your_email_password' // Use environment variables for security
    }
});

// Endpoint to send scan link via email
app.post('/api/send-scan-link', async (req, res) => {
    const { email, scanLink } = req.body;

    if (!email || !scanLink) {
        return res.status(400).json({ message: 'Email et lien de scan sont requis.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'your_email@gmail.com',
        to: email,
        subject: 'Votre lien de scan direct pour Cheik Qualité',
        html: `<p>Bonjour,</p>
               <p>Cliquez sur le lien ci-dessous pour scanner un produit instantanément :</p>
               <p><a href="${scanLink}">${scanLink}</a></p>
               <p>Cordialement,</p>
               <p>L'équipe Cheik Qualité</p>`
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
           <p>Vous avez reçu un nouveau message d'un utilisateur de Cheik Qualité :</p>
           <p>${message}</p>
           <p>Cordialement,</p>
           <p>L'équipe Cheik Qualité</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail au producteur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
  }
});

app.listen(port, () => {
  console.log(`Le serveur backend est démarré sur http://localhost:${port}`);
});
