import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

const submitCertificate = async (req, res) => {
    try {
        const { productName, productType, barcode, batchNumber, origin, description, oncqNumber, validityPeriod } = req.body;
        const db = getDB();

        const certificatePath = req.files.certificate ? req.files.certificate[0].path : null;
        const productImagePaths = req.files.productImages ? req.files.productImages.map(file => file.path) : [];

        if (!certificatePath) {
            return res.status(400).json({ message: 'Certificate file is required.' });
        }

        const newCertificate = {
            productName,
            productType,
            barcode,
            batchNumber,
            origin,
            description,
            oncqNumber,
            validityPeriod,
            certificatePath,
            productImagePaths,
            submissionDate: new Date()
        };

        const result = await db.collection('certificates').insertOne(newCertificate);
        res.status(201).json({ message: 'Certificate submitted successfully', certificateId: result.insertedId });
    } catch (error) {
        console.error('Error submitting certificate:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyCertificate = async (req, res) => {
    try {
        const identifier = req.params.identifier;
        const db = getDB();
        const certificate = await db.collection('certificates').findOne({
            $or: [
                { barcode: identifier },
                { oncqNumber: identifier }
            ]
        });

        if (certificate) {
            res.json({ isCertified: true, certificate });
        } else {
            res.status(404).json({ isCertified: false, message: 'Produit non certifié ou identifiant inconnu.' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du certificat:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export { submitCertificate, verifyCertificate };
