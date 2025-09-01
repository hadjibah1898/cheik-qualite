import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './SoumissionCertificat.css'; // Assuming a CSS file for this component

const SoumissionCertificat = () => {
    const [formData, setFormData] = useState({
        productName: '',
        productType: '',
        barcode: '',
        batchNumber: '',
        origin: '',
        description: '',
        oncqNumber: '',
        validityPeriod: '',
        certificate: null,
        productImages: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'certificate') {
            setFormData(prev => ({ ...prev, certificate: files[0] }));
        } else if (name === 'productImages') {
            setFormData(prev => ({ ...prev, productImages: [...files] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            if (key === 'productImages') {
                for (let i = 0; i < formData.productImages.length; i++) {
                    data.append('productImages', formData.productImages[i]);
                }
            } else if (key === 'certificate') {
                data.append('certificate', formData.certificate);
            } else {
                data.append(key, formData[key]);
            }
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/certificates', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                // Reset form data
                setFormData({
                    productName: '',
                    productType: '',
                    barcode: '',
                    batchNumber: '',
                    origin: '',
                    description: '',
                    oncqNumber: '',
                    validityPeriod: '',
                    certificate: null,
                    productImages: []
                });
                // Clear file inputs visually (if needed, usually handled by state reset)
            } else {
                toast.error(`Erreur: ${result.message || 'Quelque chose s\'est mal passé.'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la soumission du certificat:', error);
            toast.error('Erreur lors de la connexion au serveur.');
        }
    };

    return (
        <div className="dashboard-section">
            <h3>Soumettre un nouveau certificat</h3>
            <form onSubmit={handleSubmit} className="certificate-submission-form">
                {/* Section: Informations sur le Produit */}
                <div className="form-section">
                    <h4>Informations sur le Produit</h4>
                    <div className="form-group">
                        <label htmlFor="productName">Nom du produit</label>
                        <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productType">Type de produit</label>
                        <input type="text" id="productType" name="productType" value={formData.productType} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barcode">Numéro de code-barres</label>
                        <input type="text" id="barcode" name="barcode" value={formData.barcode} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="batchNumber">Numéro de lot</label>
                        <input type="text" id="batchNumber" name="batchNumber" value={formData.batchNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="origin">Origine du produit</label>
                        <input type="text" id="origin" name="origin" value={formData.origin} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description du produit</label>
                        <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                </div>

                {/* Section: Détails de la Certification */}
                <div className="form-section">
                    <h4>Détails de la Certification</h4>
                    <div className="form-group">
                        <label htmlFor="oncqNumber">Numéro de certification ONCQ</label>
                        <input type="text" id="oncqNumber" name="oncqNumber" value={formData.oncqNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="validityPeriod">Période de validité</label>
                        <input type="text" id="validityPeriod" name="validityPeriod" value={formData.validityPeriod} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="certificate">Fichier du certificat (PDF, JPG, etc.)</label>
                        <div className="file-input-wrapper">
                            <input type="file" id="certificate" name="certificate" accept=".pdf,image/*" onChange={handleFileChange} required />
                            <label htmlFor="certificate" className="custom-file-upload">
                                {formData.certificate ? formData.certificate.name : 'Choisir un fichier'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Section: Images du Produit */}
                <div className="form-section">
                    <h4>Images du Produit</h4>
                    <div className="form-group">
                        <label htmlFor="productImages">Images du produit (5 max)</label>
                        <div className="file-input-wrapper">
                            <input type="file" id="productImages" name="productImages" accept="image/*" onChange={handleFileChange} multiple max="5" />
                            <label htmlFor="productImages" className="custom-file-upload">
                                {formData.productImages.length > 0 ? `${formData.productImages.length} fichier(s) sélectionné(s)` : 'Choisir des images'}
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-btn">Soumettre le certificat</button>
            </form>
        </div>
    );
};

export default SoumissionCertificat;