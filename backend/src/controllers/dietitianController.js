import { getDB } from '../config/database.js';

const addDietitian = async (req, res) => {
    try {
        const { name, niveau, specialite, bio, forfait } = req.body;
        const db = getDB();
        const photoPath = req.file ? req.file.path : null;

        if (!name || !niveau || !specialite || !bio || !forfait) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        const newDietitian = {
            name,
            niveau,
            specialite,
            bio,
            forfait,
            photoUrl: photoPath ? `/${photoPath.replace(/\\/g, '/')}` : null,
            createdAt: new Date(),
        };

        const result = await db.collection('dietitians').insertOne(newDietitian);
        res.status(201).json({ message: 'Diététicien ajouté avec succès', dietitian: newDietitian });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du diététicien:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export { addDietitian };
