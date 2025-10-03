import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './SubmitProductForm.css';

const SubmitProductForm = () => {
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('category', category);
        formData.append('description', description);
        if (imageFile) {
            formData.append('productImage', imageFile);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Produit soumis avec succès !');
                // Clear form
                setProductName('');
                setCategory('');
                setDescription('');
                setImageFile(null);
            } else {
                toast.error(`Erreur lors de la soumission: ${data.message || 'Veuillez réessayer.'}`);
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            toast.error('Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-product-form-container">
            <h3>Soumettre un Nouveau Produit Local</h3>
            <form onSubmit={handleSubmit} className="submit-product-form">
                <div className="form-group">
                    <label htmlFor="productName">Nom du Produit:</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Catégorie:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="productImage">Image du Produit:</label>
                    <input
                        type="file"
                        id="productImage"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Soumission en cours...' : 'Soumettre le Produit'}
                </button>
            </form>
        </div>
    );
};

export default SubmitProductForm;
