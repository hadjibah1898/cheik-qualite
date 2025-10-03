import { getDB } from '../config/database.js';

const getPermissions = async (req, res) => {
    try {
        const { role } = req.params;
        const db = getDB();
        const permissions = await db.collection('permissions').findOne({ role });

        if (!permissions) {
            return res.json({ role, allowedRoutes: [] });
        }
        res.json(permissions);
    } catch (error) {
        console.error(`Erreur lors de la récupération des permissions pour le rôle ${req.params.role}:`, error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const updatePermissions = async (req, res) => {
    try {
        const { role } = req.params;
        const { allowedRoutes } = req.body;
        const db = getDB();

        if (!Array.isArray(allowedRoutes)) {
            return res.status(400).json({ message: "allowedRoutes doit être un tableau." });
        }

        await db.collection('permissions').updateOne(
            { role },
            { $set: { role, allowedRoutes } },
            { upsert: true }
        );

        res.json({ message: `Permissions pour le rôle ${role} mises à jour avec succès.` });

    } catch (error) {
        console.error(`Erreur lors de la mise à jour des permissions pour le rôle ${req.params.role}:`, error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export { getPermissions, updatePermissions };
