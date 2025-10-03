// --- Configuration de la Connexion à la Base de Données MongoDB ---

// On importe le client MongoDB qui nous permet de nous connecter à la base de données.
import { MongoClient } from 'mongodb';

// On récupère l'URL de connexion à la base de données depuis les variables d'environnement.
// C'est une bonne pratique de ne pas écrire les informations sensibles (comme les mots de passe) directement dans le code.
const url = process.env.DATABASE_URL;

// Si l'URL n'est pas définie, on affiche une erreur et on arrête l'application.
// C'est une erreur "fatale" car l'application ne peut pas fonctionner sans base de données.
if (!url) {
  console.error("FATAL ERROR: DATABASE_URL is not defined in .env file.");
  process.exit(1);
}

// On crée une nouvelle instance du client MongoDB avec l'URL de connexion.
const client = new MongoClient(url);

// On définit le nom de notre base de données.
const dbName = 'cheik-qualite';

// On déclare une variable 'db' qui contiendra l'objet de la base de données une fois connecté.
// On utilise 'let' car sa valeur sera assignée plus tard.
let db;

// --- Fonction de Connexion ---
// Cette fonction asynchrone se connecte à MongoDB.
const connectDB = async () => {
  try {
    // On attend que le client se connecte au serveur MongoDB.
    await client.connect();
    console.log('Connecté à MongoDB');

    // Une fois connecté, on récupère l'objet de la base de données avec son nom.
    db = client.db(dbName);
  } catch (err) {
    // Si une erreur se produit pendant la connexion, on l'affiche dans la console et on arrête l'application.
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1);
  }
};

// --- Fonction pour récupérer la Base de Données ---
// Cette fonction retourne l'objet 'db' qui a été initialisé par connectDB.
// Les autres parties de notre application (les contrôleurs) utiliseront cette fonction
// pour obtenir une référence à la base de données et interagir avec elle.
const getDB = () => db;

// On exporte les deux fonctions pour qu'elles puissent être utilisées ailleurs dans le projet.
export { connectDB, getDB };