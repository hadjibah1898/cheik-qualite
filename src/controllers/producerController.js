import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

const getProducers = async (req, res) => {
    try {
        const db = getDB();
        const producers = await db.collection('producers').find({}).toArray();
        res.json(producers);
    } catch (error) {
        console.error('Erreur lors de la récupération des producteurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getCertifiedProducersCount = async (req, res) => {
    try {
        const db = getDB();
        const certifiedProducersCount = await db.collection('producers').countDocuments({ status: 'certified' });
        res.json({ count: certifiedProducersCount });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de producteurs certifiés:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const createProducer = async (req, res) => {
    try {
        const { name, region, tags, phone, email } = req.body;
        const db = getDB();
        const imagePath = req.file ? req.file.path : null;

        if (!name || !region || !tags || !phone || !email) {
            return res.status(400).json({ message: 'Nom, région, tags, téléphone et email du producteur sont requis.' });
        }

        const newProducer = {
            name,
            region,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            phone,
            email,
            image: imagePath ? `/${imagePath.replace(/\\/g, '/')}` : null,
            createdAt: new Date(),
        };

        const result = await db.collection('producers').insertOne(newProducer);
        res.status(201).json({ message: 'Producteur ajouté avec succès', producer: newProducer });
    } catch (error) {
        console.error('Erreur lors de la création du producteur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateProducer = async (req, res) => {
    try {
        const producerId = req.params.id;
        const { name, region, tags, phone, email } = req.body;
        const db = getDB();
        const imagePath = req.file ? req.file.path : null;

        const updateData = {
            name,
            region,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            phone,
            email,
        };

        if (imagePath) {
            updateData.image = `/${imagePath.replace(/\\/g, '/')}`;
        }

        const result = await db.collection('producers').updateOne(
            { _id: new ObjectId(producerId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Producteur non trouvé.' });
        }

        res.json({ message: 'Producteur mis à jour avec succès !' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du producteur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const searchProducers = async (req, res) => {
    try {
        const query = req.query.q;
        const db = getDB();
        const producers = await db.collection('producers').find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { region: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
        res.json(producers);
    } catch (error) {
        console.error('Erreur lors de la recherche de producteurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export {
    getProducers,
    getCertifiedProducersCount,
    createProducer,
    updateProducer,
    searchProducers
};
