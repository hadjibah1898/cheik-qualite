import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './AddMagazineForm.css';

const AddMagazineForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('coverImage', coverImage);
        formData.append('pdfFile', pdfFile);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/magazines', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setTitle('');
                setDescription('');
                setCoverImage(null);
                setPdfFile(null);
                // Clear file inputs if possible (or just the state)
                // e.target.reset(); // This line might not work as expected for file inputs
            } else {
                toast.error(`Erreur: ${data.message || 'Quelque chose s\'est mal passé.'}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du magazine:', error);
            toast.error('Erreur lors de la connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-magazine-form-container">
            <h3>Ajouter un Nouveau Magazine</h3>
            <form onSubmit={handleSubmit} className="add-magazine-form">
                <div className="form-group">
                    <label htmlFor="title">Titre du Magazine</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="coverImage">Image de Couverture</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            id="coverImage"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            required
                        />
                        <label htmlFor="coverImage" className="custom-file-upload">
                            {coverImage ? coverImage.name : 'Choisir une image'}
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="pdfFile">Fichier PDF du Magazine</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            id="pdfFile"
                            accept=".pdf"
                            onChange={(e) => setPdfFile(e.target.files[0])}
                            required
                        />
                        <label htmlFor="pdfFile" className="custom-file-upload">
                            {pdfFile ? pdfFile.name : 'Choisir un fichier PDF'}
                        </label>
                    </div>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Ajout en cours...' : 'Ajouter le Magazine'}
                </button>
            </form>
        </div>
    );
};

export default AddMagazineForm;