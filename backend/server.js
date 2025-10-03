// --- Point d'entrée du serveur Backend ---
// Ce fichier est le tout premier fichier qui est exécuté quand on lance le serveur.

// On importe l'application Express depuis notre fichier app.js.
// app.js contient toute la configuration de notre application (routes, middlewares, etc.).
import app from './src/app.js';

// On importe la fonction pour se connecter à la base de données MongoDB.
import { connectDB } from './src/config/database.js';

// On définit le port sur lequel notre serveur va écouter.
// Il va d'abord chercher un port dans les variables d'environnement (process.env.PORT),
// ce qui est utile pour le déploiement. S'il n'en trouve pas, il utilise le port 5000 par défaut.
const port = process.env.PORT || 5000;

// On crée une fonction asynchrone pour démarrer le serveur.
// L'utilisation de "async" nous permet d'utiliser "await" à l'intérieur.
const startServer = async () => {
    // On attend que la connexion à la base de données soit établie avant de continuer.
    // C'est important car sans base de données, notre application ne peut pas fonctionner.
    await connectDB();

    // Une fois la connexion à la DB réussie, on démarre le serveur Express.
    // La fonction app.listen() fait en sorte que notre serveur écoute les requêtes HTTP sur le port défini.
    app.listen(port, () => {
        // Ce message s'affichera dans la console pour nous confirmer que le serveur a bien démarré.
        console.log(`Le serveur backend est démarré sur http://localhost:${port}`);
    });
};

// On appelle la fonction pour démarrer le serveur.
startServer();
