import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

const createHealthAdvice = async (req, res) => {
    try {
        const newAdvice = req.body;
        const db = getDB();
        const result = await db.collection('health_advice').insertOne(newAdvice);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error('Erreur lors de la création du conseil santé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateHealthAdvice = async (req, res) => {
    try {
        const adviceId = req.params.id;
        const updatedAdvice = req.body;
        const db = getDB();
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
};

const deleteHealthAdvice = async (req, res) => {
    try {
        const adviceId = req.params.id;
        const db = getDB();
        const result = await db.collection('health_advice').deleteOne({ _id: new ObjectId(adviceId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Conseil santé non trouvé' });
        }
        res.json({ message: 'Conseil santé supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du conseil santé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getHealthAdvice = async (req, res) => {
    try {
        const db = getDB();
        const healthAdvice = await db.collection('health_advice').find({}).toArray();
        res.json(healthAdvice);
    } catch (error) {
        console.error('Erreur lors de la récupération des conseils santé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const searchHealthAdvice = async (req, res) => {
    try {
        const query = req.query.q;
        const db = getDB();
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
};

export {
    createHealthAdvice,
    updateHealthAdvice,
    deleteHealthAdvice,
    getHealthAdvice,
    searchHealthAdvice
};
