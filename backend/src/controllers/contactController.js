import transporter from '../services/emailService.js';

const sendScanLink = async (req, res) => {
    const { email, scanLink } = req.body;

    if (!email || !scanLink) {
        return res.status(400).json({ message: 'Email et lien de scan sont requis.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Votre lien de scan direct pour Cheik Qualité',
        html: `<p>Bonjour,</p>
               <p>Cliquez sur le lien ci-dessous pour scanner un produit instantanément :</p>
               <p><a href="${scanLink}">${scanLink}</a></p>
               <p>Cordialement,</p>
               <p>L\'équipe Cheik Qualité</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Lien de scan envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur détaillée lors de l\'envoi de l\'e-mail:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'envoi de l\'e-mail.',
            error: error.message
        });
    }
};

const contactProducer = async (req, res) => {
    const { producerEmail, message } = req.body;

    if (!producerEmail || !message) {
        return res.status(400).json({ message: 'Email du producteur et message sont requis.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'your_email@gmail.com',
        to: producerEmail,
        subject: 'Nouveau message de Cheik Qualité',
        html: `<p>Bonjour,</p>
               <p>Vous avez reçu un nouveau message d\'un utilisateur de Cheik Qualité :</p>
               <p>${message}</p>
               <p>Cordialement,</p>
               <p>L\'équipe Cheik Qualité</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail au producteur:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
    }
};

const contact = async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ message: 'Email et message sont requis.' });
    }

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Nouveau message de contact de Cheik Qualité',
        html: `<p>Vous avez reçu un nouveau message de : ${email}</p>
               <p>${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
    }
};

export { sendScanLink, contactProducer, contact };
