import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const SoumissionProduitLocal = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        description: ''
    });
    const [productImage, setProductImage] = useState(null);
    const [imageFileName, setImageFileName] = useState('Sélectionner une image de produit');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null); // 'success' or 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setProductImage(selectedFile);
            setImageFileName(selectedFile.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null); // Clear previous messages

        if (!productImage) {
            setMessage("Veuillez télécharger une image de produit.");
            setMessageType('error');
            return;
        }

        const data = new FormData();
        data.append('productName', formData.productName);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('productImage', productImage);

        try {
            // Assuming the token is stored in localStorage or a similar place after login
            const token = localStorage.getItem('token'); 
            if (!token) {
                setMessage("Vous devez être connecté en tant qu'administrateur pour soumettre un produit.");
                setMessageType('error');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/local-products-submission', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage(response.data.message || 'Produit local ajouté avec succès !');
            setMessageType('success');
            
            // Reset form
            setFormData({
                productName: '',
                category: '',
                description: ''
            });
            setProductImage(null);
            setImageFileName('Sélectionner une image de produit');
            e.target.reset();

            if (onProductAdded) {
                onProductAdded(); // Call the callback to refresh the list
            }

        } catch (error) {
            console.error('Erreur lors de la soumission du produit local:', error);
            setMessage(error.response?.data?.message || 'Erreur lors de l\'ajout du produit local.');
            setMessageType('error');
        }
    };

    return (
        <div className="dashboard-section">
            <h2>Formulaire de Soumission de Produit Local</h2>
            <p>Veuillez remplir ce formulaire pour ajouter un nouveau produit local.</p>
            
            {message && (
                <div className={`form-message ${messageType}`}>
                    {messageType === 'success' && <i className="fas fa-check-circle"></i>}
                    {messageType === 'error' && <i className="fas fa-exclamation-circle"></i>}
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="product-name">Nom du Produit</label>
                    <input type="text" id="product-name" name="productName" value={formData.productName} onChange={handleChange} required />
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
                    <label htmlFor="product-image">Image du Produit (JPG, PNG)</label>
                    <label htmlFor="product-image" className="file-upload-label" style={{border: '1px solid #ddd', padding: '10px', display: 'block', cursor: 'pointer'}}>
                        <i className="fas fa-image"></i>
                        <span id="image-file-name">{imageFileName}</span>
                    </label>
                    <input type="file" id="product-image" name="productImage" accept=".jpg, .jpeg, .png" onChange={handleImageChange} required style={{display: 'none'}} />
                </div>

                <button type="submit" className="submit-btn">
                    <i className="fas fa-plus-circle"></i> Ajouter Produit Local
                </button>
            </form>
        </div>
    );
};

export default SoumissionProduitLocal;
