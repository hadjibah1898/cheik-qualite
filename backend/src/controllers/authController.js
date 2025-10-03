import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/database.js';
import { validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const db = getDB();
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
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = getDB();

        if (!username || !password) {
            return res.status(400).json({ message: "Nom d'utilisateur et mot de passe sont requis." });
        }

        let user = await db.collection('users').findOne({ username });
        if (!user) {
            user = await db.collection('agents').findOne({ email: username });
        }

        if (!user) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        const tokenUsername = user.role === 'agent' ? user.email : user.username;
        const token = jwt.sign({ userId: user._id, username: tokenUsername, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getPermissions = async (req, res) => {
    try {
        const userRole = req.user.role;
        const db = getDB();

        if (userRole === 'admin') {
            const allAdminRoutes = [
                '/admin', '/soumission-certificat', '/notifications', 
                '/profil', '/soumission', '/verifier-produit', 
                '/recherche-avancee', '/agent/dashboard'
            ];
            return res.json({ allowedRoutes: allAdminRoutes });
        }

        const permissions = await db.collection('permissions').findOne({ role: userRole });

        const defaultUserRoutes = ['/notifications', '/profil', '/soumission', '/verifier-produit', '/recherche-avancee'];

        if (!permissions) {
            if (userRole === 'user') {
                 return res.json({ allowedRoutes: defaultUserRoutes });
            }
            return res.json({ allowedRoutes: [] });
        }
        
        res.json(permissions);

    } catch (error) {
        console.error(`Erreur lors de la récupération des permissions pour l\'utilisateur:`, error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export { register, login, getPermissions };
