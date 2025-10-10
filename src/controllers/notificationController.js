import { getDB } from '../config/database.js';

const getNotifications = async (req, res) => {
    try {
        const db = getDB();
        const notifications = await db.collection('notifications').find({}).sort({ createdAt: -1 }).toArray();
        res.json(notifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export { getNotifications };
