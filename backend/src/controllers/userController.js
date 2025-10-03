import { getDB } from '../config/database.js';

const getUsers = async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection('users').find({}).project({ password: 0 }).toArray(); // Exclude password
        res.json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export { getUsers };
