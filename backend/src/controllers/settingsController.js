import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

const getUserCollectionAndQuery = (role, userId) => {
    const db = getDB();
    const isAgent = role === 'agent';
    const collection = isAgent ? db.collection('agents') : db.collection('users');
    const query = { _id: new ObjectId(userId) };
    return { collection, query };
};

const getSettings = async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const user = await collection.findOne(query);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const defaultSettings = { email: false, vocal: false, push: false };
        res.json(user.settings || defaultSettings);

    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const { email, vocal, push } = req.body;

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
};

export { getSettings, updateSettings };
