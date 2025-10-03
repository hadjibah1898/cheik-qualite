// --- Configuration Principale de l'Application Express ---

// Importe les modules nécessaires.
import 'dotenv/config'; // Pour charger les variables d'environnement depuis un fichier .env
import express from 'express'; // Le framework principal pour construire notre API
import cors from 'cors'; // Middleware pour autoriser les requêtes depuis d'autres origines (notre frontend)
import helmet from 'helmet'; // Middleware pour sécuriser l'application en ajoutant divers en-têtes HTTP
import fs from 'fs'; // Module 'File System' de Node.js, pour interagir avec les fichiers

// --- Importation de toutes nos routes ---
// Chaque fichier de route regroupe les URLs pour une ressource spécifique (ex: produits, utilisateurs, etc.).
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import localProductRoutes from './routes/localProductRoutes.js';
import healthAdviceRoutes from './routes/healthAdviceRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import magazineRoutes from './routes/magazineRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import dietitianRoutes from './routes/dietitianRoutes.js';
import producerRoutes from './routes/producerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import agentRoutes from './routes/agentRoutes.js';


// On crée une instance de l'application Express.
const app = express();

// --- Middlewares Globaux ---
// Les middlewares sont des fonctions qui s'exécutent pour chaque requête reçue par le serveur.

app.use(helmet()); // Ajoute des en-têtes de sécurité pour protéger contre des attaques connues.

// Configuration CORS pour n'autoriser que le frontend
const allowedOrigins = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (comme Postman) en développement
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Applique la configuration CORS

app.use(express.json({ limit: '50mb' })); // Permet à Express de comprendre le JSON envoyé dans les corps de requête (POST, PUT). La limite est augmentée pour les uploads d'images en Base64.


// --- Définition des Routes de l'API ---
// C'est ici qu'on dit à Express comment gérer les différentes URLs de notre API.

// Route simple pour la racine de l'API, pour vérifier que le serveur fonctionne.
app.get('/', (req, res) => {
  res.send('Bonjour depuis le backend refactorisé !');
});

// On associe chaque fichier de routes à un préfixe d'URL.
// Par exemple, toutes les routes définies dans `authRoutes` commenceront par `/api/auth`.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/local-products', localProductRoutes);
app.use('/api/health-advice', healthAdviceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/magazines', magazineRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dietitians', dietitianRoutes);
app.use('/api/producers', producerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api', contactRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/agents', agentRoutes);


// On exporte l'application 'app' pour qu'elle puisse être utilisée par d'autres fichiers (notamment server.js).
export default app;