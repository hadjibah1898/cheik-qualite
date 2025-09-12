import React, { useState } from 'react';
import './DevenirAgent.css';
import { toast } from 'react-toastify';

const DevenirAgent = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        region: '',
        motivation: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: This endpoint needs to be created on the backend.
            const response = await fetch('http://localhost:5000/api/agent-applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Une erreur est survenue lors de la soumission.');
            }

            toast.success('Votre candidature a été envoyée avec succès ! Nous vous contacterons bientôt.');
            setFormData({ fullName: '', email: '', phone: '', region: '', motivation: '' });

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="devenir-agent-container">
            <div className="devenir-agent-card">
                <h2>Devenir un Agent de Qualité</h2>
                <p>Rejoignez notre réseau d'agents de terrain et contribuez à la valorisation des produits locaux guinéens. Remplissez le formulaire ci-dessous pour postuler.</p>
                
                <form onSubmit={handleSubmit} className="devenir-agent-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Nom Complet</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            value={formData.fullName} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Adresse Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Numéro de Téléphone</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="region">Région de couverture souhaitée</label>
                        <select 
                            id="region" 
                            name="region" 
                            value={formData.region} 
                            onChange={handleInputChange} 
                            required
                        >
                            <option value="">Sélectionner une région</option>
                            <option value="Conakry">Conakry</option>
                            <option value="Kindia">Kindia</option>
                            <option value="Labé">Labé</option>
                            <option value="Kankan">Kankan</option>
                            <option value="N'Zérékoré">N'Zérékoré</option>
                            <option value="Boké">Boké</option>
                            <option value="Faranah">Faranah</option>
                            <option value="Mamou">Mamou</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="motivation">Vos motivations</label>
                        <textarea 
                            id="motivation" 
                            name="motivation" 
                            rows="5" 
                            value={formData.motivation} 
                            onChange={handleInputChange} 
                            placeholder="Expliquez brièvement pourquoi vous souhaitez devenir un agent..." 
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-application-btn">Envoyer ma candidature</button>
                </form>
            </div>
        </div>
    );
};

// We need a new page component to wrap this form
const DevenirAgentPage = () => {
    return (
        // You might want to add your Layout component here if it's not handled by the router globally
        <DevenirAgent />
    );
};

export default DevenirAgentPage;
