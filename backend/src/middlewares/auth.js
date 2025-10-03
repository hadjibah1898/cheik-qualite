// --- Fichier de Middlewares d'Authentification ---
// Un middleware est une fonction qui s'exécute entre la requête du client et la réponse du serveur.
// Il peut lire et modifier les objets `req` (requête) and `res` (réponse).

import 'dotenv/config';
import jwt from 'jsonwebtoken'; // 'jsonwebtoken' pour créer et vérifier les JSON Web Tokens.

// On récupère la clé secrète pour les JWT depuis les variables d'environnement.
const JWT_SECRET = process.env.JWT_SECRET;

// Si la clé secrète n'est pas définie, c'est une erreur fatale.
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
  process.exit(1);
}

// --- Middleware pour authentifier un token JWT ---
const authenticateToken = (req, res, next) => {
  // On récupère l'en-tête 'Authorization' de la requête.
  // Le format est généralement "Bearer TOKEN".
  const authHeader = req.headers['authorization'];
  // On extrait le token de l'en-tête.
  const token = authHeader && authHeader.split(' ')[1];

  // Si aucun token n'est fourni, on renvoie une erreur 401 (Unauthorized).
  if (token == null) return res.sendStatus(401);

  // On vérifie si le token est valide.
  // jwt.verify décode le token en utilisant la clé secrète.
  jwt.verify(token, JWT_SECRET, (err, user) => {
    // Si le token est invalide (expiré, malformé...), on renvoie une erreur 403 (Forbidden).
    if (err) return res.sendStatus(403);

    // Si le token est valide, les informations de l'utilisateur (payload du token) sont dans l'objet 'user'.
    // On attache ces informations à l'objet `req` pour que les prochains middlewares ou les contrôleurs puissent y accéder.
    req.user = user;

    // On appelle `next()` pour passer au prochain middleware ou à la fonction du contrôleur.
    // Si on n'appelle pas next(), la requête restera bloquée.
    next();
  });
};

// --- Middleware pour autoriser uniquement les administrateurs ---
const authorizeAdmin = (req, res, next) => {
  // Ce middleware doit s'exécuter APRES `authenticateToken`,
  // car il a besoin de `req.user` qui est défini par `authenticateToken`.
  
  // On vérifie si le rôle de l'utilisateur (stocké dans le token) est bien 'admin'.
  if (req.user.role !== 'admin') {
    // Si l'utilisateur n'est pas un admin, on renvoie une erreur 403 (Forbidden).
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  
  // Si l'utilisateur est un admin, on passe à la suite.
  next();
};

// On exporte les middlewares pour les utiliser dans les fichiers de routes.
export { authenticateToken, authorizeAdmin };