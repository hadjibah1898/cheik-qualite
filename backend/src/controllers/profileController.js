import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const getUserCollectionAndQuery = (role, userId) => {
    const db = getDB();
    const isAgent = role === 'agent';
    const collection = isAgent ? db.collection('agents') : db.collection('users');
    const query = { _id: new ObjectId(userId) };
    return { collection, query };
};

const getProfile = async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const userProfile = await collection.findOne(query, { projection: { password: 0 } });

        if (!userProfile) {
            return res.status(404).json({ message: 'Profil utilisateur non trouvé.' });
        }
        res.json(userProfile);
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const { name, email, phone, healthConditions, profilePictureUrl } = req.body;

        const updateData = {
            $set: {
                name,
                email,
                phone,
                healthConditions,
                profilePictureUrl
            }
        };

        const result = await collection.updateOne(query, updateData);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Profil utilisateur non trouvé.' });
        }

        const updatedUser = await collection.findOne(query, { projection: { password: 0 } });
        res.json(updatedUser);

    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const uploadProfilePicture = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }
    const profilePictureUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.json({ profilePictureUrl });
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.' });
        }

        const { collection, query } = getUserCollectionAndQuery(req.user.role, req.user.userId);
        const user = await collection.findOne(query);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Le mot de passe actuel est incorrect.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await collection.updateOne(query, { $set: { password: hashedNewPassword } });

        res.json({ message: 'Mot de passe mis à jour avec succès.' });

    } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export { getProfile, updateProfile, uploadProfilePicture, changePassword };
