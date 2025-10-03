import { getDB } from '../config/database.js';

const getChatbotKnowledge = async (req, res) => {
    try {
        const db = getDB();
        const chatbotKnowledge = await db.collection('chatbot').find({}).toArray();
        res.json(chatbotKnowledge);
    } catch (error) {
        console.error('Erreur lors de la récupération des connaissances du chatbot:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const chat = async (req, res) => {
    try {
        const userMessage = req.body.message.toLowerCase();
        const db = getDB();
        const chatbotKnowledge = await db.collection('chatbot').find({}).toArray();

        let response = "Désolé, je n'ai pas compris votre question. Pouvez-vous reformuler ?";

        for (const entry of chatbotKnowledge) {
            if (entry.keywords.some(keyword => userMessage.includes(keyword))) {
                response = entry.response;
                break;
            }
        }
        res.json({ response: response });
    } catch (error) {
        console.error('Erreur lors du traitement du message du chatbot:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export { getChatbotKnowledge, chat };
