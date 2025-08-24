import React, { useState } from 'react';
import './Soumission.css';

const Soumission = () => {
    const [formData, setFormData] = useState({
        productName: '',
        producerName: '',
        category: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('Cliquez pour télécharger le certificat');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert("Veuillez télécharger le certificat ONCQ.");
            return;
        }
        // Simulation of form submission
        alert(`Soumission réussie ! Le produit "${formData.productName}" a été envoyé pour validation.`);
        
        // Reset form
        setFormData({
            productName: '',
            producerName: '',
            category: '',
            description: ''
        });
        setFile(null);
        setFileName('Cliquez pour télécharger le certificat');
        e.target.reset();
    };

    return (
        <>
            <div className="submission-container">
                <h2>Formulaire de Soumission de Produit</h2>
                <p>Veuillez remplir ce formulaire pour que votre produit certifié par l'ONCQ soit validé et affiché sur le site.</p>
                
                <form id="submission-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="product-name">Nom du Produit</label>
                        <input type="text" id="product-name" name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="producer-name">Nom du Producteur / Vendeur</label>
                        <input type="text" id="producer-name" name="producerName" value={formData.producerName} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Catégorie</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">-- Sélectionnez une catégorie --</option>
                            <option value="alimentaire">Alimentaire</option>
                            <option value="hygiene">Hygiène</option>
                            <option value="boisson">Boisson</option>
                            <option value="cosmetique">Cosmétique</option>
                            <option value="autres">Autres</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-description">Description du Produit</label>
                        <textarea id="product-description" name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="oncq-certificate">Certificat ONCQ (format PDF ou image)</label>
                        <label htmlFor="oncq-certificate" className="file-upload-label">
                            <i className="fas fa-file-upload"></i>
                            <span id="file-name">{fileName}</span>
                        </label>
                        <input type="file" id="oncq-certificate" name="oncq-certificate" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} required />
                    </div>

                    <button type="submit">
                        <i className="fas fa-paper-plane"></i> Soumettre pour validation
                    </button>
                </form>
            </div>
        </>
    );
};

export default Soumission;