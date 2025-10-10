import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import transporter from '../services/emailService.js';

// Agent Applications
const applyAsAgent = async (req, res) => {
    try {
        const { fullName, email, phone, region, motivation } = req.body;
        const db = getDB();

        if (!fullName || !email || !phone || !region || !motivation) {
            return res.status(400).json({ message: "Tous les champs du formulaire sont requis." });
        }

        const existingApplication = await db.collection('agent_applications').findOne({ email });
        if (existingApplication) {
            return res.status(409).json({ message: "Vous avez déjà soumis une candidature. Nous l'examinons." });
        }

        const newApplication = {
            fullName,
            email,
            phone,
            region,
            motivation,
            status: 'pending',
            submittedAt: new Date(),
        };

        await db.collection('agent_applications').insertOne(newApplication);
        res.status(201).json({ message: "Candidature soumise avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la soumission de la candidature d'agent:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getAgentApplications = async (req, res) => {
    try {
        const db = getDB();
        const applications = await db.collection('agent_applications').find({}).sort({ submittedAt: -1 }).toArray();
        res.json(applications);
    } catch (error) {
        console.error("Erreur lors de la récupération des candidatures d'agents:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const processAgentApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;
        const db = getDB();

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Statut invalide." });
        }

        const result = await db.collection('agent_applications').updateOne(
            { _id: new ObjectId(applicationId) },
            { $set: { status: status } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Candidature non trouvée." });
        }

        if (status === 'approved') {
            const application = await db.collection('agent_applications').findOne({ _id: new ObjectId(applicationId) });
            const { fullName, email, region } = application;
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const existingAgent = await db.collection('agents').findOne({ email });
            if (!existingAgent) {
                await db.collection('agents').insertOne({
                    name: fullName,
                    email,
                    password: hashedPassword,
                    region,
                    status: 'Actif',
                    role: 'agent',
                    createdAt: new Date(),
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Votre compte Agent Cheik Qualité a été créé !',
                    html: `
                        <p>Bonjour ${fullName},</p>
                        <p>Bonne nouvelle ! Votre candidature pour devenir agent a été approuvée.</p>
                        <p>Vous pouvez maintenant vous connecter à votre tableau de bord en utilisant les identifiants suivants :</p>
                        <ul>
                            <li><strong>Nom d'utilisateur :</strong> ${email}</li>
                            <li><strong>Mot de passe :</strong> ${randomPassword}</li>
                        </ul>
                        <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
                        <p>Cordialement,</p>
                        <p>L'équipe Cheik Qualité</p>
                    `
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email de bienvenue envoyé à ${email}`);
                } catch (emailError) {
                    console.error(`Erreur lors de l'envoi de l'email à ${email}:`, emailError);
                }
            }
        }

        res.json({ message: `Candidature ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès.` });

    } catch (error) {
        console.error("Erreur lors du traitement de la candidature:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const deleteAgentApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const db = getDB();
        const result = await db.collection('agent_applications').deleteOne({ _id: new ObjectId(applicationId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Candidature non trouvée." });
        }

        res.json({ message: "Candidature supprimée avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la suppression de la candidature:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Direct Agent Management
const getAgents = async (req, res) => {
    try {
        const db = getDB();
        const agents = await db.collection('agents').find({}).project({ password: 0 }).toArray();
        res.json(agents);
    } catch (error) {
        console.error("Erreur lors de la récupération des agents:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const createAgent = async (req, res) => {
    try {
        const { name, email, password, region, status } = req.body;
        const db = getDB();

        if (!name || !email || !password || !region) {
            return res.status(400).json({ message: "Nom, email, mot de passe et région sont requis." });
        }

        const existingAgent = await db.collection('agents').findOne({ email });
        if (existingAgent) {
            return res.status(409).json({ message: "Un agent avec cet email existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAgent = {
            name,
            email,
            password: hashedPassword,
            region,
            status: status || 'Actif',
            role: 'agent',
            createdAt: new Date(),
        };

        await db.collection('agents').insertOne(newAgent);
        res.status(201).json({ message: "Agent créé avec succès !", agent: { name: newAgent.name, email: newAgent.email, region: newAgent.region, status: newAgent.status } });

    } catch (error) {
        console.error("Erreur lors de la création de l'agent:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const updateAgent = async (req, res) => {
    try {
        const agentId = req.params.id;
        const { name, email, password, region, status } = req.body;
        const db = getDB();
        const updateData = { name, email, region, status };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const result = await db.collection('agents').updateOne(
            { _id: new ObjectId(agentId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Agent non trouvé." });
        }

        res.json({ message: "Agent mis à jour avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'agent:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const deleteAgent = async (req, res) => {
    try {
        const agentId = req.params.id;
        const db = getDB();
        const result = await db.collection('agents').deleteOne({ _id: new ObjectId(agentId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Agent non trouvé." });
        }

        res.json({ message: "Agent supprimé avec succès !" });

    } catch (error) {
        console.error("Erreur lors de la suppression de l'agent:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export {
    applyAsAgent,
    getAgentApplications,
    processAgentApplication,
    deleteAgentApplication,
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent
};
