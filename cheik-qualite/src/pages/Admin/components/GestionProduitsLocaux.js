import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../api.js';
import './GestionProduitsLocaux.css'; // We will create this CSS file

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

// --- Product Form Component ---
const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(product || {
        name: '', category: '', description: '', region: '', barcode: '', certification: ''
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
            <h4>Informations Générales</h4>
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

            <h4>Détails du Producteur et Localisation</h4>
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

            <h4>Identification et Certification</h4>
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

            <h4>Image du Produit</h4>
            <div className="form-group">
                <label htmlFor="productImageUpload" className="custom-file-upload">
                    Image (URL ou téléchargement)
                </label>
                <input
                    id="productImageUpload" // Add an ID to link with the label
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }} // Hide the native input
                />
                {productImage && <img src={productImage} alt="Preview" className="form-image-preview" />}
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
            </div>
        </form>
    );
};

// --- Main Component ---
const GestionProduitsLocaux = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/local-products');
            setProducts(response.data.products || []);
        } catch (error) {
            toast.error("Erreur lors de la récupération des produits.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSaveProduct = async (formData, selectedFile) => {
        try {
            const token = localStorage.getItem('token'); // Get the token
            if (!token) {
                toast.error("Vous n'êtes pas autorisé. Veuillez vous connecter.");
                return;
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Add Authorization header
            };

            let productData = { ...formData };

            if (selectedFile) {
                // Convert selected file to Base64 for submission
                const reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                await new Promise(resolve => {
                    reader.onloadend = () => {
                        productData.productImage = reader.result;
                        resolve();
                    };
                });
            } else if (editingProduct && editingProduct.imageUrl) {
                // If no new file selected, but editing an existing product with an image, retain it
                productData.productImage = editingProduct.imageUrl;
            }

            if (editingProduct) {
                // Update existing product
                await api.put(`/api/local-products/${editingProduct._id}`, productData, {
                    headers: headers,
                });
                toast.success("Produit mis à jour avec succès !");
            } else {
                // Create new product
                const newProductData = {
                    productName: productData.name, // Map frontend 'name' to backend 'productName'
                    description: productData.description,
                    category: productData.category,
                    region: productData.region,
                    barcode: productData.barcode,
                    certification: productData.certification,
                    productImage: productData.productImage, // This should already be Base64
                };
                await api.post('/api/local-products-submission', newProductData, {
                    headers: headers,
                });
                toast.success("Produit ajouté avec succès !");
            }
            fetchProducts();
            closeModal();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du produit:", error);
            toast.error(error.response?.data?.message || "Une erreur est survenue.");
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            try {
                const token = localStorage.getItem('token');
                console.log('Token for delete request:', token); // Debugging line
                await api.delete(`/api/local-products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                toast.success("Produit supprimé avec succès !");
                fetchProducts();
            } catch (error) {
                toast.error("Erreur lors de la suppression du produit.");
            }
        }
    };

    const openModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="dashboard-section gestion-produits-locaux">
            <div className="section-header">
                <h2>Gestion des Produits Locaux</h2>
                <button onClick={() => openModal()} className="btn btn-primary">Ajouter un Produit</button>
            </div>

            {isLoading ? <p>Chargement...</p> : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Nom</th>
                                <th>Catégorie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id}>
                                    <td><img src={p.imageUrl.startsWith('data:image') ? p.imageUrl : `${process.env.REACT_APP_BACKEND_URL}${p.imageUrl}`} alt={p.name} className="table-image" /></td>
                                    <td>{p.name}</td>
                                    <td>{p.category}</td>
                                    <td className="action-cell">
                                        <button onClick={() => openModal(p)} className="btn btn-secondary">Modifier</button>
                                        <button onClick={() => handleDeleteProduct(p._id)} className="btn btn-danger">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? "Modifier le Produit" : "Ajouter un Produit"}>
                <ProductForm 
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
};

export default GestionProduitsLocaux;