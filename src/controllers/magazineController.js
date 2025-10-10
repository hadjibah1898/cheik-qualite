import { getDB } from '../config/database.js';

const addMagazine = async (req, res) => {
    try {
        const { title, description } = req.body;
        const db = getDB();
        const coverImagePath = req.files.coverImage ? req.files.coverImage[0].path : null;
        const pdfFilePath = req.files.pdfFile ? req.files.pdfFile[0].path : null;

        if (!title || !description || !coverImagePath || !pdfFilePath) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newMagazine = {
            title,
            description,
            coverImageUrl: coverImagePath,
            pdfUrl: pdfFilePath,
            createdAt: new Date()
        };

        const result = await db.collection('magazines').insertOne(newMagazine);
        res.status(201).json({ message: 'Magazine added successfully', magazineId: result.insertedId });
    } catch (error) {
        console.error('Error adding magazine:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { addMagazine };
