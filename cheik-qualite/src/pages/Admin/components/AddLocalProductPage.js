import React from 'react';
import { toast } from 'react-toastify';
import api from '../../../api.js';
import ProductForm from './ProductForm'; // Assuming ProductForm is in the same directory or a common components folder
import { useNavigate } from 'react-router-dom';

const AddLocalProductPage = () => {
    const navigate = useNavigate();

    const handleSaveProduct = async (formData, selectedFile) => {
        const dataToSend = new FormData();

        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }

        if (selectedFile) {
            dataToSend.append('productImage', selectedFile);
        }

        try {
                        await api.post('/api/local-products/submission', dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("Produit ajouté avec succès !");
            navigate('/admin?view=gestionProduitsLocaux'); // Redirect to the product management page
        } catch (error) {
            toast.error(error.response?.data?.message || "Une erreur est survenue lors de l'ajout du produit.");
        }
    };

    return (
        <div className="dashboard-section">
            <h2>Ajouter un Nouveau Produit Local</h2>
            <ProductForm onSave={handleSaveProduct} onCancel={() => navigate('/admin?view=gestionProduitsLocaux')} />
        </div>
    );
};

export default AddLocalProductPage;