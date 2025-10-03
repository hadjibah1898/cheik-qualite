import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

const createAlert = async (req, res) => {
    try {
        const { title, message } = req.body;
        const db = getDB();

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
};

const deleteAlert = async (req, res) => {
    try {
        const alertId = req.params.id;
        const db = getDB();
        const result = await db.collection('alerts').deleteOne({ _id: new ObjectId(alertId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Alerte non trouvée.' });
        }
        res.json({ message: 'Alerte supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'alerte:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const getAlerts = async (req, res) => {
    try {
        const db = getDB();
        const alerts = await db.collection('alerts').find({}).sort({ createdAt: -1 }).toArray();
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export { createAlert, deleteAlert, getAlerts };
