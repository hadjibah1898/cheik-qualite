import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './GestionProduitsLocaux.css'; // Assuming CSS is shared or imported where needed

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(product || {
        name: '', category: '', description: '', producer: '', region: '', barcode: '', certification: ''
    });
    const [productImage, setProductImage] = useState(product?.imageUrl || null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log("Fichier sélectionné:", file); // Debug log
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProductImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setProductImage(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, selectedFile);
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
                <div className="form-group">
                    <label>Nom du Produit</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Catégorie</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>

            <div className="form-section">
                <div className="form-group">
                    <label>Producteur</label>
                    <input type="text" name="producer" value={formData.producer} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Région</label>
                    <input type="text" name="region" value={formData.region} onChange={handleChange} />
                </div>
            </div>

            <div className="form-section">
                <div className="form-group">
                    <label>Code-barres</label>
                    <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Certification</label>
                    <input type="text" name="certification" value={formData.certification} onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label>Image (URL or upload)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {productImage && <img src={productImage} alt="Preview" className="form-image-preview" />}
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
            </div>
        </form>
    );
};

export default ProductForm;